import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

interface CreateDeckDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

export function CreateDeckDialog({ isOpen, onClose, onSubmit, isLoading, error }: CreateDeckDialogProps) {
  const [name, setName] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name.trim()) {
      setValidationError("Name is required");
      return;
    }
    if (name.length > 100) {
      setValidationError("Name must be 100 characters or less");
      return;
    }

    try {
      await onSubmit(name.trim());
      setName("");
      setValidationError(null);
      onClose();
    } catch {
      // Error will be handled by parent through error prop
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Deck</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setName(e.target.value);
                  setValidationError(null);
                }}
                placeholder="Enter deck name"
                maxLength={100}
                disabled={isLoading}
              />
              {validationError && <p className="text-sm text-destructive">{validationError}</p>}
              {error && <p className="text-sm text-destructive">{error.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Creating...
                </>
              ) : (
                "Create Deck"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
