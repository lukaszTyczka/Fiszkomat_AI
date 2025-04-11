import { useRef, useCallback, useEffect, useState, useMemo, useOptimistic } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useDecks } from "@/hooks/useDecks";
import { PlusIcon } from "@radix-ui/react-icons";
import { DeckCard } from "@/components/DeckCard";
import { CreateDeckDialog } from "@/components/CreateDeckDialog";
import { DeleteDeckConfirmationDialog } from "@/components/DeleteDeckConfirmationDialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-semibold mb-4">No Decks Yet</h2>
      <p className="text-muted-foreground mb-8">Create your first deck to start learning!</p>
      <Button onClick={onCreateClick}>
        <PlusIcon className="mr-2 h-4 w-4" />
        Create Deck
      </Button>
    </div>
  );
}

export default function DeckList() {
  const {
    decks: serverDecks,
    isLoading,
    isCreating,
    isDeleting,
    error,
    hasMore,
    loadMoreDecks,
    createDeck,
    deleteDeck,
  } = useDecks();

  const [optimisticDecks, addOptimisticDeck] = useOptimistic(
    serverDecks,
    (state, newDeck: { id: string; name: string; createdAt: Date }) => [...state, newDeck]
  );

  const [decksToDelete, addDeckToDelete] = useOptimistic(
    new Set<string>(),
    (state, deckId: string) => new Set([...state, deckId])
  );

  const [isPending, setPending] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createError, setCreateError] = useState<Error | null>(null);
  const [deleteDialogState, setDeleteDialogState] = useState<{ isOpen: boolean; deckId: string; deckName: string }>({
    isOpen: false,
    deckId: "",
    deckName: "",
  });
  const [focusedDeckIndex, setFocusedDeckIndex] = useState<number>(-1);

  const deckRefs = useRef<(HTMLDivElement | null)[]>([]);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Filter out optimistically deleted decks
  const decks = useMemo(() => {
    return optimisticDecks.filter((deck) => !decksToDelete.has(deck.id));
  }, [optimisticDecks, decksToDelete]);

  // Update refs array when decks change
  useEffect(() => {
    deckRefs.current = deckRefs.current.slice(0, decks.length);
  }, [decks]);

  // Handle keyboard navigation between cards
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (!decks.length) return;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          setFocusedDeckIndex((prev) => {
            const next = prev + 1;
            if (next >= decks.length) return 0;
            return next;
          });
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          setFocusedDeckIndex((prev) => {
            const next = prev - 1;
            if (next < 0) return decks.length - 1;
            return next;
          });
          break;
      }
    },
    [decks.length]
  );

  // Focus the deck when focusedDeckIndex changes
  useEffect(() => {
    if (focusedDeckIndex >= 0 && deckRefs.current[focusedDeckIndex]) {
      deckRefs.current[focusedDeckIndex]?.focus();
    }
  }, [focusedDeckIndex]);

  // Memoize the grid items for better performance
  const deckGrid = useMemo(() => {
    return decks.map((deck, index) => (
      <DeckCard
        ref={(el: HTMLDivElement | null) => {
          deckRefs.current[index] = el;
        }}
        key={deck.id}
        id={deck.id}
        name={deck.name}
        createdAt={deck.createdAt}
        onDelete={() => {
          setDeleteDialogState({
            isOpen: true,
            deckId: deck.id,
            deckName: deck.name,
          });
        }}
        isDeleting={isDeleting[deck.id]}
        tabIndex={focusedDeckIndex === index ? 0 : -1}
      />
    ));
  }, [decks, isDeleting, focusedDeckIndex]);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore) {
        loadMoreDecks();
      }
    },
    [hasMore, loadMoreDecks]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: "100px",
    });

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [handleIntersection]);

  const handleCreateDeck = useCallback(
    async (name: string) => {
      const tempId = `temp-${Date.now()}`;
      const optimisticDeck = {
        id: tempId,
        name,
        createdAt: new Date(),
      };

      try {
        setPending(true);
        addOptimisticDeck(optimisticDeck);
        const newDeck = await createDeck(name);
        toast.success("Deck created successfully");
        setCreateError(null);
        return newDeck;
      } catch (err) {
        setCreateError(err instanceof Error ? err : new Error("Failed to create deck"));
        throw err;
      } finally {
        setPending(false);
      }
    },
    [createDeck, addOptimisticDeck]
  );

  const handleDeleteConfirm = useCallback(async () => {
    const { deckId } = deleteDialogState;
    try {
      setPending(true);
      addDeckToDelete(deckId);
      await deleteDeck(deckId);
      toast.success("Deck deleted successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete deck");
    } finally {
      setPending(false);
    }
  }, [deleteDeck, deleteDialogState, addDeckToDelete]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + N to create new deck
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault();
        setIsCreateDialogOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  if (isLoading && decks.length === 0) {
    return (
      <div className="flex justify-center py-12" role="status" aria-label="Loading decks">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-destructive" role="alert">
        <p>Error: {error.message}</p>
        <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("transition-opacity duration-200", isPending && "opacity-70")}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Your Decks</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)} aria-label="Create new deck" disabled={isPending}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Create Deck
        </Button>
      </div>

      {decks.length === 0 ? (
        <EmptyState onCreateClick={() => setIsCreateDialogOpen(true)} />
      ) : (
        <Button variant="ghost" className="w-full p-0 h-auto hover:bg-transparent" onKeyDown={handleKeyDown}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 w-full" role="list" aria-label="Deck list">
            {deckGrid}
          </div>
        </Button>
      )}

      {hasMore && (
        <div ref={observerTarget} className="flex justify-center py-8" role="status" aria-label="Loading more decks">
          <Spinner className="h-6 w-6" />
        </div>
      )}

      <CreateDeckDialog
        isOpen={isCreateDialogOpen}
        onClose={() => {
          setIsCreateDialogOpen(false);
          setCreateError(null);
        }}
        onSubmit={handleCreateDeck}
        isLoading={isCreating || isPending}
        error={createError}
      />

      <DeleteDeckConfirmationDialog
        isOpen={deleteDialogState.isOpen}
        onClose={() => setDeleteDialogState((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleDeleteConfirm}
        deckName={deleteDialogState.deckName}
        isLoading={isDeleting[deleteDialogState.deckId] || isPending}
      />
    </div>
  );
}
