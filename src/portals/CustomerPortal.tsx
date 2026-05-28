import { useState } from 'react';
import { MapPin, Calendar, Activity, Clock, Plus, Video, Target, TrendingUp, User, Home, ShoppingCart, ShoppingBag, Truck, Download, Droplet, ArrowDown, CreditCard, Bell, Settings, LogOut, Edit2, X, ChevronRight, Star, CheckCircle2, Trash2, FileText, Scale, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

export function CustomerPortal() {
  const [activeTab, setActiveTab] = useState<'cart' | 'orders' | 'track' | 'profile' | 'consults'>('track');

  const handleLogout = () => { window.location.href = '/_logout'; setTimeout(() => window.location.href = '/management', 10); };

  return (
    <div className="flex flex-col h-screen bg-neutral-50 overflow-hidden font-sans">
      <header className="bg-white border-b border-neutral-200 h-16 flex items-center justify-between px-4 md:px-8 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">Z</div>
          <span className="font-bold text-xl tracking-tight text-neutral-900">Customer Space</span>
        </div>
        <button onClick={handleLogout} className="text-sm font-semibold text-neutral-500 hover:text-neutral-900 transition-colors">
          Sign Out
        </button>
      </header>
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-white border-r border-neutral-200 p-4 md:flex flex-col gap-2 overflow-y-auto hidden shrink-0">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 px-3 mt-2">
            Navigation
          </div>
          <Link to="/" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900">
            <div className="w-5 h-5 flex items-center justify-center opacity-80"><Home /></div>
            Home
          </Link>
          <NavItem icon={<ShoppingCart />} label="Your Basket" isActive={activeTab === 'cart'} onClick={() => setActiveTab('cart')} />
          <NavItem icon={<ShoppingBag />} label="My Subscriptions" isActive={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
          <NavItem icon={<Activity />} label="Track Progress" isActive={activeTab === 'track'} onClick={() => setActiveTab('track')} />
          <NavItem icon={<Calendar />} label="Consults" isActive={activeTab === 'consults'} onClick={() => setActiveTab('consults')} />
          <NavItem icon={<User />} label="Profile" isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-32 bg-neutral-50">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {activeTab === 'cart' && <CartView />}
            {activeTab === 'orders' && <OrdersView />}
            {activeTab === 'track' && <TrackView />}
            {activeTab === 'consults' && <ConsultsView />}
            {activeTab === 'profile' && <ProfileView />}
          </motion.div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-neutral-200 py-3 pb-5 flex justify-evenly items-center z-50 shadow-2xl">
        <Link to="/" className="flex flex-col items-center gap-1 text-neutral-400 hover:text-emerald-600 transition-colors">
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Home</span>
        </Link>
        <button onClick={() => setActiveTab('cart')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'cart' ? 'text-emerald-600' : 'text-neutral-400 hover:text-emerald-600'}`}>
          <ShoppingCart className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Cart</span>
        </button>
        <button onClick={() => setActiveTab('orders')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'orders' ? 'text-emerald-600' : 'text-neutral-400 hover:text-emerald-600'}`}>
          <ShoppingBag className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Orders</span>
        </button>
        <button onClick={() => setActiveTab('track')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'track' ? 'text-emerald-600' : 'text-neutral-400 hover:text-emerald-600'}`}>
          <Activity className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Track</span>
        </button>
        <button onClick={() => setActiveTab('consults')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'consults' ? 'text-emerald-600' : 'text-neutral-400 hover:text-emerald-600'}`}>
          <Calendar className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Consults</span>
        </button>
        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'profile' ? 'text-emerald-600' : 'text-neutral-400 hover:text-emerald-600'}`}>
          <User className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Profile</span>
        </button>
      </div>
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
        isActive ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
      }`}
    >
      <div className="w-5 h-5 flex items-center justify-center opacity-80">{icon}</div>
      {label}
    </button>
  );
}

function CartView() {
  const [hasItems, setHasItems] = useState(true);
  
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-black tracking-tighter mb-8 text-neutral-900 uppercase">Your Basket</h2>
      {hasItems ? (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
             <div className="flex gap-4 items-center">
                 <div className="w-20 h-20 bg-neutral-100 rounded-2xl overflow-hidden shrink-0"><img src="https://images.unsplash.com/photo-1543362906-acfc16c67564?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover" /></div>
                 <div>
                    <h3 className="font-bold text-xl text-neutral-900">Weight Loss Plan</h3>
                    <p className="text-neutral-500 font-medium text-sm uppercase tracking-widest text-[10px]">3 Meals/Day • 1 Month Subscription</p>
                 </div>
             </div>
             <div className="flex items-center gap-6 self-end md:self-auto">
                <span className="font-black text-2xl text-emerald-600">₹12,000</span>
                <button onClick={() => setHasItems(false)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors font-black text-[10px] uppercase tracking-widest">Remove</button>
             </div>
          </div>
          <div className="flex justify-end pt-4">
             <button onClick={() => { setHasItems(false); alert("Order successfully placed! You will receive confirmation via email."); }} className="px-12 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-700 transition shadow-xl shadow-emerald-900/20 active:scale-95">Checkout Now</button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-[32px] p-12 text-center shadow-xl">
          <div className="w-24 h-24 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
             <ShoppingCart className="w-10 h-10 text-neutral-300" />
          </div>
          <h3 className="text-2xl font-black mb-2 text-neutral-900">Your basket is empty</h3>
          <p className="text-neutral-500 font-medium mb-8">Ready to start your journey? Explore our nutritionist-perfected plans.</p>
          <Link to="/" className="inline-flex px-8 py-3 bg-[#1A1A1A] text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-neutral-800 transition">Browse Plans</Link>
        </div>
      )}
    </div>
  );
}

function OrdersView() {
  const subscriptions = [
    { id: 'SUB-4921', plan: 'Weight Loss Plan', status: 'active', renewal: 'Oct 15, 2026', price: '₹12,000', image: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?q=80&w=2670&auto=format&fit=crop' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-black tracking-tighter mb-8 text-neutral-900 uppercase">My Subscriptions</h2>
      <div className="space-y-6">
        {subscriptions.map(sub => (
          <div key={sub.id} className="bg-white rounded-[32px] border border-neutral-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
             <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-48 h-48 bg-neutral-100 rounded-2xl overflow-hidden shadow-inner">
                   <img src={sub.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Plan" />
                </div>
                <div className="flex-1 flex flex-col">
                   <div className="flex justify-between items-start mb-2">
                      <div>
                         <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] bg-emerald-50 px-2 py-0.5 rounded mb-2 inline-block">Active Subscription</span>
                         <h3 className="text-2xl font-black text-neutral-900">{sub.plan}</h3>
                      </div>
                      <span className="font-bold text-neutral-400 text-xs">#{sub.id}</span>
                   </div>
                   <p className="text-neutral-500 font-medium text-sm mb-6">Personalized clinical nutrition delivered daily to your doorstep.</p>
                   
                   <div className="grid grid-cols-2 gap-4 mt-auto pt-4 border-t border-neutral-100">
                      <div>
                         <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Renews On</p>
                         <p className="font-bold text-neutral-900">{sub.renewal}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Monthly Cost</p>
                         <p className="font-black text-emerald-600 text-xl">{sub.price}</p>
                      </div>
                   </div>
                </div>
             </div>
             <div className="bg-neutral-50 p-4 px-8 border-t border-neutral-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-[10px] font-black uppercase text-neutral-600 tracking-widest">System Status: Synchronized</span>
                </div>
                <div className="flex gap-2">
                   <button className="px-4 py-2 text-xs font-black uppercase tracking-widest text-neutral-600 hover:text-neutral-900 transition">View Billing</button>
                   <button className="px-6 py-2 bg-white border border-neutral-200 rounded-full text-xs font-black uppercase tracking-widest shadow-sm hover:shadow-md transition active:scale-95">Manage Plan</button>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrackView() {
  const [filter, setFilter] = useState<'daily'|'weekly'|'monthly'>('daily');
  const [dailyWater, setDailyWater] = useState(6);
  const [baseWeight, setBaseWeight] = useState(72.5);
  const [showWeightModal, setShowWeightModal] = useState(false);

  const stats = {
    daily: { cals: "870 / 1500", p: "45 / 60", c: "110 / 200", f: "25 / 50", cp: '58%', pp: '75%', pt: '55%', ft: '50%', w: dailyWater },
    weekly: { cals: "8500 / 10500", p: "320 / 420", c: "800 / 1400", f: "200 / 350", cp: '80%', pp: '76%', pt: '57%', ft: '57%', w: 42 + (dailyWater - 6) },
    monthly: { cals: "35000 / 45000", p: "1250 / 1800", c: "3500 / 6000", f: "850 / 1500", cp: '77%', pp: '69%', pt: '58%', ft: '56%', w: 160 + (dailyWater - 6) }
  };

  const curr = stats[filter];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="text-3xl font-black tracking-tighter text-neutral-900 uppercase">Your Progress</h2>
        <button onClick={() => alert("Report downloaded successfully as PDF.")} className="flex justify-center items-center gap-2 px-8 py-3 bg-[#1A1A1A] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-neutral-800 transition-all w-full sm:w-auto">
          <Download className="w-4 h-4" /> Download Report
        </button>
      </div>

      <div className="flex bg-neutral-200/50 p-1.5 rounded-2xl w-fit mb-12 shadow-inner border border-neutral-200">
        <button onClick={() => setFilter('daily')} className={`px-8 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${filter === 'daily' ? 'bg-white shadow-xl text-neutral-900 scale-105' : 'text-neutral-500 hover:text-neutral-900'}`}>Daily</button>
        <button onClick={() => setFilter('weekly')} className={`px-8 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${filter === 'weekly' ? 'bg-white shadow-xl text-neutral-900 scale-105' : 'text-neutral-500 hover:text-neutral-900'}`}>Weekly</button>
        <button onClick={() => setFilter('monthly')} className={`px-8 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${filter === 'monthly' ? 'bg-white shadow-xl text-neutral-900 scale-105' : 'text-neutral-500 hover:text-neutral-900'}`}>Monthly</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-8 rounded-[32px] border border-neutral-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-[64px] -z-10 group-hover:bg-emerald-100 transition-colors" />
          <h3 className="text-lg font-black mb-8 text-neutral-900 uppercase tracking-tight">{filter === 'daily' ? "Today's" : filter === 'weekly' ? "This Week's" : "This Month's"} Nutrition</h3>
          
          <div className="space-y-8">
            <div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] mb-3">
                <span className="text-neutral-400">Total Calories</span>
                <span className="text-emerald-600">{curr.cals} kcal</span>
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-4 shadow-inner p-1 flex items-center">
                <motion.div initial={{ width: 0 }} animate={{ width: curr.cp }} transition={{ duration: 1, ease: "easeOut" }} className="bg-emerald-500 h-2 rounded-full shadow-lg shadow-emerald-900/20"></motion.div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
               <div>
                  <span className="text-neutral-400 font-black text-[10px] uppercase tracking-widest block mb-2">Protein</span>
                  <div className="w-full bg-neutral-100 h-1.5 rounded-full mb-2 overflow-hidden shadow-inner">
                     <motion.div initial={{ width: 0 }} animate={{ width: curr.pp }} transition={{ delay: 0.2, duration: 1 }} className="bg-blue-500 h-full rounded-full"></motion.div>
                  </div>
                  <span className="text-sm font-black text-neutral-900 tracking-tighter">{curr.p}g</span>
               </div>
               <div>
                  <span className="text-neutral-400 font-black text-[10px] uppercase tracking-widest block mb-2">Carbs</span>
                  <div className="w-full bg-neutral-100 h-1.5 rounded-full mb-2 overflow-hidden shadow-inner">
                     <motion.div initial={{ width: 0 }} animate={{ width: curr.pt }} transition={{ delay: 0.3, duration: 1 }} className="bg-amber-500 h-full rounded-full"></motion.div>
                  </div>
                  <span className="text-sm font-black text-neutral-900 tracking-tighter">{curr.c}g</span>
               </div>
               <div>
                  <span className="text-neutral-400 font-black text-[10px] uppercase tracking-widest block mb-2">Fats</span>
                  <div className="w-full bg-neutral-100 h-1.5 rounded-full mb-2 overflow-hidden shadow-inner">
                     <motion.div initial={{ width: 0 }} animate={{ width: curr.ft }} transition={{ delay: 0.4, duration: 1 }} className="bg-rose-500 h-full rounded-full"></motion.div>
                  </div>
                  <span className="text-sm font-black text-neutral-900 tracking-tighter">{curr.f}g</span>
               </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-neutral-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-[64px] -z-10 group-hover:bg-blue-100 transition-colors" />
          <div className="flex justify-between items-center mb-8">
             <h3 className="text-lg font-black text-neutral-900 uppercase tracking-tight">Today's Timeline</h3>
             <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Synchronized</span>
          </div>
          <div className="space-y-4">
             <MealStatusRow type="Breakfast" time="08:30 AM" status="delivered" title="Keto Avocado Toast" />
             <MealStatusRow type="Lunch" time="01:30 PM" status="in-transit" title="Grilled Salmon Salad" />
             <MealStatusRow type="Dinner" time="08:00 PM" status="pending" title="Steak & Broccoli" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-10 rounded-[32px] border border-neutral-200 shadow-sm flex flex-col items-center justify-center text-center group hover:shadow-xl transition-all">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500">
             <Droplet className="w-10 h-10 text-blue-500" />
          </div>
          <h3 className="font-black text-xl text-neutral-900 mb-1 uppercase tracking-tighter">Water Intake</h3>
          <p className="text-neutral-400 font-bold text-[10px] uppercase tracking-widest mb-6">Daily Target: 10 glasses</p>
          <div className="flex items-center gap-6">
             <button onClick={() => setDailyWater(Math.max(0, dailyWater - 1))} className="w-12 h-12 rounded-2xl border-2 border-neutral-100 flex items-center justify-center font-bold text-xl hover:bg-neutral-50 active:scale-90 transition-all">-</button>
             <span className="text-4xl font-black text-neutral-900 tracking-tighter">{curr.w}</span>
             <button onClick={() => setDailyWater(dailyWater + 1)} className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center font-bold text-xl hover:bg-blue-600 shadow-xl shadow-blue-200 active:scale-90 transition-all">+</button>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[32px] border border-neutral-200 shadow-sm flex flex-col items-center justify-center text-center group hover:shadow-xl transition-all">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500">
             <Scale className="w-10 h-10 text-emerald-500" />
          </div>
          <h3 className="font-black text-xl text-neutral-900 mb-1 uppercase tracking-tighter">Current Weight</h3>
          <p className="text-neutral-400 font-bold text-[10px] uppercase tracking-widest mb-6">Starting Weight: 75.0 kg</p>
          <div className="flex items-center gap-4">
             <span className="text-4xl font-black text-neutral-900 tracking-tighter">{baseWeight} <span className="text-sm uppercase text-neutral-400">kg</span></span>
             <button onClick={() => alert("Weight logger opened...")} className="p-3 bg-neutral-100 rounded-xl text-neutral-500 hover:bg-emerald-100 hover:text-emerald-600 transition-all active:scale-90 shadow-sm"><Edit2 className="w-5 h-5"/></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileView() {
  const handleLogout = () => { window.location.href = '/_logout'; setTimeout(() => window.location.href = '/management', 10); };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-black tracking-tighter mb-12 text-neutral-900 uppercase">My Account</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
         {/* Member Card */}
         <div className="bg-white rounded-[40px] p-10 border border-neutral-200 shadow-sm relative overflow-hidden group col-span-1 md:col-span-2">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-bl-[150px] -z-10 group-hover:bg-emerald-100 transition-all duration-700" />
            <div className="flex flex-col md:flex-row items-center gap-8">
               <div className="w-32 h-32 rounded-[40px] border-4 border-white shadow-2xl overflow-hidden bg-neutral-100">
                  <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2680&auto=format&fit=crop" className="w-full h-full object-cover" alt="User" />
               </div>
               <div className="text-center md:text-left flex-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-2 block">Clinical Tier • Level 2</span>
                  <h3 className="text-4xl font-black text-neutral-900 tracking-tighter mb-1">John Doe</h3>
                  <p className="text-neutral-500 font-bold text-sm mb-6 uppercase tracking-widest">Premium Member since Oct 2025</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                     <span className="bg-neutral-950 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Non-Veg</span>
                     <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Weight Loss</span>
                     <span className="bg-white border border-neutral-200 text-neutral-900 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Lactose Intolerant</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Saved Addresses */}
         <div className="bg-white p-8 rounded-[32px] border border-neutral-200 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-8">
               <div className="bg-neutral-100 p-2.5 rounded-2xl text-neutral-600 shadow-inner"><MapPin className="w-6 h-6" /></div>
               <h4 className="font-black text-lg uppercase tracking-tight text-neutral-900">Delivery Addresses</h4>
            </div>
            <div className="space-y-4 mb-8">
               <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2 block">Work</span>
                  <p className="font-bold text-neutral-900 leading-snug">123 Corporate Tower, Phase 2<br />Tech Park, Bengaluru 560100</p>
               </div>
            </div>
            <button className="w-full mt-auto py-4 border-2 border-dashed border-neutral-100 text-neutral-400 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:border-emerald-300 hover:text-emerald-700 transition-all">Add New Address</button>
         </div>

         {/* Health Documents */}
         <div className="bg-white p-8 rounded-[32px] border border-neutral-200 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-8">
               <div className="bg-neutral-100 p-2.5 rounded-2xl text-neutral-600 shadow-inner"><FileText className="w-6 h-6" /></div>
               <h4 className="font-black text-lg uppercase tracking-tight text-neutral-900">Clinical Reports</h4>
            </div>
            <div className="space-y-3 mb-8">
               <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 group hover:bg-blue-50 transition-colors">
                  <div className="flex items-center gap-4 min-w-0">
                     <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-900/20"><FileText className="w-5 h-5"/></div>
                     <div className="min-w-0">
                        <p className="font-bold text-neutral-900 text-sm truncate">Blood_Test_Oct.pdf</p>
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Oct 12, 2026</p>
                     </div>
                  </div>
                  <Download className="w-4 h-4 text-blue-400 group-hover:text-blue-600" />
               </div>
            </div>
            <button className="w-full mt-auto py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-900/20 hover:bg-blue-700 transition-all active:scale-95">Upload Document</button>
         </div>
      </div>

      <div className="space-y-4">
         <button className="w-full flex items-center justify-between p-6 bg-white rounded-3xl border border-neutral-200 hover:shadow-xl hover:border-emerald-200 transition-all group">
            <div className="flex items-center gap-6">
               <div className="bg-neutral-50 p-3 rounded-2xl text-neutral-500 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-inner"><Settings className="w-6 h-6" /></div>
               <span className="font-black text-lg text-neutral-900 uppercase tracking-tighter">Security & Preferences</span>
            </div>
            <ChevronRight className="w-6 h-6 text-neutral-200 group-hover:text-emerald-500 transition-all" />
         </button>
         <button onClick={handleLogout} className="w-full flex items-center justify-between p-6 bg-rose-50/30 rounded-3xl border border-rose-100/50 hover:bg-rose-50 transition-all group shadow-sm">
            <div className="flex items-center gap-6">
               <div className="bg-rose-100 p-3 rounded-2xl text-rose-600 shadow-inner group-hover:bg-rose-600 group-hover:text-white transition-all"><LogOut className="w-6 h-6" /></div>
               <span className="font-black text-lg text-rose-600 uppercase tracking-tighter">Sign Out</span>
            </div>
         </button>
      </div>
    </div>
  );
}

function ConsultsView() {
  const doctors = [
    { id: 1, name: "Dr. Priya Sharma", spec: "Clinical Nutritionist", img: "https://images.unsplash.com/photo-1612349316228-5942a9b489c2?q=80&w=2670&auto=format&fit=crop" },
    { id: 2, name: "Dr. Rahul Menon", spec: "Sports Dietetics", img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2564&auto=format&fit=crop" },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-black tracking-tighter mb-8 text-neutral-900 uppercase">Consultations</h2>
      
      <div className="bg-white p-10 rounded-[40px] border border-neutral-200 shadow-sm mb-12 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]" />
        <h3 className="font-black text-xs text-neutral-400 uppercase tracking-[0.3em] mb-8">Confirmed Session</h3>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl border-4 border-white shadow-2xl overflow-hidden bg-neutral-100">
              <img src={doctors[0].img} className="w-full h-full object-cover" alt="Dr" />
            </div>
            <div>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">{doctors[0].spec}</p>
              <div className="font-black text-2xl text-neutral-900 tracking-tighter">{doctors[0].name}</div>
              <div className="text-xs text-neutral-400 font-bold flex items-center gap-2 mt-2 uppercase tracking-widest">
                <Clock className="w-3 h-3" /> Tomorrow • 10:00 AM
              </div>
            </div>
          </div>
          <button onClick={() => alert("Launching Secure Zoom Video Room...")} className="flex items-center justify-center gap-3 px-10 py-5 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl shadow-emerald-900/30 hover:bg-emerald-700 transition-all active:scale-95 group">
            <Video className="w-5 h-5 group-hover:animate-pulse" /> Launch Session
          </button>
        </div>
      </div>

      <div className="bg-white p-12 rounded-[40px] border border-neutral-200 shadow-sm text-center border-dashed border-2 bg-neutral-50/50">
        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 text-neutral-400 shadow-xl border border-neutral-100">
          <Calendar className="w-8 h-8 opacity-20" />
        </div>
        <h3 className="font-black text-2xl text-neutral-900 mb-2 uppercase tracking-tighter">Need a check-in?</h3>
        <p className="text-neutral-400 font-medium text-sm mb-10 max-w-sm mx-auto">Schedule a 1-on-1 session with our clinical experts to refine your macroscopic targets.</p>
        <button className="flex items-center justify-center gap-3 px-10 py-4 bg-neutral-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-2xl active:scale-95">
          Request Appointment
        </button>
      </div>
    </div>
  );
}

function MealStatusRow({ type, time, status, title }: { type: string, time: string, status: 'delivered' | 'in-transit' | 'pending', title: string }) {
  const statusConfig = {
    delivered: { icon: CheckCircle2, color: 'text-emerald-600', bgColor: 'bg-emerald-50', label: 'Delivered' },
    'in-transit': { icon: Truck, color: 'text-amber-600', bgColor: 'bg-amber-50', label: 'In Transit' },
    pending: { icon: Clock, color: 'text-neutral-300', bgColor: 'bg-neutral-50', label: 'Pending' },
  };
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-4 p-4 rounded-3xl border border-neutral-100 bg-white hover:shadow-2xl transition-all duration-500 group cursor-pointer border-transparent hover:border-neutral-200/50">
      <div className={`p-3 rounded-2xl ${config.bgColor} ${config.color} group-hover:scale-110 transition-transform shadow-sm`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
           <p className="font-black text-neutral-900 text-sm tracking-tight truncate uppercase">{title}</p>
           <span className="text-[10px] font-black uppercase tracking-widest text-neutral-300 group-hover:text-neutral-500 transition-colors">{time}</span>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">{type}</span>
           <div className="w-1 h-1 bg-neutral-200 rounded-full"></div>
           <span className={`text-[10px] font-black uppercase tracking-widest ${config.color}`}>{config.label}</span>
        </div>
      </div>
    </div>
  );
}
