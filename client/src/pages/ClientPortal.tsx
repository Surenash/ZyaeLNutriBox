import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { pageTransitionVariants, viewportConfig } from "@/lib/animations";
import HeroBanner from "@/components/HeroBanner";
import DietPlanCard from "@/components/DietPlanCard";
import NutritionistCard from "@/components/NutritionistCard";
import TestimonialCard from "@/components/TestimonialCard";
import MealStatusCard from "@/components/MealStatusCard";
import NutritionProgress from "@/components/NutritionProgress";
import BottomNavigation from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";

import heroBanner from "@assets/generated_images/Home-cooked_comfort_food_banner_9590a8d1.png";
import weightLoss from "@assets/generated_images/Healthy_balanced_meal_food_36201b9b.png";
import veganMeal from "@assets/generated_images/Vegan_plant-based_salad_bowl_552c75a9.png";
import proteinMeal from "@assets/generated_images/Protein-rich_fitness_meal_28329687.png";
import pcosMeal from "@assets/generated_images/PCOS-friendly_healthy_meal_1a327607.png";
import nutritionist1 from "@assets/generated_images/Female_nutritionist_professional_portrait_a8930d89.png";
import nutritionist2 from "@assets/generated_images/Male_nutritionist_professional_portrait_5241518d.png";
import customer1 from "@assets/generated_images/Happy_customer_testimonial_photo_4e688e5c.png";
import customer2 from "@assets/generated_images/Business_professional_customer_testimonial_18fae654.png";

export default function ClientPortal() {
  const [activeTab, setActiveTab] = useState("home");

  //todo: remove mock functionality
  const dietPlans = [
    {
      title: "Weight Loss",
      description: "Balanced meals to help shed fat effectively",
      originalPrice: 17000,
      currentPrice: 15000,
      rating: 4.8,
      reviewCount: 3200,
      badge: "Bestseller",
      image: weightLoss,
    },
    {
      title: "Muscle Gain",
      description: "Protein-rich meals for lean muscle development",
      originalPrice: 18000,
      currentPrice: 15000,
      rating: 4.7,
      reviewCount: 2800,
      badge: "Popular",
      image: proteinMeal,
    },
    {
      title: "PCOS Friendly",
      description: "Low glycemic meals for health management",
      originalPrice: 16500,
      currentPrice: 15000,
      rating: 4.6,
      reviewCount: 2300,
      badge: "Recommended",
      image: pcosMeal,
    },
    {
      title: "Vegan / Vegetarian",
      description: "Plant-based nourishment for every lifestyle",
      originalPrice: 16000,
      currentPrice: 15000,
      rating: 4.5,
      reviewCount: 2100,
      badge: "Healthy Choice",
      image: veganMeal,
    },
  ];

  const nutritionists = [
    {
      name: "Dr. Priya Sharma",
      specialization: "Clinical Nutritionist & Dietitian",
      experience: "12 years experience",
      rating: 4.9,
      image: nutritionist1,
    },
    {
      name: "Dr. Amit Patel",
      specialization: "Sports Nutrition Specialist",
      experience: "10 years experience",
      rating: 4.8,
      image: nutritionist2,
    },
  ];

  const testimonials = [
    {
      name: "Meera",
      role: "Content Writer",
      location: "Bengaluru",
      testimonial:
        "I signed up after seeing their Instagram ad saying 'Meals made with care.' True to that, I got a call from their nutritionist a few days in. She spoke with me about my stress, eating gaps, and even sleep. It felt like therapy through food.",
      image: customer1,
    },
    {
      name: "Nikhil",
      role: "Sales Manager",
      location: "Bengaluru",
      testimonial:
        "I'm always on the move, and I hated planning food. A colleague using Zyael Nutri Box recommended it. I liked that it wasn't just meal delivery—every week I get a short nutrition consultation where they tweak my meals based on my schedule and how I feel.",
      image: customer2,
    },
  ];

  const nutritionData = [
    { label: "Calories", current: 870, target: 1500, unit: " kcal", color: "hsl(var(--chart-1))" },
    { label: "Protein", current: 45, target: 60, unit: "g", color: "hsl(var(--chart-3))" },
    { label: "Carbs", current: 110, target: 200, unit: "g", color: "hsl(var(--chart-2))" },
    { label: "Fats", current: 25, target: 50, unit: "g", color: "hsl(var(--chart-4))" },
  ];

  return (
    <motion.div
      {...pageTransitionVariants}
      className="min-h-screen bg-background pb-20"
    >
      <AnimatePresence mode="wait">
        {activeTab === "home" && (
          <motion.div
            key="home"
            {...pageTransitionVariants}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16"
          >
            <HeroBanner
            title="Home-Cooked Goodness, Inspired by Mom"
            subtitle="Every meal is thoughtfully crafted by expert nutritionists, inspired by the warmth of a mother's kitchen"
            ctaText="Start Today →"
            backgroundImage={heroBanner}
            onCtaClick={() => console.log("Start today clicked")}
          />

          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewportConfig}
            transition={{ duration: 0.6 }}
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportConfig}
              className="text-3xl font-bold text-foreground mb-8"
            >
              Choose Your Health Goal
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dietPlans.map((plan) => (
                <DietPlanCard
                  key={plan.title}
                  {...plan}
                  onSubscribe={() => console.log(`Subscribe to ${plan.title}`)}
                />
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewportConfig}
            transition={{ duration: 0.6 }}
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportConfig}
              className="text-3xl font-bold text-foreground mb-8"
            >
              Meet Our Team of Nutritionists
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nutritionists.map((nutritionist) => (
                <NutritionistCard
                  key={nutritionist.name}
                  {...nutritionist}
                  onConsult={() => console.log(`Consult ${nutritionist.name}`)}
                />
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewportConfig}
            transition={{ duration: 0.6 }}
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportConfig}
              className="text-3xl font-bold text-foreground mb-8"
            >
              Here's What Our Customers Say
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.name} {...testimonial} />
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={viewportConfig}
            transition={{ duration: 0.6 }}
            className="bg-primary/5 rounded-2xl p-8 text-center"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have transformed their health with ZyaeL NutriBox
            </p>
            <Button
              size="lg"
              className="bg-primary text-primary-foreground rounded-full px-8 hover-elevate active-elevate-2"
              data-testid="button-subscribe-now"
            >
              Subscribe Now
            </Button>
          </motion.section>
        </motion.div>
        )}

        {activeTab === "track" && (
          <motion.div
            key="track"
            {...pageTransitionVariants}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6"
          >
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-foreground mb-6"
            >
              Today's Food Journey
            </motion.h1>

            <div className="space-y-3">
              <MealStatusCard
              mealType="Breakfast"
              status="delivered"
              time="8:00 AM"
              onViewDetails={() => console.log("View breakfast details")}
            />
            <MealStatusCard
              mealType="Lunch"
              status="delivered"
              time="1:00 PM"
              onViewDetails={() => console.log("View lunch details")}
            />
              <MealStatusCard
                mealType="Dinner"
                status="in-transit"
                time="Expected 7:00 PM"
                onViewDetails={() => console.log("View dinner details")}
              />
            </div>

            <NutritionProgress items={nutritionData} />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Meal Insights
              </h3>
              <p className="text-sm text-muted-foreground">
                You're making great progress! Keep up the consistent meal completion to reach your goals faster.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </motion.div>
  );
}
