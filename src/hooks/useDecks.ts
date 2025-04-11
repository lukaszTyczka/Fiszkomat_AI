import { useState, useCallback, useEffect } from "react";
import type { DeckDTO, DeckCreateCommand, PaginatedResponse } from "@/types";

interface DeckViewModel {
  id: string;
  name: string;
  createdAt: Date;
}

interface UseDecksReturn {
  decks: DeckViewModel[];
  isLoading: boolean;
  isCreating: boolean;
  isDeleting: Record<string, boolean>;
  error: Error | null;
  currentPage: number;
  totalDecks: number;
  hasMore: boolean;
  loadMoreDecks: () => Promise<void>;
  createDeck: (name: string) => Promise<void>;
  deleteDeck: (deckId: string) => Promise<void>;
}

const LIMIT = 10;

export function useDecks(): UseDecksReturn {
  const [decks, setDecks] = useState<DeckViewModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDecks, setTotalDecks] = useState(0);
  const hasMore = currentPage * LIMIT < totalDecks;

  const fetchDecks = useCallback(async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/decks?page=${page}&limit=${LIMIT}`);
      if (!response.ok) throw new Error("Failed to fetch decks");

      const data: PaginatedResponse<DeckDTO> = await response.json();

      const newDecks = data.data.map((deck) => ({
        id: deck.id,
        name: deck.name,
        createdAt: new Date(deck.created_at),
      }));

      setDecks((prev) => (page === 1 ? newDecks : [...prev, ...newDecks]));
      setTotalDecks(data.total);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMoreDecks = useCallback(async () => {
    if (isLoading || !hasMore) return;
    await fetchDecks(currentPage + 1);
  }, [currentPage, isLoading, hasMore, fetchDecks]);

  const createDeck = useCallback(async (name: string) => {
    try {
      setIsCreating(true);
      setError(null);

      const response = await fetch("/api/decks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name } as DeckCreateCommand),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create deck");
      }

      const newDeck: DeckDTO = await response.json();
      setDecks((prev) => [
        {
          id: newDeck.id,
          name: newDeck.name,
          createdAt: new Date(newDeck.created_at),
        },
        ...prev,
      ]);
      setTotalDecks((prev) => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to create deck"));
      throw err;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const deleteDeck = useCallback(async (deckId: string) => {
    try {
      setIsDeleting((prev) => ({ ...prev, [deckId]: true }));
      setError(null);

      const response = await fetch(`/api/decks/${deckId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete deck");
      }

      setDecks((prev) => prev.filter((deck) => deck.id !== deckId));
      setTotalDecks((prev) => prev - 1);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to delete deck"));
      throw err;
    } finally {
      setIsDeleting((prev) => ({ ...prev, [deckId]: false }));
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchDecks(1);
  }, [fetchDecks]);

  return {
    decks,
    isLoading,
    isCreating,
    isDeleting,
    error,
    currentPage,
    totalDecks,
    hasMore,
    loadMoreDecks,
    createDeck,
    deleteDeck,
  };
}
