import { MapPin, Navigation } from "lucide-react";
import { motion } from "framer-motion";

interface MapPlaceholderProps {
  center?: { lat: number; lng: number };
  markers?: Array<{ lat: number; lng: number; label: string }>;
  route?: boolean;
  height?: string;
  className?: string;
}

export default function MapPlaceholder({
  center = { lat: 12.9716, lng: 77.5946 },
  markers = [],
  route = false,
  height = "400px",
  className = "",
}: MapPlaceholderProps) {
  return (
    <div
      className={`relative bg-gradient-to-br from-muted to-muted/50 rounded-xl overflow-hidden ${className}`}
      style={{ height }}
    >
      {/* Grid pattern background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Center indicator */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <div className="relative">
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-primary rounded-full blur-xl"
          />
          <div className="relative bg-primary p-4 rounded-full shadow-lg">
            {route ? (
              <Navigation className="w-8 h-8 text-white" />
            ) : (
              <MapPin className="w-8 h-8 text-white" />
            )}
          </div>
        </div>
      </motion.div>

      {/* Markers */}
      {markers.map((marker, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="absolute"
          style={{
            top: `${30 + index * 15}%`,
            left: `${40 + index * 10}%`,
          }}
        >
          <div className="relative group">
            <div className="bg-destructive p-2 rounded-full shadow-lg group-hover:scale-110 transition-transform">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {marker.label}
            </div>
          </div>
        </motion.div>
      ))}

      {/* Route line placeholder */}
      {route && (
        <motion.svg
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <motion.path
            d="M 20% 30% Q 40% 50%, 60% 40% T 80% 60%"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeDasharray="10 5"
            className="text-primary"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </motion.svg>
      )}

      {/* Mapbox ready indicator */}
      <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-2 rounded-lg text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
          Map Ready for Mapbox Integration
        </div>
      </div>

      {/* Coordinates display */}
      <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-2 rounded-lg text-xs text-muted-foreground font-mono">
        {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
      </div>
    </div>
  );
}
