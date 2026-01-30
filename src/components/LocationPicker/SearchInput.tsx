import { Search, X } from "lucide-react";
import { forwardRef, InputHTMLAttributes } from "react";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  isLoading?: boolean;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onClear, isLoading, value, ...props }, ref) => {
    return (
      <div className="search-input-wrapper">
        <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
        <input
          ref={ref}
          type="text"
          value={value}
          placeholder="Search for a location..."
          {...props}
        />
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-4 p-1 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
        {isLoading && (
          <div className="absolute right-12 w-4 h-4">
            <div className="w-full h-full border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
