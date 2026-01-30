/// <reference types="@types/google.maps" />

import { MapPin } from "lucide-react";

interface SuggestionsListProps {
  suggestions: google.maps.places.AutocompletePrediction[];
  onSelect: (placeId: string) => void;
}

export const SuggestionsList = ({ suggestions, onSelect }: SuggestionsListProps) => {
  if (suggestions.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl border border-border shadow-card-elevated z-20 overflow-hidden slide-up">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion.place_id}
          type="button"
          onClick={() => onSelect(suggestion.place_id)}
          className="flex items-start gap-3 w-full px-4 py-3 text-left hover:bg-accent/50 transition-colors border-b border-border last:border-b-0"
        >
          <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-foreground truncate">
              {suggestion.structured_formatting.main_text}
            </span>
            <span className="text-sm text-muted-foreground truncate">
              {suggestion.structured_formatting.secondary_text}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};
