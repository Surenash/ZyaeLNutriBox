import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Heart, Utensils, Users, Search, MapPin, MessageSquare, ArrowRight, Star, 
  Home, ShoppingCart, ShoppingBag, Truck, User, ChevronLeft, ChevronRight, X, CheckCircle
} from 'lucide-react';

export function LandingPage2() {
  const [activeTab, setActiveTab] = useState("home");
  const [activeHero, setActiveHero] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const navigate = useNavigate();

  // --- DYNAMIC STATE VARIABLES ---
  const [mealPlans, setMealPlans] = useState<any[]>([]);
  const [nutritionists, setNutritionists] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [newsArticles, setNewsArticles] = useState<any[]>([]);
  const [highestRatedPlan, setHighestRatedPlan] = useState<any>(null);

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8080";

  // --- DEFAULT FALLBACK IMAGE ---
  const defaultFallbackImage = "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2653&auto=format&fit=crop";

  // --- FETCH DYNAMIC DATA FROM FASTAPI ---
  useEffect(() => {
    const fetchDynamicData = async () => {
      try {
        // 1. Fetch Meal Plans dynamically from backend
        const plansRes = await fetch(`${API_BASE_URL}/api/mealplans`);
        if (plansRes.ok) {
          const plansData = await plansRes.json();
          
          const plansWithRatings = await Promise.all(plansData.map(async (plan: any) => {
            let rating = 5.0;
            let reviewCount = 0;

            // Fetch actual reviews for this specific plan to get real averages
            try {
              const reviewRes = await fetch(`${API_BASE_URL}/api/reviews/plan/${plan.id}`);
              if (reviewRes.ok) {
                const reviews = await reviewRes.json();
                reviewCount = reviews.length;
                if (reviewCount > 0) {
                  rating = Number((reviews.reduce((acc: number, curr: any) => acc + curr.rating, 0) / reviewCount).toFixed(1));
                }
              }
            } catch (e) { console.error("Error fetching reviews for plan", plan.id) }

            return {
              id: plan.id,
              title: plan.name,
              description: plan.description,
              currentPrice: plan.monthlyPrice,
              originalPrice: Math.round(plan.monthlyPrice * 1.2), // Simple 20% markup for UI
              rating: rating,
              reviewCount: reviewCount,
              // USE DYNAMIC DB IMAGE FIRST, FALLBACK IF EMPTY
              image: plan.imageUrl || defaultFallbackImage 
            };
          }));

          setMealPlans(plansWithRatings);

          if (plansWithRatings.length > 0) {
            const highest = [...plansWithRatings].sort((a, b) => b.rating - a.rating)[0];
            setHighestRatedPlan(highest);
          }
        }

        // 2. Fetch Approved Nutritionists
        const nutrisRes = await fetch(`${API_BASE_URL}/api/admin/nutritionist_profiles?user_id=ADMN-SYSTEM`);
        if (nutrisRes.ok) {
          const nutrisData = await nutrisRes.json();
          const approved = (nutrisData.data || []).filter((doc: any) => doc.isApproved);
          setNutritionists(approved.map((doc: any) => ({
            id: doc.userId,
            name: doc.fullName,
            specialization: doc.specialty || "Clinical Nutritionist",
            image: doc.profilePictureUrl || "https://images.unsplash.com/photo-1612349316228-5942a9b489c2?q=80&w=2670&auto=format&fit=crop"
          })));
        }

        // 3. Fetch Recent Customer Reviews
        const testimonialsRes = await fetch(`${API_BASE_URL}/api/reviews/recent?limit=10`);
        if (testimonialsRes.ok) {
          const tData = await testimonialsRes.json();
          setTestimonials(tData.map((r: any) => ({
            id: r.id,
            name: r.customerName,
            role: `Subscribed to ${r.planName}`,
            testimonial: r.reviewText,
            image: r.customerProfilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.customerName)}&background=006442&color=fff`
          })));
        }

        // 4. Fetch Recent News Articles
        const articlesRes = await fetch(`${API_BASE_URL}/api/articles/?limit=4`);
        if (articlesRes.ok) {
          const aData = await articlesRes.json();
          setNewsArticles(aData.map((a: any) => ({
            id: a.id,
            title: a.headline,
            description: a.content.substring(0, 120) + "...",
            image: a.imageUrl || defaultFallbackImage
          })));
        }

      } catch (error) {
        console.error("Failed to load dynamic data:", error);
      }
    };

    fetchDynamicData();
  }, [API_BASE_URL]);

  const heroSlides = [
    {
      id: 1,
      title: "Personalized Nutrition for Every Goal",
      subtitle: "Every meal is thoughtfully crafted by expert nutritionists, inspired by the warmth of a mother's kitchen",
      ctaText: "Start Today",
      backgroundImage: "https://images.unsplash.com/photo-1543362906-acfc16c67564?q=80&w=2670&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Track. Eat. Transform. Your Health Journey Starts Here.",
      subtitle: "Join 10,000+ happy customers who achieved their health goals with us",
      ctaText: "Get Started",
      backgroundImage: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2653&auto=format&fit=crop",
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHero((prev) => (prev + 1) % heroSlides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const viewportConfig = { once: true, margin: "-100px" };

  // --- ONERROR HANDLER FOR BROKEN LINKS ---
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = defaultFallbackImage;
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden font-sans pb-20">
      {/* Premium Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab("home")}>
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
            <button 
              onClick={() => navigate("/login")}
              className="text-[#006442] font-black uppercase tracking-widest text-[10px] md:text-xs h-9 md:h-12 px-3 md:px-6 hover:bg-green-50 rounded-full transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate("/signup")}
              className="bg-[#006442] hover:bg-[#004d33] text-white rounded-full px-4 md:px-8 h-9 md:h-12 font-black uppercase tracking-widest text-[10px] md:text-xs shadow-xl shadow-green-900/20 transition-all hover:scale-105 active:scale-95"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-16 md:pt-20">
        {activeTab === "home" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
            
            {/* HERO SLIDER */}
            <section className="w-full mb-8 md:mb-16">
              <div className="w-full h-[300px] md:h-[650px] overflow-hidden relative group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeHero}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0"
                  >
                    <img src={heroSlides[activeHero].backgroundImage} alt="Hero" className="w-full h-full object-cover transition-transform duration-[10s] scale-100 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent flex items-center">
                      <div className="max-w-7xl mx-auto px-4 w-full">
                        <div className="max-w-2xl text-white">
                          <motion.h1 
                              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                              className="text-4xl md:text-7xl font-black tracking-tight mb-4 md:mb-6 leading-[1.1]"
                          >
                            {heroSlides[activeHero].title}
                          </motion.h1>
                          <motion.p 
                              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                              className="text-lg md:text-2xl font-medium text-slate-200 mb-8 md:mb-10 leading-relaxed"
                          >
                            {heroSlides[activeHero].subtitle}
                          </motion.p>
                          <motion.button 
                              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                              onClick={() => navigate("/signup")}
                              className="bg-[#006442] hover:bg-[#004d33] text-white h-12 md:h-16 px-8 md:px-10 rounded-full font-black uppercase tracking-widest text-xs md:text-sm shadow-xl shadow-green-900/30 transition-all hover:scale-105"
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

            {/* DYNAMIC MEAL PLANS SECTION */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 md:space-y-24 mt-12 md:mt-24">
              <section id="plans">
                <div className="flex items-end justify-between mb-8">
                  <div>
                    <h2 className="text-sm font-black text-[#006442] uppercase tracking-[0.2em] mb-2">Our Plans</h2>
                    <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Health Goals</h3>
                  </div>
                </div>
                
                {mealPlans.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {mealPlans.map((plan) => (
                      <motion.div key={plan.id} viewport={viewportConfig} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="bg-white rounded-[24px] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-green-900/10 transition-all group flex flex-col">
                        <div className="aspect-[4/3] overflow-hidden relative">
                          {/* DYNAMIC IMAGE WITH ONERROR FALLBACK */}
                          <img src={plan.image} alt={plan.title} onError={handleImageError} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 text-sm font-bold text-slate-900 shadow-lg">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> {plan.rating} ({plan.reviewCount})
                          </div>
                        </div>
                        <div className="p-6 md:p-8 flex-1 flex flex-col">
                          <h4 className="text-xl font-black text-slate-900 mb-2">{plan.title}</h4>
                          <p className="text-slate-500 font-medium mb-6 leading-relaxed flex-1">{plan.description}</p>
                          <div className="flex items-center justify-between mb-6">
                            <div>
                              <span className="text-slate-400 line-through text-sm font-bold mr-2">₹{plan.originalPrice}</span>
                              <span className="text-2xl font-black text-[#006442]">₹{plan.currentPrice}</span>
                              <span className="text-slate-500 text-sm font-semibold block">per month</span>
                            </div>
                          </div>
                          <button onClick={() => setSelectedPlan(plan)} className="w-full py-3 rounded-xl border-2 border-[#006442] text-[#006442] hover:bg-[#006442] hover:text-white font-black uppercase text-xs tracking-widest transition-all">View Details</button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-[32px]">
                    <p className="text-slate-500 font-bold">Loading available meal plans from database...</p>
                  </div>
                )}
              </section>

              {/* DYNAMIC NUTRITIONISTS SECTION */}
              <section id="experts">
                <div className="flex items-end justify-between mb-8">
                  <div>
                    <h2 className="text-sm font-black text-[#006442] uppercase tracking-[0.2em] mb-2">Expert Care</h2>
                    <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Our Nutritionists</h3>
                  </div>
                </div>
                
                {nutritionists.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {nutritionists.map((nutri) => (
                      <motion.div key={nutri.id} viewport={viewportConfig} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="bg-slate-50 rounded-[24px] p-6 text-center border border-slate-100 hover:shadow-xl transition-shadow relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#006442]/5 to-transparent" />
                        <img src={nutri.image} alt={nutri.name} onError={handleImageError} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-lg relative z-10 group-hover:scale-105 transition-transform" />
                        <h4 className="text-xl font-black text-slate-900 mb-1">{nutri.name}</h4>
                        <p className="text-[#006442] font-black uppercase text-[10px] tracking-widest mb-6">{nutri.specialization}</p>
                        <button onClick={() => navigate("/signup")} className="w-full py-3 rounded-xl bg-white border border-slate-200 text-slate-900 font-black uppercase text-[10px] tracking-widest hover:border-[#006442] hover:text-[#006442] transition-colors shadow-sm">Book Consult</button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-[32px]">
                    <p className="text-slate-500 font-bold">Connecting to our network of verified nutritionists...</p>
                  </div>
                )}
              </section>
            </div>

            {/* ROTATING TICKER BANNER */}
            <div className="w-full bg-[#006442] text-white overflow-hidden py-3 md:py-4 mt-12 md:mt-16">
              <div className="flex whitespace-nowrap animate-ticker">
                <div className="flex gap-16 md:gap-32 px-8 shrink-0">
                  <span className="font-black uppercase tracking-widest text-sm md:text-base">✨ Join 10,000+ Happy Customers!</span>
                  <span className="font-black uppercase tracking-widest text-sm md:text-base">🚚 Zyael NutriBox — Delivered Fresh Daily</span>
                  <span className="font-black uppercase tracking-widest text-sm md:text-base">💰 Save ₹3,000 on 90-Day Plans!</span>
                  <span className="font-black uppercase tracking-widest text-sm md:text-base">🎁 Get 20% off your first month!</span>
                </div>
                <div className="flex gap-16 md:gap-32 px-8 shrink-0">
                  <span className="font-black uppercase tracking-widest text-sm md:text-base">✨ Join 10,000+ Happy Customers!</span>
                  <span className="font-black uppercase tracking-widest text-sm md:text-base">🚚 Zyael NutriBox — Delivered Fresh Daily</span>
                  <span className="font-black uppercase tracking-widest text-sm md:text-base">💰 Save ₹3,000 on 90-Day Plans!</span>
                  <span className="font-black uppercase tracking-widest text-sm md:text-base">🎁 Get 20% off your first month!</span>
                </div>
              </div>
            </div>

            {/* DYNAMIC STORY SECTION (Heritage) */}
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
                    <button onClick={() => navigate("/signup")} className="mt-8 md:mt-12 bg-white text-green-900 hover:bg-green-50 h-12 md:h-16 px-6 md:px-10 rounded-2xl font-black uppercase tracking-widest text-xs md:text-sm shadow-2xl transition-all hover:scale-105">
                      Join the Family
                    </button>
                  </motion.div>
                  
                  <div className="relative">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={viewportConfig} className="aspect-square rounded-[32px] md:rounded-[64px] overflow-hidden shadow-2xl relative group">
                      <img 
                        src={highestRatedPlan ? highestRatedPlan.image : defaultFallbackImage} 
                        alt="Highest Rated Plan" 
                        onError={handleImageError}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 via-transparent to-transparent opacity-60" />
                      <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 p-4 md:p-8 bg-white/10 backdrop-blur-md rounded-2xl md:rounded-3xl border border-white/20">
                        <Heart className="h-6 w-6 md:h-8 md:w-8 text-green-400 mb-2 md:mb-4" />
                        <p className="text-lg md:text-xl font-bold leading-tight italic text-white">"Every box we deliver is a promise of health and a hug from home."</p>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={viewportConfig}
                      transition={{ delay: 0.5 }}
                      className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 bg-white p-4 md:p-8 rounded-2xl md:rounded-[32px] shadow-2xl text-slate-900 hidden sm:block"
                    >
                      <p className="text-2xl md:text-4xl font-black text-green-600 mb-1">{highestRatedPlan ? highestRatedPlan.rating : "4.9"}/5</p>
                      <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400">Customer Rating</p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </section>

            {/* DYNAMIC REVIEWS SECTION */}
            <section id="testimonials" className="py-12 md:py-24 bg-white overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8 md:mb-16">
                  <h2 className="text-xs md:text-sm font-black text-[#006442] uppercase tracking-[0.2em] mb-2 md:mb-4">Customer Love</h2>
                  <p className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Hear What Our Customers Say</p>
                </div>
              </div>
              
              {testimonials.length > 0 ? (
                <div className="flex animate-marquee-reverse hover:[animation-play-state:paused]">
                  <div className="flex gap-6 md:gap-10 px-4 md:px-5 shrink-0">
                    {testimonials.map((testimonial) => (
                      <div key={testimonial.id} className="w-[300px] md:w-[450px] shrink-0 bg-slate-50 rounded-3xl p-8 md:p-10 border border-slate-100 hover:shadow-xl transition-shadow relative">
                        <Star className="absolute top-8 right-8 w-8 h-8 text-yellow-400 fill-yellow-400 opacity-20" />
                        <div className="flex items-center gap-4 mb-6">
                          <img src={testimonial.image} alt={testimonial.name} onError={handleImageError} className="w-16 h-16 rounded-full object-cover shadow-md" />
                          <div>
                            <h4 className="font-bold text-slate-900 truncate max-w-[200px]">{testimonial.name}</h4>
                            <span className="text-sm font-semibold text-slate-500">{testimonial.role}</span>
                          </div>
                        </div>
                        <p className="text-slate-600 font-medium leading-relaxed">"{testimonial.testimonial}"</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-6 md:gap-10 px-4 md:px-5 shrink-0" aria-hidden="true">
                    {testimonials.map((testimonial) => (
                      <div key={`${testimonial.id}-dup`} className="w-[300px] md:w-[450px] shrink-0 bg-slate-50 rounded-3xl p-8 md:p-10 border border-slate-100 hover:shadow-xl transition-shadow relative">
                        <Star className="absolute top-8 right-8 w-8 h-8 text-yellow-400 fill-yellow-400 opacity-20" />
                        <div className="flex items-center gap-4 mb-6">
                          <img src={testimonial.image} alt={testimonial.name} onError={handleImageError} className="w-16 h-16 rounded-full object-cover shadow-md" />
                          <div>
                            <h4 className="font-bold text-slate-900 truncate max-w-[200px]">{testimonial.name}</h4>
                            <span className="text-sm font-semibold text-slate-500">{testimonial.role}</span>
                          </div>
                        </div>
                        <p className="text-slate-600 font-medium leading-relaxed">"{testimonial.testimonial}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="max-w-7xl mx-auto px-4 py-10 text-center border-2 border-dashed border-slate-200 rounded-[32px]">
                   <p className="text-slate-500 font-bold">No reviews yet. Be the first to try our plans!</p>
                </div>
              )}
            </section>

            {/* DYNAMIC NEWS ABOUT NUTRITION SECTION */}
            <section id="news" className="py-12 md:py-24 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8 md:mb-16">
                  <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-2 md:mb-4 tracking-tight">News About Nutrition</h2>
                </div>
                
                {newsArticles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {newsArticles.map((article) => (
                      <motion.div key={article.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewportConfig} className="bg-white rounded-2xl md:rounded-[32px] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/40 h-full group flex flex-col">
                        <div className="aspect-video overflow-hidden">
                          {/* ARTICLE IMAGE WITH ONERROR HANDLER */}
                          <img src={article.image} alt={article.title} onError={handleImageError} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="p-6 md:p-10 flex flex-col items-start flex-1 pb-16">
                          <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-2 md:mb-4">{article.title}</h3>
                          <p className="text-sm md:text-base text-slate-500 mb-6 md:mb-8 font-medium leading-relaxed">{article.description}</p>
                          <button onClick={() => navigate(`/news/${article.id}`)} className="mt-auto px-6 py-2 rounded-full border-2 border-[#006442] text-[#006442] font-black uppercase text-[10px] md:text-xs tracking-widest hover:bg-green-50 transition-colors">Read Article</button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-[32px]">
                    <p className="text-slate-500 font-bold">Media team is currently brewing some fresh articles...</p>
                  </div>
                )}
                
                <div className="mt-12 text-center flex justify-center">
                  <button onClick={() => navigate("/news")} className="bg-[#006442] hover:bg-[#004d33] text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                    View All Articles <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>

            {/* Premium Footer */}
            <footer className="py-12 md:py-20 bg-slate-900 text-white mb-16 md:mb-0">
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
                    <span className="hover:text-green-400 transition-colors cursor-pointer">Privacy</span>
                    <span className="hover:text-green-400 transition-colors cursor-pointer">Terms</span>
                    <Link to="/management" className="hover:text-green-400 transition-colors cursor-pointer text-white underline underline-offset-4 decoration-slate-500 hover:decoration-green-400">Portal</Link>
                  </div>
                </div>
              </div>
            </footer>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 py-3 pb-5 flex justify-evenly items-center z-50">
              <Link to="/" className="flex flex-col items-center gap-1 text-[#006442]">
                <Home className="w-6 h-6" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Home</span>
              </Link>
              <Link to="/login" className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#006442] transition-colors">
                <ShoppingCart className="w-6 h-6" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Cart</span>
              </Link>
              <Link to="/login" className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#006442] transition-colors">
                <ShoppingBag className="w-6 h-6" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Orders</span>
              </Link>
              <Link to="/login" className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#006442] transition-colors">
                <Truck className="w-6 h-6" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Track</span>
              </Link>
              <Link to="/login" className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#006442] transition-colors">
                <User className="w-6 h-6" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Profile</span>
              </Link>
            </div>

            {/* Dynamic Meal Plan Modal */}
            <AnimatePresence>
              {selectedPlan && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }} 
                  className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                  onClick={() => setSelectedPlan(null)}
                >
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                    animate={{ opacity: 1, scale: 1, y: 0 }} 
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
                  >
                    <button 
                      onClick={() => setSelectedPlan(null)}
                      className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 transition-colors backdrop-blur-md"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    
                    <div className="h-64 relative">
                      {/* DYNAMIC IMAGE WITH FALLBACK */}
                      <img src={selectedPlan.image} alt={selectedPlan.title} onError={handleImageError} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <h3 className="text-3xl font-black text-white mb-2">{selectedPlan.title}</h3>
                        <div className="flex items-center gap-3">
                          <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> {selectedPlan.rating} ({selectedPlan.reviewCount})
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-8">
                      <p className="text-slate-600 text-lg mb-8 font-medium leading-relaxed">{selectedPlan.description}</p>
                      
                      <div className="mb-8">
                        <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-4">What's Included</h4>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3">
                            <div className="bg-green-100 p-1 rounded-full mt-0.5"><Utensils className="w-3 h-3 text-green-700" /></div>
                            <span className="text-slate-700 font-medium">3 Daily Meals + 2 Snacks tailored to your goals</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="bg-blue-100 p-1 rounded-full mt-0.5"><User className="w-3 h-3 text-blue-700" /></div>
                            <span className="text-slate-700 font-medium">4 Personal Consultations with a Certified Nutritionist</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-slate-50 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-100">
                        <div>
                          <p className="text-slate-500 font-bold text-sm mb-1 uppercase tracking-widest">Pricing</p>
                          <div className="flex items-end gap-3">
                            <span className="text-4xl font-black text-[#006442]">₹{selectedPlan.currentPrice}</span>
                            <span className="text-slate-400 line-through text-lg font-bold pb-1">₹{selectedPlan.originalPrice}</span>
                          </div>
                          <span className="text-slate-500 text-sm font-semibold">per month</span>
                        </div>
                        <button onClick={() => navigate("/signup")} className="w-full sm:w-auto bg-[#006442] hover:bg-[#004d33] text-white rounded-xl py-4 px-8 font-black uppercase tracking-widest text-xs md:text-sm shadow-xl shadow-green-900/30 transition-transform active:scale-95">
                          Subscribe Now
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </main>
    </div>
  );
}