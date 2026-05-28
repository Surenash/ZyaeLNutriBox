import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Utensils, 
  MapPin,
  Search,
  Star,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Award,
  Users
} from 'lucide-react';

export function LandingPage() {
  const [currentLocation, setCurrentLocation] = useState("Bengaluru, Karnataka");
  const navigate = useNavigate();

  const [activeHero, setActiveHero] = useState(0);
  const heroSlides = [
    {
      title: "Personalized Nutrition for Every Goal",
      subtitle: "Every meal is thoughtfully crafted by expert nutritionists, inspired by the warmth of a mother's kitchen",
      ctaText: "Start Today",
      backgroundImage: "https://images.unsplash.com/photo-1543362906-acfc16c67564?q=80&w=2670&auto=format&fit=crop",
    },
    {
      title: "Track. Eat. Transform. Your Health Journey Starts Here.",
      subtitle: "Join 10,000+ happy customers who achieved their health goals with us",
      ctaText: "Get Started",
      backgroundImage: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2653&auto=format&fit=crop",
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHero((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const mealPlans = [
    {
      title: "Weight Loss",
      description: "Calorie-deficit meals tailored for effective weight loss",
      originalPrice: 15000,
      currentPrice: 12000,
      rating: 4.8,
      reviewCount: 324,
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2670&auto=format&fit=crop"
    },
    {
      title: "Muscle Gain",
      description: "High-protein nutrition plans to support muscle building",
      originalPrice: 18000,
      currentPrice: 14500,
      rating: 4.9,
      reviewCount: 215,
      image: "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=2670&auto=format&fit=crop"
    },
    {
      title: "Balanced Nutrition",
      description: "Healthy daily meals for maintaining overall wellbeing",
      originalPrice: 14000,
      currentPrice: 11000,
      rating: 4.7,
      reviewCount: 189,
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2653&auto=format&fit=crop"
    }
  ];

  const nutritionists = [
    {
      name: "Dr. Priya Sharma",
      specialization: "Clinical Nutritionist",
      experience: "15 years experience",
      image: "https://i.pravatar.cc/150?img=47"
    },
    {
      name: "Rahul Menon",
      specialization: "Sports Nutrition",
      experience: "12 years experience",
      image: "https://i.pravatar.cc/150?img=11"
    },
    {
      name: "Ananya Patel",
      specialization: "PCOS & Women's Health",
      experience: "10 years experience",
      image: "https://i.pravatar.cc/150?img=33"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden font-sans pb-20">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
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
            <button onClick={() => navigate("/management")} className="text-[#006442] font-black uppercase tracking-widest text-[10px] md:text-xs h-9 md:h-12 px-3 md:px-6 hover:bg-green-50 rounded-full transition-colors">
              Sign In
            </button>
            <button onClick={() => navigate("/signup")} className="bg-[#006442] hover:bg-[#004d33] text-white rounded-full px-4 md:px-8 h-9 md:h-12 font-black uppercase tracking-widest text-[10px] md:text-xs shadow-xl shadow-green-900/20 transition-all hover:scale-105 active:scale-95">
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-16 md:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 md:pt-4">
           {/* Location Search Bar */}
           <div className="flex flex-col md:flex-row gap-4 mb-4">
             <div className="relative flex-1 max-w-sm">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
               <input className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006442] transition-all" placeholder="Search meals, experts..." />
             </div>
             <div className="relative max-w-xs flex-1">
               <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600" />
               <input value={currentLocation} onChange={(e) => setCurrentLocation(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-emerald-50 border border-emerald-100 rounded-lg text-sm text-emerald-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#006442] transition-all" placeholder="Delivery Location" />
             </div>
           </div>
        </div>

        {/* Hero Slider */}
        <section className="w-full mb-8 md:mb-16">
          <div className="w-full h-[300px] md:h-[600px] overflow-hidden relative group">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeHero}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
              >
                <img src={heroSlides[activeHero].backgroundImage} alt="Hero" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent flex items-center">
                  <div className="max-w-7xl mx-auto px-4 w-full">
                    <div className="max-w-2xl text-white">
                      <motion.h1 
                          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                          className="text-4xl md:text-6xl font-black tracking-tight mb-4 md:mb-6 leading-[1.1]"
                      >
                        {heroSlides[activeHero].title}
                      </motion.h1>
                      <motion.p 
                          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                          className="text-lg md:text-xl font-medium text-slate-200 mb-8 md:mb-10 leading-relaxed"
                      >
                        {heroSlides[activeHero].subtitle}
                      </motion.p>
                      <motion.button 
                          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                          onClick={() => navigate("/signup")}
                          className="bg-[#006442] hover:bg-[#004d33] text-white h-12 md:h-14 px-8 md:px-10 rounded-full font-black uppercase tracking-widest text-xs md:text-sm shadow-xl shadow-green-900/30 transition-all hover:scale-105"
                      >
                        {heroSlides[activeHero].ctaText}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {heroSlides.map((_, idx) => (
                <button key={idx} onClick={() => setActiveHero(idx)} className={`w-2 h-2 rounded-full transition-all ${activeHero === idx ? 'bg-white w-6' : 'bg-white/50'}`} />
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 md:space-y-24">
          
          {/* Health Goals (Plans) */}
          <section id="plans">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-sm font-black text-[#006442] uppercase tracking-[0.2em] mb-2">Our Plans</h2>
                <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Health Goals</h3>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {mealPlans.map((plan) => (
                <div key={plan.title} className="bg-white rounded-[24px] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-green-900/10 transition-all group">
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img src={plan.image} alt={plan.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 text-sm font-bold text-slate-900 shadow-lg">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> {plan.rating} ({plan.reviewCount})
                    </div>
                  </div>
                  <div className="p-6 md:p-8">
                    <h4 className="text-xl md:text-2xl font-black text-slate-900 mb-2">{plan.title}</h4>
                    <p className="text-slate-500 font-medium mb-6 leading-relaxed min-h-[48px]">{plan.description}</p>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <span className="text-slate-400 line-through text-sm font-bold mr-2">₹{plan.originalPrice}</span>
                        <span className="text-2xl font-black text-[#006442]">₹{plan.currentPrice}</span>
                        <span className="text-slate-500 text-sm font-semibold block">per month</span>
                      </div>
                    </div>
                    <button onClick={() => navigate("/signup")} className="w-full py-3 md:py-4 rounded-xl border-2 border-[#006442] text-[#006442] hover:bg-[#006442] hover:text-white font-black uppercase text-xs tracking-widest transition-all">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Nutritionists Slider */}
          <section id="experts">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-sm font-black text-[#006442] uppercase tracking-[0.2em] mb-2">Expert Care</h2>
                <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Our Nutritionists</h3>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {nutritionists.map((nutri) => (
                <div key={nutri.name} className="bg-slate-50 rounded-[24px] p-6 text-center border border-slate-100 hover:shadow-xl transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#006442]/5 to-transparent" />
                  <img src={nutri.image} alt={nutri.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-lg relative z-10 group-hover:scale-105 transition-transform" />
                  <h4 className="text-xl font-black text-slate-900 mb-1">{nutri.name}</h4>
                  <p className="text-[#006442] font-black uppercase text-[10px] tracking-widest mb-2">{nutri.specialization}</p>
                  <p className="text-slate-500 font-medium text-sm mb-6">{nutri.experience}</p>
                  <button onClick={() => navigate("/signup")} className="w-full py-3 rounded-xl bg-white border border-slate-200 text-slate-900 font-black uppercase text-[10px] tracking-widest hover:border-[#006442] hover:text-[#006442] transition-colors shadow-sm">Book Consult</button>
                </div>
              ))}
            </div>
          </section>

          {/* Promotional Banner */}
          <section>
            <div className="bg-gradient-to-r from-[#004d33] to-[#006442] rounded-[32px] overflow-hidden shadow-2xl relative">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2653&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay" />
              <div className="relative p-8 md:p-16 flex flex-col md:flex-row items-center justify-between z-10 gap-8">
                <div className="max-w-2xl text-center md:text-left">
                  <h2 className="text-sm font-black text-green-300 uppercase tracking-[0.2em] mb-4 flex items-center justify-center md:justify-start gap-2"><Award className="w-4 h-4" /> Special Offer</h2>
                  <h3 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 tracking-tight">Get 20% off your first month!</h3>
                  <p className="text-green-100 font-medium text-lg mb-8">Start your personalized health journey today and experience the difference of clinical nutrition combined with home-cooked comfort.</p>
                  <button onClick={() => navigate("/signup")} className="bg-white text-green-900 h-12 md:h-14 px-8 rounded-full font-black uppercase tracking-widest text-xs shadow-xl transition-all hover:scale-105">Claim Offer</button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Heritage Section (The Green Part) */}
        <section id="story" className="py-12 md:py-24 bg-green-900 text-white relative overflow-hidden mt-16 md:mt-24">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-center">
              <div>
                <h2 className="text-xs md:text-sm font-black text-green-400 uppercase tracking-[0.3em] mb-4 md:mb-8 flex items-center gap-3">
                  <Heart className="h-4 w-4 fill-green-400" />
                  Our Heritage
                </h2>
                <p className="text-3xl md:text-6xl font-black mb-6 md:mb-10 tracking-tight leading-[0.9]">Inspired by Mom, <br /><span className="text-green-400">Refined by Science.</span></p>
                <div className="space-y-4 md:space-y-6 text-lg text-green-100/80 font-medium leading-relaxed">
                  <p>There was a time when every morning began with a familiar voice— "Beta, did you eat your breakfast?" That voice was our first nutritionist—our mothers.</p>
                  <p>Their love nourished our hearts. ZyaeL NutriBox brings that home-cooked goodness back with modern clinical precision.</p>
                </div>
                <button onClick={() => navigate("/signup")} className="mt-8 md:mt-12 bg-white text-green-900 hover:bg-green-50 h-12 md:h-14 px-6 md:px-10 rounded-full font-black uppercase tracking-widest text-xs shadow-2xl transition-all hover:scale-105">
                  Join the Family
                </button>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-[32px] md:rounded-[48px] overflow-hidden shadow-2xl relative group bg-white">
                  <img src="https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=2670&auto=format&fit=crop" alt="Our Heritage" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 p-4 md:p-8 bg-white/10 backdrop-blur-md rounded-2xl md:rounded-3xl border border-white/20">
                    <Heart className="h-6 w-6 md:h-8 md:w-8 text-green-400 mb-2 md:mb-4" />
                    <p className="text-lg md:text-xl font-bold leading-tight italic text-white pr-4">"Every box we deliver is a promise of health and a hug from home."</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10 md:py-16 bg-slate-900 text-white border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="bg-green-600 p-1.5 md:p-2 rounded-xl">
                  <Utensils className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl md:text-2xl font-black tracking-tighter">ZyaeL <span className="text-green-500">NutriBox</span></span>
              </div>
              <p className="text-slate-500 font-bold text-xs md:text-sm text-center md:text-left">© 2026 ZyaeL NutriBox Bengaluru. All rights reserved.</p>
              <div className="flex gap-4 md:gap-8 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                <Link to="/management" className="text-green-400 transition-colors cursor-pointer">Admin Login</Link>
                <Link to="/signup" className="hover:text-green-400 transition-colors cursor-pointer text-white underline underline-offset-4 decoration-slate-500 hover:decoration-green-400">Get Started</Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
