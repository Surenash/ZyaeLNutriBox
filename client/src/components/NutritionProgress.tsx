import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

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
  const [animatedValues, setAnimatedValues] = useState<number[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValues(items.map((item) => Math.round((item.current / item.target) * 100)));
    }, 200);
    return () => clearTimeout(timer);
  }, [items]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-md p-6"
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Live Nutrition Summary
      </h3>
      <div className="space-y-4">
        {items.map((item, index) => {
          const percentage = Math.round((item.current / item.target) * 100);
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-foreground">
                  {item.label}
                </span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  className="text-sm text-muted-foreground"
                  data-testid={`text-${item.label.toLowerCase()}-value`}
                >
                  {item.current}/{item.target}{item.unit} ({percentage}%)
                </motion.span>
              </div>
              <Progress 
                value={animatedValues[index] || 0} 
                className="h-2"
                style={{ 
                  '--progress-background': item.color 
                } as React.CSSProperties}
              />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
