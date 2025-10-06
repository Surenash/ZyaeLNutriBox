import { MapPin, Phone, Navigation } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface DeliveryOrderCardProps {
  userName: string;
  userImage: string;
  address: string;
  phone: string;
  mealType: string;
  status: 'pickup' | 'delivering' | 'delivered';
  onStatusChange?: (newStatus: string) => void;
}

export default function DeliveryOrderCard({
  userName,
  userImage,
  address,
  phone,
  mealType,
  status,
  onStatusChange,
}: DeliveryOrderCardProps) {
  const statusConfig = {
    pickup: { label: 'Pickup', color: 'bg-muted text-muted-foreground', action: 'Start Delivery' },
    delivering: { label: 'Delivering', color: 'bg-[#FF8C00]/10 text-[#FF8C00]', action: 'Mark Delivered' },
    delivered: { label: 'Delivered', color: 'bg-[#22C55E]/10 text-[#22C55E]', action: null },
  };

  const config = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      layout
      className="bg-white rounded-xl shadow-md p-6 border border-border hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex items-start gap-4 mb-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Avatar className="w-12 h-12">
            <AvatarImage src={userImage} alt={userName} />
            <AvatarFallback>{userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
        </motion.div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-foreground" data-testid={`text-user-${userName.toLowerCase().replace(/\s+/g, '-')}`}>
              {userName}
            </h3>
            <motion.div
              animate={status === 'delivering' ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 2, repeat: status === 'delivering' ? Infinity : 0 }}
            >
              <Badge className={`${config.color} border-0 rounded-full`} data-testid={`badge-status-${status}`}>
                {config.label}
              </Badge>
            </motion.div>
          </div>
          <p className="text-sm font-medium text-foreground mb-2">{mealType}</p>
          <div className="space-y-1">
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{address}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span data-testid="text-phone">{phone}</span>
            </div>
          </div>
        </div>
      </div>

      {config.action && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2"
        >
          <Button
            className="flex-1 bg-primary text-primary-foreground rounded-full hover-elevate active-elevate-2"
            onClick={() => onStatusChange?.(status === 'pickup' ? 'delivering' : 'delivered')}
            data-testid="button-status-action"
          >
            {config.action}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            data-testid="button-navigate"
          >
            <Navigation className="w-4 h-4" />
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
