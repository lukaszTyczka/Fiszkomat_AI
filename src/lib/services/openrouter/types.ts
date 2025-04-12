import { z } from "zod";

export interface ModelParameters {
  temperature: number;
  max_tokens: number;
  top_p: number;
}

// Base schema for chat response
const responseSchema = z.object({
  message: z.string(),
  metadata: z.object({
    timestamp: z.string(),
  }),
});

// Response format configuration
export interface ResponseFormat {
  type: "json_schema";
  json_schema: {
    name: string;
    strict: true;
    schema: Record<string, unknown>;
  };
}

export interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

export interface RateLimitConfig {
  maxRequestsPerMinute: number;
  maxConcurrentRequests: number;
}

export interface SiteConfig {
  siteUrl: string;
  appTitle: string;
}

export interface OpenRouterConfig {
  apiKey?: string;
  modelName?: string;
  modelParameters?: Partial<ModelParameters>;
  systemMessage?: string;
  retryConfig?: Partial<RetryConfig>;
  rateLimitConfig?: Partial<RateLimitConfig>;
  timeoutMs?: number;
  siteConfig?: Partial<SiteConfig>;
}

// API Error response
export interface ApiErrorResponse {
  message: string;
  code?: string;
  type?: string;
}

// Convert Zod schema to JSON Schema
const zodToJsonSchema = (schema: z.ZodType): Record<string, unknown> => {
  const jsonSchema: Record<string, unknown> = {};

  if (schema instanceof z.ZodObject) {
    jsonSchema.type = "object";
    jsonSchema.properties = {};
    const required: string[] = [];

    const shape = schema._def.shape();
    for (const [key, value] of Object.entries(shape)) {
      if (value instanceof z.ZodType) {
        (jsonSchema.properties as Record<string, unknown>)[key] = zodToJsonSchema(value);
        required.push(key);
      }
    }

    if (required.length > 0) {
      jsonSchema.required = required;
    }
  } else if (schema instanceof z.ZodString) {
    jsonSchema.type = "string";
  }

  return jsonSchema;
};

// Export the schema and its JSON Schema representation
export const chatResponseSchema = responseSchema;
export type ChatResponse = z.infer<typeof chatResponseSchema>;
export const chatResponseJsonSchema = zodToJsonSchema(responseSchema);

// Default configurations
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
};

export const DEFAULT_RATE_LIMIT_CONFIG: RateLimitConfig = {
  maxRequestsPerMinute: 60,
  maxConcurrentRequests: 5,
};

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  siteUrl: "https://fiszkomat.ai",
  appTitle: "Fiszkomat AI",
};
