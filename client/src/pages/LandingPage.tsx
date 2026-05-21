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
import { pageTransitionVariants, viewportConfig } from "@/lib/animations";

import heroBanner from "@assets/generated_images/Home-cooked_comfort_food_banner_9590a8d1.png";
import weightLoss from "@assets/generated_images/Healthy_balanced_meal_food_36201b9b.png";
import veganMeal from "@assets/generated_images/Vegan_plant-based_salad_bowl_552c75a9.png";
import proteinMeal from "@assets/generated_images/Protein-rich_fitness_meal_28329687.png";
import nutritionist1 from "@assets/generated_images/Female_nutritionist_professional_portrait_a8930d89.png";
import nutritionist2 from "@assets/generated_images/Male_nutritionist_professional_portrait_5241518d.png";

export default function LandingPage() {
  const [, setLocation] = useLocation();

  // Fetch data for components
  const { data: mealPlansData } = useQuery({
    queryKey: ["/api/meal-plans"],
  });

  const { data: nutritionistsData } = useQuery({
    queryKey: ["/api/nutritionists"],
  });

  // Hero Slider Data (matching ClientPortal)
  const heroSlides = [
    {
      id: 1,
      title: "Home-Cooked Goodness",
      subtitle: "Perfected by nutritionists, inspired by mom's kitchen.",
      image: heroBanner,
      ctaText: "Choose Your Plan",
    },
    {
      id: 2,
      title: "Science Meets Soul",
      subtitle: "Delicious meals backed by clinical research.",
      image: weightLoss,
      ctaText: "View Menu",
    },
  ];

  // Nutritionist Data
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
      name: "Meera, Bengaluru",
      role: "Content Writer",
      testimonial: "It felt like therapy through food. Now my mom doesn't just ask if I ate—she says, 'Hope you had your nutrition check too!'",
      image: nutritionist1,
      rating: 5
    },
    {
      name: "Ankit, Bengaluru",
      role: "Tech Professional",
      testimonial: "ZyaeL NutriBox has completely transformed my lunch hours. No more junk food, just healthy, delicious meals!",
      image: nutritionist2,
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden font-sans">
      {/* Premium Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-[#006442] p-2 rounded-lg shadow-lg shadow-green-900/10">
              <Utensils className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-[#006442]">ZyaeL <span className="text-slate-800">NutriBox</span></span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-sm font-bold text-slate-600 uppercase tracking-widest">
            <a href="#plans" className="hover:text-[#006442] transition-all">Meal Plans</a>
            <a href="#experts" className="hover:text-[#006442] transition-all">Our Experts</a>
            <a href="#story" className="hover:text-[#006442] transition-all">Our Story</a>
            <a href="#testimonials" className="hover:text-[#006442] transition-all">Reviews</a>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost"
              onClick={() => setLocation("/management/client")}
              className="text-[#006442] font-black uppercase tracking-widest text-xs h-12 px-6"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => setLocation("/management/client")}
              className="bg-[#006442] hover:bg-[#004d33] text-white rounded-full px-8 h-12 font-black uppercase tracking-widest text-xs shadow-xl shadow-green-900/20 transition-all hover:scale-105 active:scale-95"
            >
              Start Journey
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <motion.main 
        initial="initial"
        animate="animate"
        variants={pageTransitionVariants}
        className="pt-20"
      >
        {/* Hero Section */}
        <section className="px-4 py-8 md:px-8 md:py-12">
          <div className="max-w-7xl mx-auto">
            <HeroSlider
              slides={heroSlides}
              autoRotateInterval={5000}
              onCtaClick={() => setLocation("/management/client")}
            />
          </div>
        </section>

        {/* Health Goals Section */}
        <section id="plans" className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <HealthGoalsCategory
              onCategorySelect={(id) => setLocation("/management/client")}
            />
          </div>
        </section>

        {/* Nutritionist Section */}
        <section id="experts" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight"
              >
                Meet Your Personal Nutritionists
              </motion.h2>
              <p className="text-xl text-slate-500 font-medium">Expert guidance to help you make the best food choices.</p>
            </div>
            <NutritionistSlider
              nutritionists={nutritionists}
              onConsult={() => setLocation("/management/client")}
            />
          </div>
        </section>

        {/* Promotional Banner */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PromotionalBanner autoRotateInterval={4000} />
          </div>
        </section>

        {/* Story Section - The Heart of ZyaeL */}
        <section id="story" className="py-24 bg-green-900 text-white relative overflow-hidden">
          {/* Decorations */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-green-400/10 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={viewportConfig}
              >
                <h2 className="text-sm font-black text-green-400 uppercase tracking-[0.3em] mb-8">Our Heritage</h2>
                <p className="text-5xl md:text-7xl font-black mb-10 tracking-tight leading-[0.9]">Inspired by Mom, <br /><span className="text-green-400">Refined by Clinical Science.</span></p>
                <div className="space-y-8 text-xl text-green-100/80 font-medium leading-relaxed">
                  <p>There was a time when every morning began with a familiar voice— "Beta, did you eat your breakfast?" That voice was our first nutritionist—our mothers.</p>
                  <p>Their love didn't just fill our stomachs; it nourished our hearts. We missed those meals. But more than that, we missed the love that came with them.</p>
                  <p className="text-white font-bold">ZyaeL NutriBox brings that home-cooked goodness back, with the precision of modern clinical nutrition.</p>
                </div>
                <Button 
                  onClick={() => setLocation("/management/client")}
                  className="mt-12 bg-white text-green-900 hover:bg-green-50 h-16 px-10 rounded-2xl font-black uppercase tracking-widest text-sm transition-all hover:scale-105"
                >
                  Join the Family
                </Button>
              </motion.div>
              <div className="relative">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={viewportConfig}
                  className="aspect-square rounded-[64px] bg-gradient-to-br from-green-800 to-green-950 p-8 flex flex-col justify-between"
                >
                  <Heart className="h-20 w-20 text-green-400/20" />
                  <div className="space-y-4">
                    <p className="text-3xl font-black leading-tight italic text-green-100">"Every box we deliver is a promise of health and a hug from home."</p>
                    <p className="text-green-400 font-bold uppercase tracking-widest">— ZyaeL Philosophy</p>
                  </div>
                </motion.div>
                {/* Stats Overlay */}
                <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-[32px] shadow-2xl text-slate-900 hidden md:block">
                  <p className="text-4xl font-black text-green-600 mb-1">4.9/5</p>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">Customer Rating</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-sm font-black text-[#006442] uppercase tracking-[0.2em] mb-4">Social Proof</h2>
              <p className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Loved by Bengaluru Professionals</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {testimonials.map((t, idx) => (
                <TestimonialCard key={t.name} {...t} />
              ))}
            </div>
          </div>
        </section>

        {/* Hidden Management Secret Access (for developers/admins) */}
        <section className="py-20 bg-slate-50 border-t border-slate-100">
           <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-slate-300 font-black uppercase tracking-[0.3em] text-[10px] mb-8">Clinical Nutrition Network</p>
              <div className="flex justify-center gap-20 opacity-20 grayscale hover:opacity-50 transition-all cursor-default">
                 <ShieldCheck className="h-10 w-10" />
                 <Stethoscope className="h-10 w-10" />
                 <ChefHat className="h-10 w-10" />
                 <Activity className="h-10 w-10" />
              </div>
           </div>
        </section>
      </motion.main>

      {/* Footer */}
      <footer className="py-16 bg-slate-900 text-white border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-2">
              <div className="bg-green-600 p-1.5 rounded-lg">
                <Utensils className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">ZyaeL <span className="text-green-500">NutriBox</span></span>
            </div>
            <p className="text-slate-500 font-medium text-sm">© 2026 ZyaeL NutriBox Bengaluru. All rights reserved.</p>
            <div className="flex items-center gap-8 text-xs font-black uppercase tracking-widest text-slate-500">
              <a href="#" className="hover:text-green-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-green-400 transition-colors">Terms of Service</a>
              <Button 
                variant="link" 
                onClick={() => setLocation("/management")} 
                className="text-slate-800 hover:text-slate-700 h-auto p-0 text-[10px]"
              >
                Admin
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
