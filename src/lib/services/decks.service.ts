import type { SupabaseClient } from "@supabase/supabase-js";
import type { DeckDTO, DeckCreateCommand } from "../../types";

export class DecksService {
  constructor(private readonly supabase: SupabaseClient) {}

  async listDecks(
    page = 1,
    limit = 10,
    sortBy = "created_at",
    order: "asc" | "desc" = "desc"
  ): Promise<{ data: DeckDTO[]; total: number }> {
    const start = (page - 1) * limit;

    const {
      data: decks,
      error,
      count,
    } = await this.supabase
      .from("decks")
      .select("id, name, created_at, updated_at", { count: "exact" })
      .order(sortBy, { ascending: order === "asc" })
      .range(start, start + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch decks: ${error.message}`);
    }

    return {
      data: decks as DeckDTO[],
      total: count ?? 0,
    };
  }

  async createDeck(command: DeckCreateCommand): Promise<DeckDTO> {
    const { data: deck, error } = await this.supabase
      .from("decks")
      .insert([{ name: command.name }])
      .select("id, name, created_at, updated_at")
      .single();

    if (error) {
      throw new Error(`Failed to create deck: ${error.message}`);
    }

    return deck as DeckDTO;
  }

  async getDeck(id: string): Promise<DeckDTO | null> {
    const { data: deck, error } = await this.supabase
      .from("decks")
      .select("id, name, created_at, updated_at")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Failed to fetch deck: ${error.message}`);
    }

    return deck as DeckDTO;
  }

  async updateDeck(id: string, command: DeckCreateCommand): Promise<DeckDTO | null> {
    const { data: deck, error } = await this.supabase
      .from("decks")
      .update({ name: command.name })
      .eq("id", id)
      .select("id, name, created_at, updated_at")
      .single();

    if (error) {
      throw new Error(`Failed to update deck: ${error.message}`);
    }

    return deck as DeckDTO;
  }

  async deleteDeck(id: string): Promise<void> {
    const { error } = await this.supabase.from("decks").delete().eq("id", id);

    if (error) {
      throw new Error(`Failed to delete deck: ${error.message}`);
    }
  }
}
