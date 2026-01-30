/// <reference types="@types/google.maps" />

import { useEffect, useRef, useCallback } from "react";
import { Coordinates } from "./types";
import { MapPin } from "./MapPin";

interface MapViewProps {
  coordinates: Coordinates;
  onCenterChange: (coords: Coordinates) => void;
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  isLoaded: boolean;
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
}

const mapStyles: google.maps.MapTypeStyle[] = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [{ color: "#a8d4e6" }],
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry.fill",
    stylers: [{ color: "#e8f0e8" }],
  },
];

export const MapView = ({
  coordinates,
  onCenterChange,
  mapRef,
  isLoaded,
  isDragging,
  onDragStart,
  onDragEnd,
}: MapViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);

  const initMap = useCallback(() => {
    if (!containerRef.current || !window.google?.maps || isInitializedRef.current) return;

    const map = new window.google.maps.Map(containerRef.current, {
      center: coordinates,
      zoom: 15,
      styles: mapStyles,
      disableDefaultUI: true,
      zoomControl: true,
      zoomControlOptions: {
        position: window.google.maps.ControlPosition.RIGHT_CENTER,
      },
      gestureHandling: "greedy",
    });

    mapRef.current = map;
    isInitializedRef.current = true;

    map.addListener("dragstart", onDragStart);
    
    map.addListener("dragend", () => {
      onDragEnd();
      const center = map.getCenter();
      if (center) {
        onCenterChange({ lat: center.lat(), lng: center.lng() });
      }
    });

    map.addListener("idle", () => {
      const center = map.getCenter();
      if (center) {
        // Only update if significantly changed
        const latDiff = Math.abs(center.lat() - coordinates.lat);
        const lngDiff = Math.abs(center.lng() - coordinates.lng);
        if (latDiff > 0.0001 || lngDiff > 0.0001) {
          onCenterChange({ lat: center.lat(), lng: center.lng() });
        }
      }
    });
  }, [coordinates, onCenterChange, mapRef, onDragStart, onDragEnd]);

  useEffect(() => {
    if (isLoaded) {
      initMap();
    }
  }, [isLoaded, initMap]);

  // Update map center when coordinates change externally
  useEffect(() => {
    if (mapRef.current && !isDragging) {
      const center = mapRef.current.getCenter();
      if (center) {
        const latDiff = Math.abs(center.lat() - coordinates.lat);
        const lngDiff = Math.abs(center.lng() - coordinates.lng);
        if (latDiff > 0.001 || lngDiff > 0.001) {
          mapRef.current.panTo(coordinates);
        }
      }
    }
  }, [coordinates, mapRef, isDragging]);

  return (
    <div className="map-container">
      <div ref={containerRef} className="w-full h-full min-h-[400px]" />
      <MapPin isAnimating={isDragging} />
    </div>
  );
};
