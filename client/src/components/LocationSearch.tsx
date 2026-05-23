import { MapPin, Search, Navigation, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LocationSearchProps {
  location?: string;
  onLocationUpdate?: (newLocation: string) => void;
  onSearch?: (query: string) => void;
}

export default function LocationSearch({ 
  location = "Mumbai, Maharashtra", 
  onLocationUpdate,
  onSearch 
}: LocationSearchProps) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [manualLocation, setManualLocation] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // In a real app, you would use a reverse geocoding service here
          // For now, we'll simulate it
          const lat = position.coords.latitude.toFixed(2);
          const lng = position.coords.longitude.toFixed(2);
          const simulatedAddress = `Detected Location (${lat}, ${lng})`;
          onLocationUpdate?.(simulatedAddress);
          setIsDialogOpen(false);
        } catch (error) {
          console.error("Error reverse geocoding:", error);
        } finally {
          setIsDetecting(false);
        }
      },
      (error) => {
        setIsDetecting(false);
        alert(`Error detecting location: ${error.message}`);
      }
    );
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualLocation.trim()) {
      onLocationUpdate?.(manualLocation);
      setIsDialogOpen(false);
      setManualLocation("");
    }
  };

  return (
    <div className="bg-card border-b border-border sticky top-0 z-40 backdrop-blur-sm bg-card/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Location Selector */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button
                className="flex items-center gap-2 text-sm hover-elevate px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 transition-all w-full md:w-auto justify-center md:justify-start group"
                data-testid="button-select-location"
              >
                <MapPin className="w-4 h-4 group-hover:animate-bounce" />
                <span className="font-medium">Delivering to</span>
                <span className="font-semibold truncate max-w-[150px]" data-testid="text-current-location">{location}</span>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-[32px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black text-[#006442]">Set Delivery Location</DialogTitle>
                <DialogDescription>
                  Choose how you want to set your delivery address
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <Button 
                  onClick={detectLocation} 
                  disabled={isDetecting}
                  className="w-full h-16 rounded-2xl bg-green-50 text-[#006442] hover:bg-green-100 border border-green-100 font-bold flex gap-3 shadow-none"
                >
                  {isDetecting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Navigation className="h-5 w-5" />}
                  {isDetecting ? "Detecting..." : "Detect My Current Location"}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-400 font-bold">Or enter manually</span>
                  </div>
                </div>

                <form onSubmit={handleManualSubmit} className="space-y-4">
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input 
                      placeholder="e.g. MG Road, Bengaluru" 
                      className="pl-12 h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-[#006442]/20"
                      value={manualLocation}
                      onChange={(e) => setManualLocation(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full h-14 rounded-2xl bg-[#006442] font-bold text-white shadow-xl shadow-green-900/10">
                    Set Location
                  </Button>
                </form>
              </div>
            </DialogContent>
          </Dialog>

          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search meals, nutrition plans, or experts..."
              className="pl-12 pr-4 rounded-full border-border bg-background h-11 focus:ring-2 focus:ring-[#006442]/10"
              onChange={(e) => onSearch?.(e.target.value)}
              data-testid="input-search"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
