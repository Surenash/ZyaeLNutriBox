import { Progress } from "@/components/ui/progress";

interface NutritionItem {
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
}

interface NutritionProgressProps {
  items: NutritionItem[];
}

export default function NutritionProgress({ items }: NutritionProgressProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Live Nutrition Summary
      </h3>
      <div className="space-y-4">
        {items.map((item) => {
          const percentage = Math.round((item.current / item.target) * 100);
          return (
            <div key={item.label}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-foreground">
                  {item.label}
                </span>
                <span className="text-sm text-muted-foreground" data-testid={`text-${item.label.toLowerCase()}-value`}>
                  {item.current}/{item.target}{item.unit} ({percentage}%)
                </span>
              </div>
              <Progress 
                value={percentage} 
                className="h-2"
                style={{ 
                  '--progress-background': item.color 
                } as React.CSSProperties}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
