import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { pageTransitionVariants, viewportConfig } from "@/lib/animations";
import { useRealtime } from "@/hooks/use-realtime";
import HeroSlider from "@/components/HeroSlider";
import HealthGoalsCategory from "@/components/HealthGoalsCategory";
import NutritionistSlider from "@/components/NutritionistSlider";
import PromotionalBanner from "@/components/PromotionalBanner";
import SmartNotification from "@/components/SmartNotification";
import EnhancedTracking from "@/components/EnhancedTracking";
import ClientFooter from "@/components/ClientFooter";
import LocationSearch from "@/components/LocationSearch";
import TestimonialCard from "@/components/TestimonialCard";
import BottomNavigation from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useAuth } from "@/hooks/use-auth";

import heroBanner from "@assets/generated_images/Home-cooked_comfort_food_banner_9590a8d1.png";
import weightLoss from "@assets/generated_images/Healthy_balanced_meal_food_36201b9b.png";
import veganMeal from "@assets/generated_images/Vegan_plant-based_salad_bowl_552c75a9.png";
import proteinMeal from "@assets/generated_images/Protein-rich_fitness_meal_28329687.png";
import pcosMeal from "@assets/generated_images/PCOS-friendly_healthy_meal_1a327607.png";
import nutritionist1 from "@assets/generated_images/Female_nutritionist_professional_portrait_a8930d89.png";
import nutritionist2 from "@assets/generated_images/Male_nutritionist_professional_portrait_5241518d.png";
import customer1 from "@assets/generated_images/Happy_customer_testimonial_photo_4e688e5c.png";
import customer2 from "@assets/generated_images/Business_professional_customer_testimonial_18fae654.png";
import newsCalorie from "@assets/stock_images/healthy_nutrition_me_799f8107.jpg";
import newsSuperfoods from "@assets/stock_images/superfoods_healthy_i_2052ee3c.jpg";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("home");
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  // Real-time updates
  useRealtime({
    events: ["meal_plan_created", "meal_plan_updated", "meal_plan_deleted", "nutritionist_created", "nutritionist_updated"],
    invalidateQueries: [["/api/meal-plans"], ["/api/nutritionists"]],
    showToast: true,
  });

  const { data: mealPlansData, isLoading: mealPlansLoading } = useQuery({
    queryKey: ["/api/meal-plans"],
  });

  const { data: nutritionistsData, isLoading: nutritionistsLoading } = useQuery({
    queryKey: ["/api/nutritionists"],
  });

  const nutritionistImageMap: { [key: string]: string } = {
    "Dr. Priya Sharma": nutritionist1,
    "Rahul Menon": nutritionist2,
    "Ananya Patel": nutritionist1,
    "Vikram Singh": nutritionist2,
  };

  const nutritionists = (Array.isArray(nutritionistsData) ? nutritionistsData : []).map((nutritionist: any) => ({
    ...nutritionist,
    image: nutritionistImageMap[nutritionist.name] || nutritionist1,
    experience: `${nutritionist.experienceYears} years experience`,
  }));

  const testimonials = [
    {
      name: "Meera, 28 – Content Writer",
      role: "Content Writer",
      location: "Bengaluru",
      testimonial:
        "I signed up after seeing their Instagram ad saying \"Meals made with care.\" True to that, I got a call from their nutritionist a few days in. She spoke with me about my stress, eating gaps, and even sleep. It felt like therapy through food. Now my mom doesn't just ask if I ate—she says, \"Hope you had your nutrition check too!\"",
      image: customer1,
    },
    {
      name: "Nikhil, 35 – Sales Manager",
      role: "Sales Manager",
      location: "Bengaluru",
      testimonial:
        "I'm always on the move, and I hated planning food. A colleague using Zyael Nutri Box recommended it. I liked that it wasn't just meal delivery—every week I get a short nutrition consultation where they tweak my meals based on my schedule and how I feel. It's like having a support system without needing to step out.",
      image: customer2,
    },
  ];

  const heroSlides = [
    {
      id: 1,
      title: "Personalized Nutrition for Every Goal",
      subtitle: "Every meal is thoughtfully crafted by expert nutritionists, inspired by the warmth of a mother's kitchen",
      ctaText: "Start Today",
      backgroundImage: heroBanner,
    },
    {
      id: 2,
      title: "Track. Eat. Transform. Your Health Journey Starts Here.",
      subtitle: "Join 10,000+ happy customers who achieved their health goals with us",
      ctaText: "Get Started",
      backgroundImage: weightLoss,
    },
    {
      id: 3,
      title: "Expert Nutrition Support - 4 Consults per Month",
      subtitle: "Get personalized guidance from certified nutritionists throughout your journey",
      ctaText: "Book Now",
      backgroundImage: proteinMeal,
    },
  ];

  const newsArticles = [
    {
      title: "How to Identify Your Daily Calorie Needs Based on Your Goals",
      description: "Understanding your daily calorie needs is a key step in achieving your health and fitness goals, whether...",
      image: newsCalorie,
    },
    {
      title: "Top 10 Superfoods to Include in Your Daily Diet",
      description: "Superfoods are nutrient-dense ingredients that offer immense health benefits. Incorporating them into...",
      image: newsSuperfoods,
    },
  ];

  const nutritionData = [
    { label: "Calories", current: 870, target: 1500, unit: " kcal", color: "hsl(var(--chart-1))" },
    { label: "Protein", current: 45, target: 60, unit: "g", color: "hsl(var(--chart-3))" },
    { label: "Carbs", current: 110, target: 200, unit: "g", color: "hsl(var(--chart-2))" },
    { label: "Fats", current: 25, target: 50, unit: "g", color: "hsl(var(--chart-4))" },
  ];

  // Mock data for Cart/Orders/Profile
  const cartItems = [
    { id: 1, title: "Weight Loss Plan", duration: "30 Days Subscription", image: weightLoss, originalPrice: 17000, price: 15000, quantity: 1 },
    { id: 2, title: "Muscle Gain Plan", duration: "30 Days Subscription", image: proteinMeal, originalPrice: 18000, price: 15000, quantity: 1 },
  ];

  const orderHistory = [
    { id: "ORD1234", date: "November 28, 2025", plan: "Weight Loss Plan", duration: "30 Days", status: "delivered", amount: 15000, image: weightLoss },
    { id: "ORD1233", date: "October 30, 2025", plan: "PCOS Friendly Plan", duration: "30 Days", status: "delivered", amount: 15000, image: pcosMeal },
  ];

  return (
    <motion.div
      {...pageTransitionVariants}
      className="min-h-screen bg-background pb-20"
    >
      {/* Location and Search Bar */}
      <LocationSearch
        location="Mumbai, Maharashtra"
        onLocationClick={() => console.log("Location clicked")}
        onSearch={(query) => console.log("Search:", query)}
      />

      {/* Smart Notification */}
      <SmartNotification
        delayMs={120000}
        onChatNow={() => console.log("Chat now clicked")}
        onLater={() => console.log("Later clicked")}
      />

      <AnimatePresence mode="wait">
        {activeTab === "home" && (
          <motion.div
            key="home"
            {...pageTransitionVariants}
            className="w-full space-y-16"
          >
            {/* Hero Slider - EDGE TO EDGE */}
            <section className="w-full px-0">
               <div className="w-full h-[400px] md:h-[600px] overflow-hidden">
                 <HeroSlider
                   slides={heroSlides}
                   autoRotateInterval={5000}
                   onCtaClick={() => setLocation("/management/login")}
                 />
               </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 py-8">
              {/* Health Goals Categories */}
              <HealthGoalsCategory
                onCategorySelect={(categoryId) => console.log("Category selected:", categoryId)}
              />

              {/* Nutritionist Consultation Slider */}
              {nutritionistsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 text-center">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-card rounded-2xl p-6 animate-pulse">
                      <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4"></div>
                      <div className="h-4 bg-muted rounded mb-2 w-3/4 mx-auto"></div>
                      <div className="h-3 bg-muted rounded w-1/2 mx-auto"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <NutritionistSlider
                  nutritionists={nutritionists}
                  onConsult={(id) => console.log(`Consult nutritionist:`, id)}
                />
              )}

              {/* Promotional Banner */}
              <PromotionalBanner autoRotateInterval={4000} />

              {/* The Zyael Nutri Box Story */}
              <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={viewportConfig}
                transition={{ duration: 0.6 }}
                className="relative bg-gradient-to-br from-primary/5 to-transparent rounded-2xl md:rounded-3xl p-6 md:p-12"
              >
                <div className="text-center mb-6 md:mb-8">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewportConfig}
                    className="text-3xl md:text-5xl font-bold text-foreground mb-4 md:mb-6"
                  >
                    The Zyael Nutri Box Story
                  </motion.h2>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewportConfig}
                    transition={{ delay: 0.1 }}
                    className="text-base md:text-lg text-muted-foreground max-w-4xl mx-auto space-y-3 md:space-y-4 text-left"
                  >
                    <p>There was a time when every morning began with a familiar voice— "Beta, did you eat your breakfast?" Every afternoon, another call— "Lunch box khatam kiya? Kuch aur chahiye kya?"</p>
                    <p>And before bedtime— "Dinner toh le liya na?"</p>
                    <p>That voice was our first nutritionist—our mothers. Their love didn't just fill our stomachs; it nourished our hearts. But as we moved to new cities, chased our careers in Bangalore, Mumbai, or beyond, the calls became fewer, and the meals more rushed, random, or skipped.</p>
                    <p className="font-semibold text-foreground">We missed those meals. But more than that, we missed the love that came with them.</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewportConfig}
                    transition={{ delay: 0.2 }}
                    className="mt-6 md:mt-8"
                  >
                    <Button size="lg" variant="outline" className="rounded-full border-2">
                      Our Story
                    </Button>
                  </motion.div>
                </div>
              </motion.section>

              {/* Testimonials - Here What Our Customers Say About ZyaelNutribox */}
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
                    className="text-3xl md:text-5xl font-bold text-foreground mb-3 md:mb-4 px-4"
                  >
                    Here What Our Customers Say About ZyaelNutribox
                  </motion.h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {testimonials.map((testimonial) => (
                    <TestimonialCard key={testimonial.name} {...testimonial} />
                  ))}
                </div>
              </motion.section>

              {/* Home-Cooked Goodness Section */}
              <motion.section
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={viewportConfig}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl md:rounded-3xl p-6 md:p-16 text-center border border-primary/10"
              >
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewportConfig}
                  className="text-2xl md:text-5xl font-bold text-foreground mb-4 md:mb-6"
                >
                  Home-Cooked Goodness, Inspired by Mom & Perfected by Nutritionists
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewportConfig}
                  transition={{ delay: 0.1 }}
                  className="text-base md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-3xl mx-auto"
                >
                  Every meal is thoughtfully crafted by expert nutritionists, inspired by the warmth of a mother's kitchen. Packed with essential nutrients and made with authentic, home-style recipes — it's not just food, it's comfort with a promise of health.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewportConfig}
                  transition={{ delay: 0.2 }}
                >
                  <Button size="lg" className="bg-primary text-primary-foreground rounded-full hover-elevate active-elevate-2">
                    Subscribe Now
                  </Button>
                </motion.div>
              </motion.section>

              {/* News About Nutrition Section */}
              <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={viewportConfig}
                transition={{ duration: 0.6 }}
                className="relative px-0 md:px-12"
              >
                <div className="text-center mb-8 md:mb-12 px-4">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewportConfig}
                    className="text-3xl md:text-5xl font-bold text-foreground mb-3 md:mb-4"
                  >
                    News About Nutrition
                  </motion.h2>
                </div>
                <Carousel opts={{ align: "start", loop: true }} className="w-full px-4 md:px-0">
                  <CarouselContent>
                    {newsArticles.map((article, index) => (
                      <CarouselItem key={index} className="md:basis-1/2">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={viewportConfig}
                          className="bg-card rounded-2xl overflow-hidden hover-elevate h-full"
                        >
                          <div className="aspect-video overflow-hidden">
                            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="p-4 md:p-6">
                            <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2 md:mb-3">{article.title}</h3>
                            <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4">{article.description}</p>
                            <Button variant="outline" className="rounded-full">Read More</Button>
                          </div>
                        </motion.div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="rounded-full -left-4 md:-left-6 shadow-lg !hidden md:!inline-flex" />
                  <CarouselNext className="rounded-full -right-4 md:-right-6 shadow-lg !hidden md:!inline-flex" />
                </Carousel>
              </motion.section>
            </div>

            {/* Footer */}
            <ClientFooter />
            <div className="max-w-7xl mx-auto px-4 pb-12 flex justify-center opacity-10">
               <Button variant="link" onClick={() => setLocation("/management")} className="text-[10px] text-muted-foreground">Admin Access</Button>
            </div>
          </motion.div>
        )}

        {activeTab === "cart" && (
          <motion.div key="cart" {...pageTransitionVariants} className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Your Cart</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-md p-4 md:p-6 flex gap-4">
                    <img src={item.image} alt={item.title} className="w-20 h-20 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.duration}</p>
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center gap-3 border rounded-lg p-1">
                          <button className="px-2">−</button>
                          <span>{item.quantity}</span>
                          <button className="px-2">+</button>
                        </div>
                        <p className="font-bold text-primary">₹{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 h-fit sticky top-4">
                <h3 className="font-semibold mb-4">Price Summary</h3>
                <div className="border-t pt-3 flex justify-between">
                   <span>Total</span>
                   <span className="text-2xl font-bold text-primary">₹30,000</span>
                </div>
                <Button className="w-full mt-6 rounded-full" size="lg">Checkout</Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ... (Other tabs: orders, profile, track) */}
        {activeTab === "orders" && (
           <motion.div key="orders" {...pageTransitionVariants} className="max-w-6xl mx-auto px-4 py-8 text-center">
              <h1 className="text-2xl md:text-3xl font-bold mb-8">My Orders</h1>
              <p className="text-muted-foreground">Log in to view your order history.</p>
              <Button onClick={() => setLocation("/management/login")} className="mt-4 rounded-full">Sign In</Button>
           </motion.div>
        )}
        {activeTab === "track" && (
           <motion.div key="track" {...pageTransitionVariants} className="max-w-6xl mx-auto px-4 py-8">
              <EnhancedTracking nutritionData={nutritionData} onDownloadReport={() => {}} onAddWeight={() => {}} />
           </motion.div>
        )}
        {activeTab === "profile" && (
           <motion.div key="profile" {...pageTransitionVariants} className="max-w-4xl mx-auto px-4 py-8 text-center">
              <h1 className="text-2xl md:text-3xl font-bold mb-8">My Profile</h1>
              <p className="text-muted-foreground">Manage your dietary preferences and subscription.</p>
              <Button onClick={() => setLocation("/management/login")} className="mt-4 rounded-full">Sign In</Button>
           </motion.div>
        )}
      </AnimatePresence>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </motion.div>
  );
}
