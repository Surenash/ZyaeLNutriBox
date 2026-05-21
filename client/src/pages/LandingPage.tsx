import { motion } from "framer-motion";
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
  Flame,
  Dumbbell,
  Baby,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";

const healthGoals = [
  {
    title: "Weight Loss",
    description: "Calorie-controlled meals to help you reach your target weight safely.",
    icon: Flame,
    color: "bg-orange-500/10 text-orange-600",
  },
  {
    title: "Muscle Gain",
    description: "High-protein meal plans designed for fitness enthusiasts and athletes.",
    icon: Dumbbell,
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    title: "PCOS Friendly",
    description: "Hormone-balancing nutrition to manage PCOS symptoms effectively.",
    icon: Heart,
    color: "bg-pink-500/10 text-pink-600",
  },
  {
    title: "Postpartum Care",
    description: "Nutrient-dense meals to support recovery and lactation for new moms.",
    icon: Baby,
    color: "bg-purple-500/10 text-purple-600",
  },
];

const testimonials = [
  {
    name: "Meera, Bengaluru",
    role: "Content Writer",
    content: "It felt like therapy through food. Now my mom doesn't just ask if I ate—she says, 'Hope you had your nutrition check too!'",
    avatar: "M"
  },
  {
    name: "Ankit, Bengaluru",
    role: "Tech Professional",
    content: "ZyaeL NutriBox has completely transformed my lunch hours. No more junk food, just healthy, delicious meals!",
    avatar: "A"
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
            <a href="#plans" className="hover:text-[#006442] transition-colors">Meal Plans</a>
            <a href="#features" className="hover:text-[#006442] transition-colors">How it Works</a>
            <a href="#story" className="hover:text-[#006442] transition-colors">Our Story</a>
            <a href="#testimonials" className="hover:text-[#006442] transition-colors">Reviews</a>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost"
              onClick={() => setLocation("/management/client")}
              className="text-[#006442] font-bold"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => setLocation("/management/client")}
              className="bg-[#006442] hover:bg-[#004d33] text-white rounded-full px-6 font-bold shadow-lg shadow-green-900/10 transition-all hover:scale-105"
            >
              Start Eating Healthy
            </Button>
          </div>
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
              <span>Personalized Nutrition for Every Body</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-slate-900 mb-8 leading-[0.9]">
              Home-Cooked <br />
              <span className="text-[#006442]">Goodness</span>, <br />
              Nutritionist <span className="text-[#006442]">Perfected</span>.
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 mb-10 leading-relaxed font-medium">
              Every meal is thoughtfully crafted by expert nutritionists, inspired by the warmth of a mother's kitchen. Healthy meal delivery in Bengaluru.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg"
                className="w-full sm:w-auto h-16 px-10 text-lg font-bold bg-[#006442] hover:bg-[#004d33] rounded-2xl shadow-2xl shadow-green-900/20 transition-all hover:-translate-y-1"
                onClick={() => setLocation("/management/client")}
              >
                Choose Your Plan <ChevronRight className="ml-2 h-5 w-5" />
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
                  <p className="text-xs font-bold text-slate-900">Loved by 1,000+</p>
                  <p className="text-[10px] text-slate-400">Bengaluru Residents</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Health Goals Section */}
      <section id="plans" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-sm font-black text-[#006442] uppercase tracking-[0.2em] mb-4">Targeted Nutrition</h2>
            <p className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Meal Plans for Your Goals</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {healthGoals.map((goal, idx) => (
              <motion.div 
                key={goal.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className="p-8 bg-white rounded-3xl border border-slate-100 transition-all hover:shadow-xl hover:shadow-slate-200/50"
              >
                <div className={`p-4 rounded-2xl w-fit mb-6 ${goal.color}`}>
                  <goal.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{goal.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed mb-6">{goal.description}</p>
                <Button variant="outline" className="w-full rounded-xl border-[#006442] text-[#006442] hover:bg-green-50">
                  Explore Plan
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-sm font-black text-[#006442] uppercase tracking-[0.2em] mb-4">The Process</h2>
            <p className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">How ZyaeL NutriBox Works</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
             <div className="absolute top-1/2 left-0 w-full h-0.5 bg-green-50 -translate-y-1/2 hidden md:block -z-10" />
             {[
               { title: "Consult", desc: "Speak with our clinical nutritionists to define your health goals.", icon: Stethoscope },
               { title: "Cook", desc: "Our chefs prepare your meals in certified cloud kitchens.", icon: ChefHat },
               { title: "Consume", desc: "Enjoy fresh, healthy meals delivered to your doorstep.", icon: Utensils },
             ].map((step, idx) => (
               <motion.div 
                 key={step.title}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: idx * 0.2 }}
                 className="flex flex-col items-center text-center group"
               >
                 <div className="w-20 h-20 rounded-full bg-white border-4 border-green-50 flex items-center justify-center mb-6 group-hover:border-[#006442] transition-colors shadow-xl shadow-green-900/5 relative z-10">
                   <step.icon className="h-8 w-8 text-[#006442]" />
                   <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#006442] text-white text-xs font-black flex items-center justify-center border-4 border-white">
                     {idx + 1}
                   </div>
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                 <p className="text-slate-500 font-medium text-sm px-4">{step.desc}</p>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section id="story" className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-green-100/50 rounded-full blur-3xl -z-10" />
              <h2 className="text-sm font-black text-[#006442] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Heart className="h-4 w-4 fill-[#006442]" />
                Our Story
              </h2>
              <p className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-8">Inspired by Mom, <br /><span className="text-[#006442]">Perfected by Science.</span></p>
              <div className="space-y-6 text-lg text-slate-600 font-medium leading-relaxed">
                <p>There was a time when every morning began with a familiar voice— "Beta, did you eat your breakfast?" That voice was our first nutritionist—our mothers.</p>
                <p>Their love didn't just fill our stomachs; it nourished our hearts. We missed those meals. But more than that, we missed the love that came with them.</p>
                <p className="text-slate-900 font-bold">ZyaeL NutriBox brings that home-cooked goodness back, with the precision of clinical nutrition.</p>
              </div>
              <Button 
                variant="outline"
                className="mt-10 rounded-full border-2 border-[#006442] text-[#006442] font-bold h-14 px-8"
              >
                Read Our Full Story
              </Button>
            </motion.div>
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="aspect-[3/4] rounded-3xl bg-white shadow-xl overflow-hidden relative group border border-slate-100"
              >
                <div className="w-full h-full bg-green-50 flex items-center justify-center">
                  <Heart className="h-16 w-16 text-[#006442]/20" />
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="aspect-[3/4] rounded-3xl bg-white shadow-xl overflow-hidden mt-12 relative group border border-slate-100"
              >
                <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                  <Stethoscope className="h-16 w-16 text-[#006442]/20" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-black text-[#006442] uppercase tracking-[0.2em] mb-4">What Our Clients Say</h2>
            <p className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Real Results, Real People</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, idx) => (
              <motion.div 
                key={t.name} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.2 }}
                className="p-8 bg-slate-50 rounded-3xl border border-slate-100"
              >
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-xl font-medium text-slate-800 mb-8 italic leading-relaxed">"{t.content}"</p>
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
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-[#006442] rounded-[48px] p-8 md:p-20 text-center relative overflow-hidden shadow-3xl shadow-green-900/40"
          >
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-green-400/20 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8">Ready to transform <br />your health?</h2>
              <p className="text-green-100 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto">
                Join ZyaeL NutriBox today and experience the future of personalized nutrition.
              </p>
              <Button 
                size="lg"
                className="h-16 px-12 text-lg font-bold bg-white text-[#006442] hover:bg-green-50 rounded-2xl transition-all hover:scale-105"
                onClick={() => setLocation("/management/client")}
              >
                Get Started Now
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="bg-[#006442] p-1.5 rounded-lg">
                <Utensils className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter text-[#006442]">ZyaeL <span className="text-slate-800">NutriBox</span></span>
            </div>
            <p className="text-slate-400 font-medium text-sm">© 2026 ZyaeL NutriBox. Healthy meal delivery in Bengaluru.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-slate-400 hover:text-[#006442] transition-colors font-bold text-xs uppercase tracking-widest">Privacy</a>
              <a href="#" className="text-slate-400 hover:text-[#006442] transition-colors font-bold text-xs uppercase tracking-widest">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
