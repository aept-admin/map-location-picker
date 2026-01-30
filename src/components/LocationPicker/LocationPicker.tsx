import { useState, useCallback, useEffect } from "react";
import { Crosshair, MapPin, Check, Navigation, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "./SearchInput";
import { MapView } from "./MapView";
import { SuggestionsList } from "./SuggestionsList";
import { useGoogleMaps } from "./useGoogleMaps";
import { LocationData, Coordinates } from "./types";
import { toast } from "sonner";

interface LocationPickerProps {
  apiKey: string;
  defaultCenter?: Coordinates;
  onConfirm?: (location: LocationData) => void;
  onLocationChange?: (location: LocationData) => void;
}

export const LocationPicker = ({
  apiKey,
  defaultCenter,
  onConfirm,
  onLocationChange,
}: LocationPickerProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const {
    isLoaded,
    isLoading,
    error,
    coordinates,
    address,
    searchValue,
    suggestions,
    mapRef,
    setSearchValue,
    searchPlaces,
    selectPlace,
    updateCoordinates,
    useCurrentLocation,
  } = useGoogleMaps({
    apiKey,
    defaultCenter,
    onLocationChange,
  });

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue.trim()) {
        searchPlaces(searchValue);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, searchPlaces]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
    },
    [setSearchValue]
  );

  const handleClearSearch = useCallback(() => {
    setSearchValue("");
    setShowSuggestions(false);
  }, [setSearchValue]);

  const handleSelectPlace = useCallback(
    (placeId: string) => {
      selectPlace(placeId);
      setShowSuggestions(false);
    },
    [selectPlace]
  );

  const handleConfirm = useCallback(() => {
    onConfirm?.({
      coordinates,
      address,
    });
  }, [coordinates, address, onConfirm]);

  const copyToClipboard = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  }, []);

  const fullAddress = address.formattedAddress || "Search for a location...";

  if (error) {
    return (
      <div className="location-card flex flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <MapPin className="w-8 h-8 text-destructive" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Unable to Load Maps</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Search Section - Google Maps style */}
      <div className="relative">
        <SearchInput
          value={searchValue}
          onChange={handleSearchChange}
          onClear={handleClearSearch}
          isLoading={isLoading}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        {showSuggestions && (
          <SuggestionsList suggestions={suggestions} onSelect={handleSelectPlace} />
        )}
      </div>

      {/* Map Section */}
      <div className="relative">
        <MapView
          coordinates={coordinates}
          onCenterChange={updateCoordinates}
          mapRef={mapRef}
          isLoaded={isLoaded}
          isDragging={isDragging}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
        />

        {/* Current Location Button */}
        <button
          type="button"
          onClick={useCurrentLocation}
          className="floating-panel bottom-4 right-4 p-3 hover:bg-accent transition-colors"
          title="Use current location"
        >
          <Crosshair className="w-5 h-5 text-primary" />
        </button>

        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-xl">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-muted-foreground">Loading map...</span>
            </div>
          </div>
        )}
      </div>

      {/* Selected Location Details - Clean Display */}
      <div className="location-card space-y-4">
        {/* Full Address */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary" />
              Full Address
            </div>
            {address.formattedAddress && (
              <button
                onClick={() => copyToClipboard(address.formattedAddress, "Address")}
                className="p-1.5 hover:bg-accent rounded-lg transition-colors"
                title="Copy address"
              >
                <Copy className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
          <p className="text-foreground font-medium text-lg leading-relaxed">
            {fullAddress}
          </p>
        </div>

        {/* Coordinates */}
        <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-border">
          <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-accent/50 rounded-lg">
            <Navigation className="w-4 h-4 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-xs text-muted-foreground block">Latitude</span>
              <span className="font-mono font-medium text-foreground">{coordinates.lat.toFixed(6)}</span>
            </div>
            <button
              onClick={() => copyToClipboard(coordinates.lat.toFixed(6), "Latitude")}
              className="p-1.5 hover:bg-background rounded-lg transition-colors"
              title="Copy latitude"
            >
              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
          <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-accent/50 rounded-lg">
            <Navigation className="w-4 h-4 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-xs text-muted-foreground block">Longitude</span>
              <span className="font-mono font-medium text-foreground">{coordinates.lng.toFixed(6)}</span>
            </div>
            <button
              onClick={() => copyToClipboard(coordinates.lng.toFixed(6), "Longitude")}
              className="p-1.5 hover:bg-background rounded-lg transition-colors"
              title="Copy longitude"
            >
              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Copy All Button */}
        {address.formattedAddress && (
          <button
            onClick={() => copyToClipboard(
              `Address: ${address.formattedAddress}\nLatitude: ${coordinates.lat.toFixed(6)}\nLongitude: ${coordinates.lng.toFixed(6)}`,
              "Location details"
            )}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
          >
            <Copy className="w-4 h-4" />
            Copy all details
          </button>
        )}
      </div>

      {/* Confirm Button */}
      <Button onClick={handleConfirm} className="h-12 text-base font-medium" disabled={!address.formattedAddress}>
        <Check className="w-5 h-5 mr-2" />
        Confirm Location
      </Button>
    </div>
  );
};
