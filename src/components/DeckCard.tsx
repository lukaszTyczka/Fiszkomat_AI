import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { TrashIcon } from "@radix-ui/react-icons";
import { forwardRef } from "react";

interface DeckCardProps {
  id: string;
  name: string;
  createdAt: Date;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
  tabIndex?: number;
}

export const DeckCard = forwardRef<HTMLDivElement, DeckCardProps>(
  ({ id, name, createdAt, onDelete, isDeleting = false, tabIndex = 0 }, ref) => {
    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        window.location.href = `/decks/${id}`;
      } else if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        onDelete(id);
      }
    };

    return (
      <Card
        ref={ref}
        className="relative group focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 outline-none"
        onKeyDown={handleKeyPress}
        tabIndex={tabIndex}
        role="listitem"
      >
        <a href={`/decks/${id}`} className="block outline-none focus:outline-none" aria-label={`View deck: ${name}`}>
          <CardHeader>
            <CardTitle className="font-semibold text-lg">{name}</CardTitle>
            <CardDescription>Created {createdAt.toLocaleDateString()}</CardDescription>
          </CardHeader>
        </a>
        <CardContent className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
          <Button
            variant="destructive"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              onDelete(id);
            }}
            disabled={isDeleting}
            aria-label={`Delete deck: ${name}`}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }
);

DeckCard.displayName = "DeckCard";
