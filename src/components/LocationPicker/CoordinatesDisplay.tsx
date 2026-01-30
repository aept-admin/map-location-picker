import { Navigation } from "lucide-react";
import { Coordinates } from "./types";

interface CoordinatesDisplayProps {
  coordinates: Coordinates;
}

export const CoordinatesDisplay = ({ coordinates }: CoordinatesDisplayProps) => {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-accent/50 rounded-lg">
      <Navigation className="w-5 h-5 text-primary" />
      <div className="flex gap-4 text-sm">
        <span className="text-muted-foreground">
          Lat: <span className="font-medium text-foreground">{coordinates.lat.toFixed(6)}</span>
        </span>
        <span className="text-muted-foreground">
          Lng: <span className="font-medium text-foreground">{coordinates.lng.toFixed(6)}</span>
        </span>
      </div>
    </div>
  );
};
