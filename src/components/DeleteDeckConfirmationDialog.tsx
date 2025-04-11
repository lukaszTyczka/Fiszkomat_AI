import { useId } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";

interface DeleteDeckConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  deckName: string;
  isLoading: boolean;
}

export function DeleteDeckConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  deckName,
  isLoading,
}: DeleteDeckConfirmationDialogProps) {
  const titleId = useId();
  const descriptionId = useId();

  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch {
      // Error is handled by the parent through toast
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle id={titleId}>Delete Deck</AlertDialogTitle>
          <AlertDialogDescription id={descriptionId}>
            Are you sure you want to delete &quot;{deckName}&quot;? This will permanently delete the deck and all
            flashcards within it. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Deleting...
              </>
            ) : (
              "Delete Deck"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
