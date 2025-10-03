import { CheckCircle2, Clock, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
    <div
      className="bg-white rounded-xl p-4 border border-border hover-elevate cursor-pointer"
      onClick={onViewDetails}
      data-testid={`card-meal-${mealType.toLowerCase()}`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${config.bgColor}`}>
          <Icon className={`w-5 h-5 ${config.color}`} />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-foreground">{mealType}</h4>
          <p className="text-sm text-muted-foreground">{time}</p>
        </div>
        <Badge
          className={`${config.bgColor} ${config.color} border-0 rounded-full px-3 py-1 text-xs`}
          data-testid={`badge-status-${status}`}
        >
          {config.label}
        </Badge>
      </div>
    </div>
  );
}
