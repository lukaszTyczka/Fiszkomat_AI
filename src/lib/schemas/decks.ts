import { z } from "zod";

export const listDecksQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sort_by: z.enum(["name", "created_at"]).default("created_at"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export const createDeckSchema = z.object({
  name: z.string().min(1).max(100).trim(),
});

export const deckIdParamSchema = z.object({
  deckId: z.string().uuid(),
});

export type ListDecksQuery = z.infer<typeof listDecksQuerySchema>;
export type CreateDeckBody = z.infer<typeof createDeckSchema>;
export type DeckIdParam = z.infer<typeof deckIdParamSchema>;
