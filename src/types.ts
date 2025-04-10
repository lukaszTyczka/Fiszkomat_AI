import type { Database } from "./db/database.types";

// Core database entity types
// Extracting rows from database tables

type DeckRow = Database["public"]["Tables"]["decks"]["Row"];
type FlashcardRow = Database["public"]["Tables"]["flashcards"]["Row"];
type AIGenerationStatsRow = Database["public"]["Tables"]["ai_generation_stats"]["Row"];
type ErrorLogRow = Database["public"]["Tables"]["error_logs"]["Row"];

// Adding FlashcardOrigin type to indicate who added the flashcard: user or ai
export type FlashcardOrigin = Database["public"]["Enums"]["flashcard_origin"];

/**
 * DTOs for Deck entity.
 */

// DeckDTO used for fetching deck details
export type DeckDTO = Pick<DeckRow, "id" | "name" | "created_at" | "updated_at">;

// Command model for creating a new deck.
// Only the 'name' field is provided by the client.
export interface DeckCreateCommand {
  name: string;
}

// Command model for updating a deck.
// Only the 'name' field can be updated.
export interface DeckUpdateCommand {
  name: string;
}

/**
 * DTOs for Flashcard entity.
 */

// FlashcardDTO used for standard flashcard retrieval
export type FlashcardDTO = Pick<FlashcardRow, "id" | "question" | "answer" | "origin" | "created_at" | "updated_at">;

// Command model for creating a new flashcard
export interface FlashcardCreateCommand {
  question: string;
  answer: string;
}

// Command model for updating an existing flashcard
export interface FlashcardUpdateCommand {
  question: string;
  answer: string;
}

// Command model for batch creation of flashcards
export interface BatchFlashcardsCreateCommand {
  flashcards: FlashcardCreateCommand[];
  ai_model_name?: string | null;
}

/**
 * DTOs for AI Flashcard Generation.
 */

// Command model to generate flashcards using AI
export interface GenerateFlashcardsCommand {
  deck_id: string;
  source_text: string;
}

// AI generated flashcard suggestion DTO
export interface AIGeneratedSuggestionDTO {
  temp_id: string;
  question: string;
  answer: string;
}

// DTO for the AI flashcard generation response
export interface AIGeneratedSuggestionsDTO {
  suggestions: AIGeneratedSuggestionDTO[];
}

/**
 * DTOs for Spaced Repetition System (SRS).
 */

// Flashcard DTO for SRS session, includes the next review date
export type SRSFlashcardDTO = Pick<FlashcardRow, "id" | "question" | "answer" | "next_review_date">;

// Flashcard DTO for flashcard review after SRS session,
// includes scheduling data: interval and last ease factor
export type SRSFlashcardReviewDTO = Pick<
  FlashcardRow,
  "id" | "question" | "answer" | "next_review_date" | "interval" | "last_ease_factor"
>;

// Command model for submitting a flashcard review
export interface SRSReviewCommand {
  rating: "poor" | "average" | "good";
}

/**
 * DTOs for AI Generation Stats.
 */

// DTO for AI generation statistics, omitting internal user_id field
export type AiGenerationStatsDTO = Omit<AIGenerationStatsRow, "user_id">;

/**
 * DTOs for Error Logs (Admin).
 */

// DTO for error logs, including selected fields
export type ErrorLogDTO = Pick<ErrorLogRow, "id" | "user_id" | "error_level" | "error_message" | "created_at">;

/**
 * Common response DTOs.
 */

// Generic message DTO for delete responses
export interface MessageDTO {
  message: string;
}

// Generic paginated response DTO
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}
