import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  ChevronRight, 
  Utensils, 
  Heart, 
  ShieldCheck, 
  Star, 
  Users,
  ChefHat,
  Stethoscope,
  Activity,
  LogIn
} from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroSlider from "@/components/HeroSlider";
import HealthGoalsCategory from "@/components/HealthGoalsCategory";
import NutritionistSlider from "@/components/NutritionistSlider";
import PromotionalBanner from "@/components/PromotionalBanner";
import TestimonialCard from "@/components/TestimonialCard";
import SmartNotification from "@/components/SmartNotification";
import LocationSearch from "@/components/LocationSearch";
import ClientFooter from "@/components/ClientFooter";
import BottomNavigation from "@/components/BottomNavigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { pageTransitionVariants, viewportConfig } from "@/lib/animations";
import { useAuth } from "@/hooks/use-auth";

import heroBanner from "@assets/generated_images/Home-cooked_comfort_food_banner_9590a8d1.png";
import heritageImage from "@assets/generated_images/Healthy_meal_variety_banner_8fc80c10.png";
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

  // Fetch data
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

  const testimonials = [
    {
      name: "Meera, 28 – Content Writer",
      role: "Content Writer",
      testimonial:
        "I signed up after seeing their Instagram ad saying \"Meals made with care.\" True to that, I got a call from their nutritionist a few days in. She spoke with me about my stress, eating gaps, and even sleep. It felt like therapy through food. Now my mom doesn't just ask if I ate—she says, \"Hope you had your nutrition check too!\"",
      image: customer1,
    },
    {
      name: "Nikhil, 35 – Sales Manager",
      role: "Sales Manager",
      testimonial:
        "I'm always on the move, and I hated planning food. A colleague using Zyael Nutri Box recommended it. I liked that it wasn't just meal delivery—every week I get a short nutrition consultation where they tweak my meals based on my schedule and how I feel. It's like having a support system without needing to step out.",
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
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden font-sans pb-20">
      {/* Premium Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-[#006442] p-1.5 md:p-2 rounded-lg shadow-lg shadow-green-900/10">
              <Utensils className="h-4 w-4 md:h-6 md:w-6 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tighter text-[#006442]">ZyaeL <span className="text-slate-800">NutriBox</span></span>
          </div>
          <div className="hidden lg:flex items-center gap-10 text-sm font-bold text-slate-600 uppercase tracking-widest">
            <a href="#plans" className="hover:text-[#006442] transition-all">Meal Plans</a>
            <a href="#experts" className="hover:text-[#006442] transition-all">Experts</a>
            <a href="#story" className="hover:text-[#006442] transition-all">Story</a>
            <a href="#news" className="hover:text-[#006442] transition-all">News</a>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <Button 
              variant="ghost"
              onClick={() => setLocation("/management/login")}
              className="text-[#006442] font-black uppercase tracking-widest text-[10px] md:text-xs h-9 md:h-12 px-3 md:px-6"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => setLocation("/management/login")}
              className="bg-[#006442] hover:bg-[#004d33] text-white rounded-full px-4 md:px-8 h-9 md:h-12 font-black uppercase tracking-widest text-[10px] md:text-xs shadow-xl shadow-green-900/20 transition-all hover:scale-105 active:scale-95"
            >
              Start
            </Button>
          </div>
        </div>
      </nav>

      <motion.main 
        initial="initial"
        animate="animate"
        variants={pageTransitionVariants}
        className="pt-16 md:pt-20"
      >
        {/* Location & Notification Overlay */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 md:pt-4">
           <LocationSearch
             location="Mumbai, Maharashtra"
             onLocationClick={() => {}}
             onSearch={(q) => console.log(q)}
           />
        </div>
        
        <SmartNotification
          delayMs={120000}
          onChatNow={() => {}}
          onLater={() => {}}
        />

        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <motion.div key="home" {...pageTransitionVariants} className="w-full">
              
              {/* EDGE TO EDGE HERO SLIDER */}
              <section className="w-full mb-8 md:mb-16">
                 <div className="w-full h-[300px] md:h-[650px] overflow-hidden">
                   <HeroSlider
                     slides={heroSlides}
                     autoRotateInterval={5000}
                     onCtaClick={() => setLocation("/management/login")}
                   />
                 </div>
              </section>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 md:space-y-24">
                
                {/* Health Goals Category */}
                <section id="plans">
                  <HealthGoalsCategory onCategorySelect={(id) => console.log(id)} />
                </section>

                {/* Nutritionist Slider */}
                <section id="experts">
                  <div className="text-center mb-8 md:mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-2 md:mb-4 tracking-tight">Meet Your Experts</h2>
                    <p className="text-lg md:text-xl text-slate-500 font-medium italic">Clinical guidance for every bite.</p>
                  </div>
                  <NutritionistSlider
                    nutritionists={nutritionists}
                    onConsult={() => setLocation("/management/login")}
                  />
                </section>

                {/* Promotional Banner */}
                <PromotionalBanner autoRotateInterval={4000} />

              </div>

              {/* PREMIUM STORY SECTION (The Green Part) */}
              <section id="story" className="py-12 md:py-24 bg-green-900 text-white relative overflow-hidden mt-12 md:mt-24">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-center">
                    <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={viewportConfig}>
                      <h2 className="text-xs md:text-sm font-black text-green-400 uppercase tracking-[0.3em] mb-4 md:mb-8 flex items-center gap-3">
                        <Heart className="h-4 w-4 fill-green-400" />
                        Our Heritage
                      </h2>
                      <p className="text-3xl md:text-7xl font-black mb-6 md:mb-10 tracking-tight leading-[0.9]">Inspired by Mom, <br /><span className="text-green-400">Refined by Science.</span></p>
                      <div className="space-y-4 md:space-y-8 text-lg md:text-xl text-green-100/80 font-medium leading-relaxed">
                        <p>There was a time when every morning began with a familiar voice— "Beta, did you eat your breakfast?" That voice was our first nutritionist—our mothers.</p>
                        <p>Their love nourished our hearts. ZyaeL NutriBox brings that home-cooked goodness back with modern clinical precision.</p>
                      </div>
                      <Button onClick={() => setLocation("/management/login")} className="mt-8 md:mt-12 bg-white text-green-900 hover:bg-green-50 h-12 md:h-16 px-6 md:px-10 rounded-2xl font-black uppercase tracking-widest text-xs md:text-sm shadow-2xl">
                        Join the Family
                      </Button>
                    </motion.div>
                    <div className="relative">
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={viewportConfig} className="aspect-square rounded-[32px] md:rounded-[64px] overflow-hidden shadow-2xl relative group">
                        <img src={heritageImage} alt="Our Heritage" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 via-transparent to-transparent opacity-60" />
                        <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 p-4 md:p-8 bg-white/10 backdrop-blur-md rounded-2xl md:rounded-3xl border border-white/20">
                          <Heart className="h-6 w-6 md:h-8 md:w-8 text-green-400 mb-2 md:mb-4" />
                          <p className="text-lg md:text-xl font-bold leading-tight italic text-white">"Every box we deliver is a promise of health and a hug from home."</p>
                        </div>
                      </motion.div>
                      {/* Stats Overlay */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={viewportConfig}
                        transition={{ delay: 0.5 }}
                        className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 bg-white p-4 md:p-8 rounded-2xl md:rounded-[32px] shadow-2xl text-slate-900 hidden sm:block"
                      >
                        <p className="text-2xl md:text-4xl font-black text-green-600 mb-1">4.9/5</p>
                        <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400">Customer Rating</p>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </section>

              {/* RESTORED REVIEWS SECTION */}
              <section id="testimonials" className="py-12 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-8 md:mb-16">
                    <h2 className="text-xs md:text-sm font-black text-[#006442] uppercase tracking-[0.2em] mb-2 md:mb-4">Customer Love</h2>
                    <p className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Here What Our Customers Say</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                    {testimonials.map((testimonial) => (
                      <TestimonialCard key={testimonial.name} {...testimonial} />
                    ))}
                  </div>
                </div>
              </section>

              {/* HOME-COOKED GOODNESS BANNER */}
              <section className="py-12 md:py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4">
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={viewportConfig} className="bg-gradient-to-br from-[#006442]/10 to-transparent rounded-[32px] md:rounded-[48px] p-8 md:p-24 text-center border border-green-100">
                    <h2 className="text-2xl md:text-5xl font-black text-slate-900 mb-4 md:mb-8 tracking-tight">Home-Cooked Goodness, Inspired by Mom <br />& Perfected by Nutritionists</h2>
                    <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto mb-8 md:mb-12 font-medium">Every meal is thoughtfully crafted by expert nutritionists, inspired by the warmth of a mother's kitchen. It's not just food, it's comfort with a promise of health.</p>
                    <Button onClick={() => setLocation("/management/login")} className="bg-[#006442] text-white rounded-full h-12 md:h-16 px-8 md:px-12 font-black uppercase tracking-widest text-xs md:text-sm hover:scale-105 transition-all">Subscribe Now</Button>
                  </motion.div>
                </div>
              </section>

              {/* RESTORED NEWS ABOUT NUTRITION SECTION */}
              <section id="news" className="py-12 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-8 md:mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-2 md:mb-4 tracking-tight">News About Nutrition</h2>
                  </div>
                  <Carousel opts={{ align: "start", loop: true }} className="w-full">
                    <CarouselContent>
                      {newsArticles.map((article, index) => (
                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2">
                          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewportConfig} className="bg-white rounded-2xl md:rounded-[32px] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/40 h-full group">
                            <div className="aspect-video overflow-hidden">
                              <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            </div>
                            <div className="p-6 md:p-10">
                              <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-2 md:mb-4">{article.title}</h3>
                              <p className="text-sm md:text-base text-slate-500 mb-6 md:mb-8 font-medium leading-relaxed">{article.description}</p>
                              <Button variant="outline" className="rounded-full border-2 border-[#006442] text-[#006442] font-black uppercase text-[10px] md:text-xs tracking-widest">Read Article</Button>
                            </div>
                          </motion.div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:flex" />
                    <CarouselNext className="hidden md:flex" />
                  </Carousel>
                </div>
              </section>

              {/* Premium Footer */}
              <footer className="py-12 md:py-20 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-600 p-1.5 md:p-2 rounded-xl shadow-lg shadow-green-900/40">
                        <Utensils className="h-5 w-5 md:h-6 md:w-6 text-white" />
                      </div>
                      <span className="text-2xl md:text-3xl font-black tracking-tighter">ZyaeL <span className="text-green-500">NutriBox</span></span>
                    </div>
                    <p className="text-slate-500 font-bold text-xs md:text-sm text-center md:text-left">© 2026 ZyaeL NutriBox Bengaluru. Hand-crafted with care.</p>
                    <div className="flex gap-4 md:gap-8 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                      <a href="#" className="hover:text-green-400 transition-colors">Privacy</a>
                      <a href="#" className="hover:text-green-400 transition-colors">Terms</a>
                      <Button variant="link" onClick={() => setLocation("/management")} className="text-slate-800 p-0 h-auto text-[10px]">Portal</Button>
                    </div>
                  </div>
                </div>
              </footer>

            </motion.div>
          )}
          
          {/* Other Tabs (Cart, Orders, Track, Profile) */}
          {activeTab === "cart" && (
            <motion.div key="cart" {...pageTransitionVariants} className="max-w-6xl mx-auto px-4 py-12">
               <h1 className="text-4xl font-black mb-12">Your Basket</h1>
               <div className="bg-slate-50 rounded-[40px] p-20 text-center border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium text-lg">Your cart is currently empty.</p>
                  <Button onClick={() => setActiveTab("home")} className="mt-8 bg-[#006442] rounded-full px-10 h-14 font-bold">Discover Plans</Button>
               </div>
            </motion.div>
          )}
          
          {activeTab === "orders" && (
            <motion.div key="orders" {...pageTransitionVariants} className="max-w-6xl mx-auto px-4 py-12 text-center">
               <h1 className="text-4xl font-black mb-12 text-[#006442]">My Subscriptions</h1>
               <div className="p-20 bg-green-50 rounded-[40px]">
                  <p className="text-[#006442] font-bold text-xl mb-4">Ready to start eating healthy?</p>
                  <p className="text-slate-500 font-medium mb-10">You don't have any active subscriptions yet.</p>
                  <Button onClick={() => setLocation("/management/login")} className="bg-[#006442] text-white rounded-full px-12 h-16 font-black uppercase tracking-widest text-sm shadow-xl shadow-green-900/20">Sign In to View</Button>
               </div>
            </motion.div>
          )}
          
          {activeTab === "track" && (
             <motion.div key="track" {...pageTransitionVariants} className="max-w-7xl mx-auto px-4 py-12">
                <EnhancedTracking nutritionData={nutritionData} onDownloadReport={() => {}} onAddWeight={() => {}} />
             </motion.div>
          )}
          
          {activeTab === "profile" && (
             <motion.div key="profile" {...pageTransitionVariants} className="max-w-4xl mx-auto px-4 py-12 text-center">
                <div className="bg-white rounded-[48px] shadow-2xl p-16 border border-slate-100">
                   <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner">
                      <Users className="h-16 w-16 text-[#006442]" />
                   </div>
                   <h1 className="text-4xl font-black mb-4">Member Access</h1>
                   <p className="text-slate-500 font-medium text-lg mb-12">Manage your clinical dietary preferences and account settings.</p>
                   <Button onClick={() => setLocation("/management/login")} className="w-full bg-[#006442] text-white rounded-2xl h-16 font-black uppercase tracking-widest text-sm shadow-xl shadow-green-900/20 transition-all hover:scale-[1.02]">Access My Account</Button>
                </div>
             </motion.div>
          )}

        </AnimatePresence>

        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </motion.main>
    </div>
  );
}
