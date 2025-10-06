import { CheckCircle2, Clock, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface MealStatusCardProps {
  mealType: string;
  status: 'delivered' | 'in-transit' | 'pending';
  time: string;
  onViewDetails?: () => void;
}

export default function MealStatusCard({
  mealType,
  status,
  time,
  onViewDetails,
}: MealStatusCardProps) {
  const statusConfig = {
    delivered: {
      icon: CheckCircle2,
      color: 'text-[#22C55E]',
      bgColor: 'bg-[#22C55E]/10',
      label: 'Delivered & Consumed',
    },
    'in-transit': {
      icon: Truck,
      color: 'text-[#FF8C00]',
      bgColor: 'bg-[#FF8C00]/10',
      label: 'In Transit',
    },
    pending: {
      icon: Clock,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
      label: 'Pending',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ x: 5 }}
      className="bg-white rounded-xl p-4 border border-border hover-elevate cursor-pointer transition-shadow duration-300"
      onClick={onViewDetails}
      data-testid={`card-meal-${mealType.toLowerCase()}`}
    >
      <div className="flex items-center gap-3">
        <motion.div
          className={`p-2 rounded-lg ${config.bgColor}`}
          animate={status === 'in-transit' ? { rotate: [0, 5, -5, 0] } : {}}
          transition={{ duration: 2, repeat: status === 'in-transit' ? Infinity : 0 }}
        >
          <Icon className={`w-5 h-5 ${config.color}`} />
        </motion.div>
        <div className="flex-1">
          <h4 className="font-semibold text-foreground">{mealType}</h4>
          <p className="text-sm text-muted-foreground">{time}</p>
        </div>
        <motion.div
          animate={status === 'in-transit' ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 2, repeat: status === 'in-transit' ? Infinity : 0 }}
        >
          <Badge
            className={`${config.bgColor} ${config.color} border-0 rounded-full px-3 py-1 text-xs`}
            data-testid={`badge-status-${status}`}
          >
            {config.label}
          </Badge>
        </motion.div>
      </div>
    </motion.div>
  );
}
