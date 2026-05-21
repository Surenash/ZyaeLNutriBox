import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { 
  ChevronRight, 
  Utensils, 
  Heart, 
  ShieldCheck, 
  Star, 
  CheckCircle2,
  Users,
  ChefHat,
  Stethoscope,
  Truck
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Nutritionist Perfected",
    description: "Every meal is designed by expert nutritionists to ensure perfect macros and micros.",
    icon: Stethoscope,
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    title: "Cloud Kitchen Fresh",
    description: "Cooked fresh daily in our certified cloud kitchens with premium ingredients.",
    icon: ChefHat,
    color: "bg-red-500/10 text-red-600",
  },
  {
    title: "Rapid Delivery",
    description: "Hot, fresh, and on-time delivery right to your doorstep or office.",
    icon: Truck,
    color: "bg-orange-500/10 text-orange-600",
  },
  {
    title: "Personalized Goals",
    description: "Whether it's weight loss, muscle gain, or therapeutic diets, we've got you covered.",
    icon: Heart,
    color: "bg-green-500/10 text-green-600",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Marketing Executive",
    content: "ZyaeL NutriBox has completely transformed my lunch hours. No more junk food, just healthy, delicious meals!",
    avatar: "PS"
  },
  {
    name: "Rahul Verma",
    role: "Fitness Enthusiast",
    content: "The protein-rich meal plans are exactly what I needed for my gym routine. Highly recommended!",
    avatar: "RV"
  }
];

export default function LandingPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-[#006442] p-2 rounded-lg">
              <Utensils className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-[#006442]">ZyaeL <span className="text-slate-800">NutriBox</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-[#006442] transition-colors">Features</a>
            <a href="#about" className="hover:text-[#006442] transition-colors">About</a>
            <a href="#testimonials" className="hover:text-[#006442] transition-colors">Testimonials</a>
          </div>
          <Button 
            onClick={() => setLocation("/login")}
            className="bg-[#006442] hover:bg-[#004d33] text-white rounded-full px-6 font-bold shadow-lg shadow-green-900/10 transition-all hover:scale-105"
          >
            Management Portal
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-green-50 rounded-full blur-3xl -z-10 opacity-60" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl -z-10 opacity-40" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-[#006442] text-sm font-bold mb-8 border border-green-100">
              <Star className="h-4 w-4 fill-[#006442]" />
              <span>Premium Healthy Meal Subscription</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-slate-900 mb-8 leading-[0.9]">
              Home-Cooked <br />
              <span className="text-[#006442]">Goodness</span>, <br />
              Nutritionist <span className="text-[#006442]">Perfected</span>.
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 mb-10 leading-relaxed font-medium">
              ZyaeL NutriBox brings you chef-prepared, nutritionist-designed meals that fuel your body and delight your taste buds. Delivered fresh to your door.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg"
                className="w-full sm:w-auto h-16 px-10 text-lg font-bold bg-[#006442] hover:bg-[#004d33] rounded-2xl shadow-2xl shadow-green-900/20 transition-all hover:-translate-y-1"
                onClick={() => setLocation("/login")}
              >
                Access Portal Now <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <div className="flex items-center gap-4 px-6 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold overflow-hidden">
                      <Users className="h-4 w-4 text-slate-400" />
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900">Joined by 1,000+</p>
                  <p className="text-[10px] text-slate-400">Happy Customers</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-[#006442]/5 border-y border-[#006442]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Daily Meals", value: "2.5k+" },
              { label: "Nutritionists", value: "15+" },
              { label: "Cloud Kitchens", value: "8" },
              { label: "User Rating", value: "4.9/5" }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-3xl md:text-4xl font-black text-[#006442] mb-1">{stat.value}</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-sm font-black text-[#006442] uppercase tracking-[0.2em] mb-4">Why Choose Us</h2>
            <p className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">The NutriBox Advantage</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className="p-8 bg-slate-50 rounded-3xl border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50"
              >
                <div className={`p-4 rounded-2xl w-fit mb-6 ${feature.color}`}>
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-sm font-black text-[#006442] uppercase tracking-[0.2em] mb-4">Success Stories</h2>
              <p className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-8">Loved by Health Conscious Professionals.</p>
              <div className="space-y-4">
                {["Chef Prepared", "Eco-friendly Packaging", "Easy Subscription Management", "24/7 Support"].map((item, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + (idx * 0.1) }}
                    className="flex items-center gap-3 font-bold text-slate-700"
                  >
                    <CheckCircle2 className="h-6 w-6 text-[#006442]" />
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <div className="grid grid-cols-1 gap-6">
              {testimonials.map((t, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: idx * 0.2 }}
                  className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100"
                >
                  <div className="flex gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xl font-medium text-slate-800 mb-8 italic">"{t.content}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#006442] flex items-center justify-center text-white font-bold">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{t.name}</p>
                      <p className="text-sm text-slate-500 font-medium">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-[#006442] rounded-[48px] p-8 md:p-20 text-center relative overflow-hidden shadow-3xl shadow-green-900/40"
          >

            {/* Decorations */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-green-400/20 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8">Ready to start your <br />healthy journey?</h2>
              <p className="text-green-100 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto">
                Join thousands of others who have simplified their nutrition with ZyaeL NutriBox. 
                Experience the best in home-cooked goodness.
              </p>
              <Button 
                size="lg"
                className="h-16 px-12 text-lg font-bold bg-white text-[#006442] hover:bg-green-50 rounded-2xl transition-all hover:scale-105"
                onClick={() => setLocation("/login")}
              >
                Access Portal Now
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="bg-[#006442] p-1.5 rounded-lg">
                <Utensils className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter text-[#006442]">ZyaeL <span className="text-slate-800">NutriBox</span></span>
            </div>
            <p className="text-slate-400 font-medium">© 2026 ZyaeL NutriBox. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <ShieldCheck className="h-6 w-6 text-slate-300" />
              <Heart className="h-6 w-6 text-slate-300" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
