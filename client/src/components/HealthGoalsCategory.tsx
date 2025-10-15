import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { viewportConfig } from "@/lib/animations";
import weightLoss from "@assets/generated_images/Healthy_balanced_meal_food_36201b9b.png";
import muscleFuel from "@assets/generated_images/Protein-rich_fitness_meal_28329687.png";
import proteinMeal from "@assets/stock_images/healthy_nutrition_me_799f8107.jpg";
import healthyBowl from "@assets/generated_images/PCOS-friendly_healthy_meal_1a327607.png";

interface HealthGoalPlan {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  currentPrice: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  image: string;
}

const healthGoalPlans: HealthGoalPlan[] = [
  {
    id: "weight-loss",
    title: "Weight Loss",
    description: "Scientifically designed meals for sustainable weight management",
    originalPrice: 18000,
    currentPrice: 15000,
    rating: 4.9,
    reviewCount: 5200,
    badge: "Most Popular",
    image: weightLoss,
  },
  {
    id: "muscle-gain",
    title: "Muscle Gain",
    description: "High-protein nutrition for strength and muscle building",
    originalPrice: 20000,
    currentPrice: 17000,
    rating: 4.8,
    reviewCount: 3800,
    badge: "High Protein",
    image: muscleFuel,
  },
  {
    id: "balanced-nutrition",
    title: "Balanced Nutrition",
    description: "Complete nutrition for overall health and wellness",
    originalPrice: 16000,
    currentPrice: 13500,
    rating: 4.7,
    reviewCount: 4100,
    image: proteinMeal,
  },
  {
    id: "diabetic-friendly",
    title: "Diabetic Friendly",
    description: "Low GI meals for better blood sugar control",
    originalPrice: 17000,
    currentPrice: 14500,
    rating: 4.9,
    reviewCount: 2900,
    badge: "Doctor Approved",
    image: healthyBowl,
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {healthGoalPlans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white dark:bg-card rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group hover-elevate active-elevate-2 cursor-pointer"
            onClick={() => onCategorySelect?.(plan.id)}
            data-testid={`card-health-goal-${plan.id}`}
          >
            <div className="flex items-center gap-4 p-4">
              {/* Small Image Thumbnail */}
              <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                <img
                  src={plan.image}
                  alt={plan.title}
                  className="w-full h-full object-cover"
                />
                {plan.badge && (
                  <Badge
                    className="absolute top-1 right-1 bg-[#FF8C00] text-white border-0 rounded-full px-2 py-0.5 text-[10px] font-semibold shadow-md"
                    data-testid={`badge-${plan.badge.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {plan.badge}
                  </Badge>
                )}
              </div>

              {/* Content on Right */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-foreground mb-1 truncate" data-testid={`text-plan-${plan.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  {plan.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                  {plan.description}
                </p>
                
                {/* Price and Rating Row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#FF6B6B] line-through" data-testid={`text-original-price-${plan.id}`}>
                      ₹{plan.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-base font-bold text-primary" data-testid={`text-current-price-${plan.id}`}>
                      ₹{plan.currentPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-[#FFD700] text-[#FFD700]" />
                    <span className="text-xs font-semibold" data-testid={`text-rating-${plan.id}`}>
                      {plan.rating}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({plan.reviewCount.toLocaleString()}+)
                    </span>
                  </div>
                </div>

                <Button
                  size="sm"
                  className="w-full bg-primary text-primary-foreground rounded-full text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCategorySelect?.(plan.id);
                  }}
                  data-testid={`button-subscribe-${plan.id}`}
                >
                  Subscribe Now
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
