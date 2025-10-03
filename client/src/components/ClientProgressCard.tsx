import { Calendar, TrendingDown } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface ClientProgressCardProps {
  clientName: string;
  clientImage: string;
  nextSession: string;
  mealCompletion: number;
  avgCalories: { current: number; target: number };
  proteinIntake: number;
  waterIntake: { current: number; target: number };
  weightProgress: { start: number; current: number };
  onViewDetails?: () => void;
}

export default function ClientProgressCard({
  clientName,
  clientImage,
  nextSession,
  mealCompletion,
  avgCalories,
  proteinIntake,
  waterIntake,
  weightProgress,
  onViewDetails,
}: ClientProgressCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={clientImage} alt={clientName} />
            <AvatarFallback>{clientName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-foreground" data-testid={`text-client-${clientName.toLowerCase().replace(/\s+/g, '-')}`}>
              {clientName}
            </h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>Next: {nextSession}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Meal Completion</span>
            <span className="text-[#22C55E] font-semibold" data-testid="text-meal-completion">
              {mealCompletion}%
            </span>
          </div>
          <Progress value={mealCompletion} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Avg Calories</span>
            <p className="font-semibold" data-testid="text-calories">
              {avgCalories.current}/{avgCalories.target}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Protein</span>
            <p className="font-semibold" data-testid="text-protein">
              {proteinIntake}%
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Water</span>
            <p className="font-semibold" data-testid="text-water">
              {waterIntake.current}L/{waterIntake.target}L
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Weight</span>
            <p className="font-semibold flex items-center gap-1" data-testid="text-weight">
              {weightProgress.start}kg → {weightProgress.current}kg
              <TrendingDown className="w-4 h-4 text-[#22C55E]" />
            </p>
          </div>
        </div>
      </div>

      <Button
        className="w-full bg-primary text-primary-foreground rounded-full hover-elevate active-elevate-2"
        onClick={onViewDetails}
        data-testid="button-view-details"
      >
        View Full Progress
      </Button>
    </div>
  );
}
