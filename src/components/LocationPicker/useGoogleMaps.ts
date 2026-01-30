/// <reference types="@types/google.maps" />

import { useState, useEffect, useCallback, useRef } from "react";
import { Coordinates, AddressDetails, LocationData } from "./types";

const DEFAULT_ADDRESS: AddressDetails = {
  formattedAddress: "",
  streetNumber: "",
  route: "",
  locality: "",
  administrativeArea: "",
  postalCode: "",
  country: "",
};

const DEFAULT_COORDINATES: Coordinates = {
  lat: 40.7128,
  lng: -74.006,
};

interface UseGoogleMapsProps {
  apiKey: string;
  defaultCenter?: Coordinates;
  onLocationChange?: (location: LocationData) => void;
}

export const useGoogleMaps = ({
  apiKey,
  defaultCenter = DEFAULT_COORDINATES,
  onLocationChange,
}: UseGoogleMapsProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinates>(defaultCenter);
  const [address, setAddress] = useState<AddressDetails>(DEFAULT_ADDRESS);
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  
  const mapRef = useRef<google.maps.Map | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);

  // Load Google Maps script
  useEffect(() => {
    if (!apiKey) {
      setError("Google Maps API key is required");
      return;
    }

    if (window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setIsLoaded(true);
      setError(null);
    };
    
    script.onerror = () => {
      setError("Failed to load Google Maps");
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, [apiKey]);

  // Initialize services
  useEffect(() => {
    if (isLoaded && window.google?.maps) {
      geocoderRef.current = new window.google.maps.Geocoder();
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
    }
  }, [isLoaded]);

  // Parse address components
  const parseAddressComponents = useCallback(
    (components: google.maps.GeocoderAddressComponent[]): AddressDetails => {
      const getComponent = (type: string) =>
        components.find((c) => c.types.includes(type))?.long_name || "";

      return {
        formattedAddress: "",
        streetNumber: getComponent("street_number"),
        route: getComponent("route"),
        locality: getComponent("locality") || getComponent("sublocality"),
        administrativeArea: getComponent("administrative_area_level_1"),
        postalCode: getComponent("postal_code"),
        country: getComponent("country"),
        premise: getComponent("premise"),
        subpremise: getComponent("subpremise"),
      };
    },
    []
  );

  // Geocode coordinates to address
  const geocodeCoordinates = useCallback(
    async (coords: Coordinates) => {
      if (!geocoderRef.current) return;

      setIsLoading(true);
      try {
        const result = await geocoderRef.current.geocode({ location: coords });
        if (result.results[0]) {
          const parsed = parseAddressComponents(result.results[0].address_components);
          parsed.formattedAddress = result.results[0].formatted_address;
          setAddress(parsed);
          
          const locationData: LocationData = {
            coordinates: coords,
            address: parsed,
            placeId: result.results[0].place_id,
          };
          onLocationChange?.(locationData);
        }
      } catch (err) {
        console.error("Geocoding error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [parseAddressComponents, onLocationChange]
  );

  // Search for places
  const searchPlaces = useCallback(async (query: string) => {
    if (!autocompleteServiceRef.current || !query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const result = await autocompleteServiceRef.current.getPlacePredictions({
        input: query,
        types: ["geocode", "establishment"],
      });
      setSuggestions(result?.predictions || []);
    } catch (err) {
      console.error("Autocomplete error:", err);
      setSuggestions([]);
    }
  }, []);

  // Select a place from suggestions
  const selectPlace = useCallback(
    async (placeId: string) => {
      if (!geocoderRef.current) return;

      setIsLoading(true);
      setSuggestions([]);
      
      try {
        const result = await geocoderRef.current.geocode({ placeId });
        if (result.results[0]) {
          const location = result.results[0].geometry.location;
          const newCoords = { lat: location.lat(), lng: location.lng() };
          
          setCoordinates(newCoords);
          
          const parsed = parseAddressComponents(result.results[0].address_components);
          parsed.formattedAddress = result.results[0].formatted_address;
          setAddress(parsed);
          setSearchValue(parsed.formattedAddress);
          
          if (mapRef.current) {
            mapRef.current.panTo(newCoords);
            mapRef.current.setZoom(17);
          }
          
          const locationData: LocationData = {
            coordinates: newCoords,
            address: parsed,
            placeId,
          };
          onLocationChange?.(locationData);
        }
      } catch (err) {
        console.error("Place selection error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [parseAddressComponents, onLocationChange]
  );

  // Update coordinates (called when map is dragged)
  const updateCoordinates = useCallback(
    (coords: Coordinates) => {
      setCoordinates(coords);
      geocodeCoordinates(coords);
    },
    [geocodeCoordinates]
  );

  // Use current location
  const useCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCoordinates(coords);
        geocodeCoordinates(coords);
        
        if (mapRef.current) {
          mapRef.current.panTo(coords);
          mapRef.current.setZoom(17);
        }
      },
      (err) => {
        setError("Unable to get your location");
        setIsLoading(false);
        console.error("Geolocation error:", err);
      }
    );
  }, [geocodeCoordinates]);

  return {
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
  };
};
