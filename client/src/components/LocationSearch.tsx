import { MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface LocationSearchProps {
  location?: string;
  onLocationClick?: () => void;
  onSearch?: (query: string) => void;
}

export default function LocationSearch({ 
  location = "Mumbai, Maharashtra", 
  onLocationClick,
  onSearch 
}: LocationSearchProps) {
  return (
    <div className="bg-card border-b border-border sticky top-0 z-40 backdrop-blur-sm bg-card/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Location Selector */}
          <button
            onClick={onLocationClick}
            className="flex items-center gap-2 text-sm hover-elevate px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 transition-all w-full md:w-auto justify-center md:justify-start"
            data-testid="button-select-location"
          >
            <MapPin className="w-4 h-4" />
            <span className="font-medium">Delivering to</span>
            <span className="font-semibold" data-testid="text-current-location">{location}</span>
          </button>

          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search meals, nutrition plans, or experts..."
              className="pl-12 pr-4 rounded-full border-border bg-background h-11"
              onChange={(e) => onSearch?.(e.target.value)}
              data-testid="input-search"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
