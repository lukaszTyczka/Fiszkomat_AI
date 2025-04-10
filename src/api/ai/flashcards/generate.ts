import { z } from "zod";
import type { APIRoute } from "astro";
import type { GenerateFlashcardsCommand, AIGeneratedSuggestionsDTO } from "@/types";
import { AIService } from "@/lib/services/ai.service";
import { ErrorLoggerService } from "@/lib/services/error-logger.service";

// Disable prerendering for this API route
export const prerender = false;

// Input validation schema
const generateFlashcardsSchema = z.object({
  deck_id: z.string().uuid(),
  source_text: z.string().min(1000).max(10000),
});

export const POST: APIRoute = async ({ request, locals }) => {
  const errorLogger = new ErrorLoggerService(locals.supabase);
  const aiService = new AIService();

  try {
    // Get supabase client from context
    const supabase = locals.supabase;

    // Ensure user is authenticated
    if (!locals.user) {
      const error = new Error("Unauthorized access");
      await errorLogger.logError(error, "warning");
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = generateFlashcardsSchema.parse(body) as GenerateFlashcardsCommand;

    // Verify deck ownership
    const { data: deck, error: deckError } = await supabase
      .from("decks")
      .select("id")
      .eq("id", validatedData.deck_id)
      .eq("user_id", locals.user.id)
      .single();

    if (deckError || !deck) {
      const error = new Error(deckError?.message || "Deck not found or access denied");
      await errorLogger.logError(error, "warning", locals.user.id);
      return new Response(JSON.stringify({ error: "Deck not found or access denied" }), { status: 404 });
    }

    // Generate flashcards using AI service
    const suggestions = await aiService.generateFlashcards(validatedData.source_text);

    // Format response with AI model information
    const response: AIGeneratedSuggestionsDTO = {
      suggestions: suggestions.map((s) => ({
        ...s,
        origin: "ai" as const,
        ai_model_name: "openrouter/mistralai/mistral-7b-instruct",
      })),
    };

    return new Response(JSON.stringify(response), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error: unknown) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      const validationError = new Error("Invalid input data");
      await errorLogger.logError(validationError, "warning", locals.user?.id);
      return new Response(JSON.stringify({ error: "Invalid input data", details: error.errors }), { status: 400 });
    }

    // Handle other errors
    const finalError = error instanceof Error ? error : new Error("Unknown error occurred");
    await errorLogger.logError(finalError, "error", locals.user?.id);

    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
};
