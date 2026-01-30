import { useState, useCallback, useEffect } from "react";
import { Crosshair, MapPin, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "./SearchInput";
import { AddressForm } from "./AddressForm";
import { CoordinatesDisplay } from "./CoordinatesDisplay";
import { MapView } from "./MapView";
import { SuggestionsList } from "./SuggestionsList";
import { useGoogleMaps } from "./useGoogleMaps";
import { LocationData, Coordinates } from "./types";

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
    setAddress,
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
    <div className="flex flex-col gap-6">
      {/* Search Section */}
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

      {/* Coordinates Display */}
      <CoordinatesDisplay coordinates={coordinates} />

      {/* Address Form */}
      <div className="location-card">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Address Details
        </h3>
        <AddressForm address={address} onChange={setAddress} />
      </div>

      {/* Confirm Button */}
      <Button onClick={handleConfirm} className="h-12 text-base font-medium">
        <Check className="w-5 h-5 mr-2" />
        Confirm Location
      </Button>
    </div>
  );
};
