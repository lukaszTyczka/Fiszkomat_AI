import type { APIRoute } from "astro";
import { DecksService } from "../../lib/services/decks.service";
import { ErrorLoggerService } from "../../lib/services/error-logger.service";
import { listDecksQuerySchema, createDeckSchema } from "../../lib/schemas/decks";

export const prerender = false;

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    // Parse and validate query parameters
    const url = new URL(request.url);
    const queryResult = listDecksQuerySchema.safeParse({
      page: url.searchParams.get("page"),
      limit: url.searchParams.get("limit"),
      sort_by: url.searchParams.get("sort_by"),
      order: url.searchParams.get("order"),
    });

    if (!queryResult.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid query parameters",
          details: queryResult.error.issues,
        }),
        { status: 400 }
      );
    }

    const decksService = new DecksService(locals.supabase);
    const { data: decks, total } = await decksService.listDecks(
      queryResult.data.page,
      queryResult.data.limit,
      queryResult.data.sort_by,
      queryResult.data.order
    );

    return new Response(
      JSON.stringify({
        data: decks,
        page: queryResult.data.page,
        limit: queryResult.data.limit,
        total,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    const errorLogger = new ErrorLoggerService(locals.supabase);
    await errorLogger.logError(error instanceof Error ? error : new Error(String(error)), "error", locals.user?.id);

    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const validationResult = createDeckSchema.safeParse(body);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid request body",
          details: validationResult.error.issues,
        }),
        { status: 400 }
      );
    }

    const decksService = new DecksService(locals.supabase);
    const deck = await decksService.createDeck(validationResult.data);

    return new Response(JSON.stringify(deck), {
      status: 201,
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
