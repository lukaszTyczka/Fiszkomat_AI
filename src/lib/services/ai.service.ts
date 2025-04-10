import { v4 as uuidv4 } from "uuid";
import type { AIGeneratedSuggestionDTO } from "@/types";

const AI_MODEL = "openrouter/mistralai/mistral-7b-instruct";

interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export class AIService {
  private apiKey: string;

  constructor() {
    this.apiKey = import.meta.env.OPENROUTER_API_KEY;
    if (!this.apiKey) {
      throw new Error("OPENROUTER_API_KEY environment variable is not set");
    }
  }

  private async callOpenRouter(prompt: string): Promise<OpenRouterResponse> {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": import.meta.env.PUBLIC_SITE_URL,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are a helpful AI that generates flashcards from text. Generate 5-10 question-answer pairs that cover the most important concepts from the provided text. Each question should be clear and specific. Each answer should be concise (max 400 characters) but complete.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`AI service error: ${response.statusText}`);
    }

    return response.json();
  }

  private parseAIResponse(content: string): AIGeneratedSuggestionDTO[] {
    // Split content into lines and process each QA pair
    const lines = content.split("\n").filter((line) => line.trim());
    const suggestions: AIGeneratedSuggestionDTO[] = [];

    let currentQuestion = "";

    for (const line of lines) {
      if (line.startsWith("Q:") || line.startsWith("Question:")) {
        if (currentQuestion) {
          // If we have an unprocessed question, skip it as it has no answer
          currentQuestion = "";
        }
        currentQuestion = line.replace(/^(Q:|Question:)\s*/, "").trim();
      } else if ((line.startsWith("A:") || line.startsWith("Answer:")) && currentQuestion) {
        const answer = line.replace(/^(A:|Answer:)\s*/, "").trim();
        if (answer.length <= 400 && currentQuestion.length <= 400) {
          suggestions.push({
            temp_id: uuidv4(),
            question: currentQuestion,
            answer: answer,
          });
        }
        currentQuestion = "";
      }
    }

    return suggestions;
  }

  async generateFlashcards(sourceText: string): Promise<AIGeneratedSuggestionDTO[]> {
    try {
      const aiResponse = await this.callOpenRouter(sourceText);
      const content = aiResponse.choices[0]?.message?.content;

      if (!content) {
        throw new Error("Empty response from AI service");
      }

      const suggestions = this.parseAIResponse(content);

      if (suggestions.length === 0) {
        throw new Error("No valid flashcards could be generated from AI response");
      }

      return suggestions;
    } catch (error: unknown) {
      let errorMessage = "An unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      throw new Error(`Failed to generate flashcards: ${errorMessage}`);
    }
  }
}
