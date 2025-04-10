import type { APIRoute } from "astro";
import { DecksService } from "../../lib/services/decks.service";
import { ErrorLoggerService } from "../../lib/services/error-logger.service";
import { deckIdParamSchema, createDeckSchema } from "../../lib/schemas/decks";

export const prerender = false;

export const GET: APIRoute = async ({ params, locals }) => {
  try {
    const validationResult = deckIdParamSchema.safeParse(params);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid deck ID",
          details: validationResult.error.issues,
        }),
        { status: 400 }
      );
    }

    const decksService = new DecksService(locals.supabase);
    const deck = await decksService.getDeck(validationResult.data.deckId);

    if (!deck) {
      return new Response(JSON.stringify({ error: "Deck not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(deck), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    const errorLogger = new ErrorLoggerService(locals.supabase);
    await errorLogger.logError(error instanceof Error ? error : new Error(String(error)), "error", locals.user?.id);

    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
};

export const PUT: APIRoute = async ({ request, params, locals }) => {
  try {
    const paramValidation = deckIdParamSchema.safeParse(params);
    if (!paramValidation.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid deck ID",
          details: paramValidation.error.issues,
        }),
        { status: 400 }
      );
    }

    const body = await request.json();
    const bodyValidation = createDeckSchema.safeParse(body);
    if (!bodyValidation.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid request body",
          details: bodyValidation.error.issues,
        }),
        { status: 400 }
      );
    }

    const decksService = new DecksService(locals.supabase);
    const deck = await decksService.updateDeck(paramValidation.data.deckId, bodyValidation.data);

    if (!deck) {
      return new Response(JSON.stringify({ error: "Deck not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(deck), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    const errorLogger = new ErrorLoggerService(locals.supabase);
    await errorLogger.logError(error instanceof Error ? error : new Error(String(error)), "error", locals.user?.id);

    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  try {
    const validationResult = deckIdParamSchema.safeParse(params);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid deck ID",
          details: validationResult.error.issues,
        }),
        { status: 400 }
      );
    }

    const decksService = new DecksService(locals.supabase);
    await decksService.deleteDeck(validationResult.data.deckId);

    return new Response(null, { status: 204 });
  } catch (error) {
    const errorLogger = new ErrorLoggerService(locals.supabase);
    await errorLogger.logError(error instanceof Error ? error : new Error(String(error)), "error", locals.user?.id);

    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
};
