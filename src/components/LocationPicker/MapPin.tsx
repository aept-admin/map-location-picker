import { MapPin as MapPinIcon } from "lucide-react";

interface MapPinProps {
  isAnimating?: boolean;
}

export const MapPin = ({ isAnimating = false }: MapPinProps) => {
  return (
    <div className={`pin-marker ${isAnimating ? "animate-bounce-subtle" : ""}`}>
      <div className="relative">
        <MapPinIcon className="w-10 h-10 text-primary fill-primary" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-3 h-1 bg-foreground/20 rounded-full blur-sm" />
      </div>
    </div>
  );
};
