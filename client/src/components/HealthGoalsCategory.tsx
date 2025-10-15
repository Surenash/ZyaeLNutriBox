import { motion } from "framer-motion";
import { Target, Dumbbell, Heart, Activity, Sparkles, Apple } from "lucide-react";
import { Button } from "@/components/ui/button";
import { viewportConfig } from "@/lib/animations";

interface HealthGoal {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

const healthGoals: HealthGoal[] = [
  {
    id: "weight-loss",
    title: "Weight Loss",
    icon: <Target className="w-8 h-8" />,
    description: "Scientifically designed meals for sustainable weight management",
    color: "from-orange-500/10 to-orange-500/5",
  },
  {
    id: "muscle-gain",
    title: "Muscle Gain",
    icon: <Dumbbell className="w-8 h-8" />,
    description: "High-protein nutrition for strength and muscle building",
    color: "from-primary/10 to-primary/5",
  },
  {
    id: "balanced-nutrition",
    title: "Balanced Nutrition",
    icon: <Heart className="w-8 h-8" />,
    description: "Complete nutrition for overall health and wellness",
    color: "from-pink-500/10 to-pink-500/5",
  },
  {
    id: "diabetic-friendly",
    title: "Diabetic Friendly",
    icon: <Activity className="w-8 h-8" />,
    description: "Low GI meals for better blood sugar control",
    color: "from-blue-500/10 to-blue-500/5",
  },
  {
    id: "detox-wellness",
    title: "Detox & Wellness",
    icon: <Sparkles className="w-8 h-8" />,
    description: "Cleansing meals for natural detoxification",
    color: "from-green-500/10 to-green-500/5",
  },
  {
    id: "pcos-friendly",
    title: "PCOS Friendly",
    icon: <Apple className="w-8 h-8" />,
    description: "Hormone-balancing nutrition for PCOS management",
    color: "from-purple-500/10 to-purple-500/5",
  },
];

interface HealthGoalsCategoryProps {
  onCategorySelect?: (categoryId: string) => void;
}

export default function HealthGoalsCategory({ onCategorySelect }: HealthGoalsCategoryProps) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={viewportConfig}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      <div className="text-center mb-8 md:mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportConfig}
          className="text-3xl md:text-5xl font-bold text-foreground mb-3 md:mb-4"
        >
          Choose Your Health Goal
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportConfig}
          transition={{ delay: 0.1 }}
          className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4"
        >
          Expertly crafted meal plans designed to help you achieve your wellness goals
        </motion.p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {healthGoals.map((goal, index) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig}
            transition={{ delay: index * 0.05 }}
            onClick={() => onCategorySelect?.(goal.id)}
            className={`
              bg-gradient-to-br ${goal.color} backdrop-blur-sm
              rounded-2xl p-4 md:p-6
              border border-border/50
              hover-elevate active-elevate-2
              cursor-pointer group
              transition-all duration-300
            `}
            data-testid={`card-goal-${goal.id}`}
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/80 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                {goal.icon}
              </div>
              <div>
                <h3 className="font-semibold text-sm md:text-base text-foreground mb-1">
                  {goal.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {goal.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportConfig}
        transition={{ delay: 0.4 }}
        className="text-center mt-6 md:mt-8"
      >
        <Button
          variant="outline"
          size="lg"
          className="rounded-full"
          onClick={() => console.log("View all categories")}
          data-testid="button-view-all-health-categories"
        >
          View All Categories
        </Button>
      </motion.div>
    </motion.section>
  );
}
