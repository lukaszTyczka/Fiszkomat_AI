import {
  type ModelParameters,
  type ResponseFormat,
  type OpenRouterConfig,
  type ChatResponse,
  type RetryConfig,
  type RateLimitConfig,
  type ApiErrorResponse,
  type SiteConfig,
  chatResponseSchema,
  chatResponseJsonSchema,
  DEFAULT_RETRY_CONFIG,
  DEFAULT_RATE_LIMIT_CONFIG,
  DEFAULT_SITE_CONFIG,
} from "./openrouter/types";

/**
 * Service for interacting with OpenRouter API
 */
export class OpenRouterService {
  private readonly apiEndpoint: string;
  private readonly apiKey: string;
  private modelName: string;
  private modelParameters: ModelParameters;
  private systemMessage: string;
  private readonly responseFormat: ResponseFormat;
  private readonly logger: Console;
  private readonly retryConfig: RetryConfig;
  private readonly rateLimitConfig: RateLimitConfig;
  private readonly timeoutMs: number;
  private readonly siteConfig: SiteConfig;

  // Rate limiting state
  private requestCount = 0;
  private requestQueue: Promise<void>[] = [];
  private lastRequestTime = 0;

  constructor(config?: OpenRouterConfig) {
    // Initialize API endpoint and key from environment variables
    this.apiEndpoint = import.meta.env.OPENROUTER_API_ENDPOINT || "https://openrouter.ai/api/v1/chat/completions";
    this.apiKey = config?.apiKey || import.meta.env.OPENROUTER_API_KEY;

    if (!this.apiKey) {
      throw new Error("OpenRouter API key is required");
    }

    // Initialize model configuration
    this.modelName = config?.modelName || "openai/gpt-4o-mini";

    this.modelParameters = {
      temperature: config?.modelParameters?.temperature ?? 0.7,
      max_tokens: config?.modelParameters?.max_tokens ?? 1500,
      top_p: config?.modelParameters?.top_p ?? 1,
    };

    // Set default system message
    this.systemMessage = config?.systemMessage || "You are a helpful assistant.";

    // Initialize response format schema
    this.responseFormat = {
      type: "json_schema",
      json_schema: {
        name: "ChatResponse",
        strict: true,
        schema: chatResponseJsonSchema,
      },
    };

    // Initialize configurations
    this.retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config?.retryConfig };
    this.rateLimitConfig = { ...DEFAULT_RATE_LIMIT_CONFIG, ...config?.rateLimitConfig };
    this.timeoutMs = config?.timeoutMs ?? 30000;
    this.siteConfig = {
      ...DEFAULT_SITE_CONFIG,
      ...config?.siteConfig,
      siteUrl: config?.siteConfig?.siteUrl || import.meta.env.SITE_URL || DEFAULT_SITE_CONFIG.siteUrl,
    };

    // Initialize logger
    this.logger = console;
  }

  /**
   * Sends a chat request to the OpenRouter API
   * @param systemMessage - Optional override for the default system message
   * @param userMessage - The user's message to send to the API
   * @returns Promise<ChatResponse> - The validated API response
   */
  public async sendChatRequest(userMessage: string, systemMessage?: string): Promise<ChatResponse> {
    try {
      await this._checkRateLimit();
      const payload = this._buildPayload(systemMessage || this.systemMessage, userMessage);
      const response = await this._makeRequestWithRetry(payload);
      return this._handleResponse(response);
    } catch (error) {
      this._logError(error as Error);
      throw error;
    } finally {
      this._updateRateLimitState();
    }
  }

  /**
   * Updates the default system message
   */
  public setSystemMessage(message: string): void {
    if (!message.trim()) {
      throw new Error("System message cannot be empty");
    }
    this.systemMessage = message;
  }

  /**
   * Updates the model parameters
   */
  public updateModelParameters(params: Partial<ModelParameters>): void {
    this.modelParameters = {
      ...this.modelParameters,
      ...params,
    };
  }

  /**
   * Returns the current response format configuration
   */
  public getResponseFormat(): ResponseFormat {
    return { ...this.responseFormat };
  }

  /**
   * Builds the payload for the API request
   */
  private _buildPayload(systemMessage: string, userMessage: string): object {
    return {
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      message: "What?",
      model: this.modelName,
      ...this.modelParameters,
      //response_format: this.responseFormat,
    };
  }

  /**
   * Makes the HTTP request to the OpenRouter API with retry logic
   */
  private async _makeRequestWithRetry(payload: object, attempt = 1): Promise<unknown> {
    try {
      return await Promise.race([
        this._makeRequest(payload),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Request timeout")), this.timeoutMs)),
      ]);
    } catch (error) {
      if (this._shouldRetry(error as Error, attempt)) {
        const delay = this._calculateBackoff(attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this._makeRequestWithRetry(payload, attempt + 1);
      }
      throw error;
    }
  }

  /**
   * Makes the HTTP request to the OpenRouter API
   */
  private async _makeRequest(payload: object): Promise<unknown> {
    const response = await fetch(this.apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
        "HTTP-Referer": this.siteConfig.siteUrl,
        "X-Title": this.siteConfig.appTitle,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = (await response.json().catch(() => ({ message: "Unknown error" }))) as ApiErrorResponse;
      throw new Error(`API request failed: ${error.message}`);
    }
    const rawResponse = await response.json();
    return rawResponse.choices[0].message;
  }

  /**
   * Validates and processes the API response
   */
  private _handleResponse(rawResponse: unknown): ChatResponse {
    try {
      return chatResponseSchema.parse(rawResponse);
    } catch (error) {
      this._logError(error as Error);
      throw new Error("Invalid response format from OpenRouter API");
    }
  }

  /**
   * Determines if a request should be retried based on the error and attempt number
   */
  private _shouldRetry(error: Error, attempt: number): boolean {
    if (attempt >= this.retryConfig.maxRetries) {
      return false;
    }

    // Retry on network errors or 5xx server errors
    return (
      error.message.includes("timeout") ||
      error.message.includes("network") ||
      error.message.includes("5") ||
      error.message.includes("Server Error")
    );
  }

  /**
   * Calculates the backoff delay for retries using exponential backoff
   */
  private _calculateBackoff(attempt: number): number {
    const delay = Math.min(
      this.retryConfig.initialDelay * Math.pow(this.retryConfig.backoffFactor, attempt - 1),
      this.retryConfig.maxDelay
    );
    // Add jitter to prevent thundering herd
    return delay + Math.random() * 1000;
  }

  /**
   * Checks if the request can be made within rate limits
   */
  private async _checkRateLimit(): Promise<void> {
    const now = Date.now();

    // Clean up old requests
    this.requestQueue = this.requestQueue.filter((promise) => promise !== Promise.resolve());

    // Check rate limits
    if (
      this.requestCount >= this.rateLimitConfig.maxRequestsPerMinute ||
      this.requestQueue.length >= this.rateLimitConfig.maxConcurrentRequests
    ) {
      const delay = Math.max(60000 - (now - this.lastRequestTime), 1000);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return this._checkRateLimit();
    }

    // Add request to queue
    const request = Promise.resolve();
    this.requestQueue.push(request);
    return request;
  }

  /**
   * Updates the rate limit state after a request
   */
  private _updateRateLimitState(): void {
    this.requestCount++;
    this.lastRequestTime = Date.now();

    // Reset count after 1 minute
    setTimeout(() => {
      this.requestCount--;
    }, 60000);
  }

  /**
   * Logs errors with contextual information
   */
  private _logError(error: Error): void {
    this.logger.error("[OpenRouterService Error]:", {
      message: error.message,
      timestamp: new Date().toISOString(),
      modelName: this.modelName,
    });
  }
}
