import { useState } from 'react';
import { MapPin, Calendar, Activity, Clock, Plus, Video, Target, TrendingUp, User, Home, ShoppingCart, ShoppingBag, Truck, Download, Droplet, ArrowDown, CreditCard, Bell, Settings, LogOut, Edit2, X, ChevronRight, Star, CheckCircle2, Trash2, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

export function CustomerPortal() {
  const [activeTab, setActiveTab] = useState<'cart' | 'orders' | 'track' | 'profile' | 'consults'>('track');

  return (
    <div className="flex flex-col h-screen bg-neutral-50 overflow-hidden font-sans">
      <header className="bg-white border-b border-neutral-200 h-16 flex items-center justify-between px-4 md:px-8 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">Z</div>
          <span className="font-bold text-xl tracking-tight text-neutral-900">Customer Space</span>
        </div>
      </header>
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-white border-r border-neutral-200 p-4 md:flex flex-col gap-2 overflow-y-auto hidden">
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
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-32">
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
      <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-neutral-200 py-3 pb-5 flex justify-evenly items-center z-50">
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
        isActive ? 'bg-emerald-50 text-emerald-700' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
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
    <div className="max-w-4xl">
      <h2 className="text-2xl font-bold tracking-tight mb-6 text-neutral-900">Your Basket</h2>
      {hasItems ? (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
             <div className="flex gap-4 items-center">
                 <div className="w-20 h-20 bg-neutral-100 rounded-2xl overflow-hidden shrink-0"><img src="https://images.unsplash.com/photo-1543362906-acfc16c67564?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover" /></div>
                 <div>
                    <h3 className="font-bold text-xl text-neutral-900">Weight Loss Plan</h3>
                    <p className="text-neutral-500 font-medium text-sm">3 Meals/Day • 1 Month Subscription</p>
                 </div>
             </div>
             <div className="flex items-center gap-6 self-end md:self-auto">
                <span className="font-black text-2xl text-emerald-600">₹12,000</span>
                <button onClick={() => setHasItems(false)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors font-bold text-sm uppercase tracking-wider">Remove</button>
             </div>
          </div>
          <div className="flex justify-end">
             <button onClick={() => { setHasItems(false); alert("Order successfully placed! You will receive confirmation via email."); }} className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest text-sm hover:bg-emerald-700 transition shadow-lg hover:shadow-emerald-900/20">Checkout Now</button>
          </div>
        </div>
      ) : (
        <div className="bg-white border text-neutral-900 border-neutral-200 rounded-2xl p-8 text-center shadow-sm">
          <ShoppingCart className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Your basket is empty</h3>
          <p className="text-neutral-500 mb-6 font-medium">Looks like you haven't added any meal plans yet.</p>
          <a href="/#plans" className="inline-block px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-emerald-700 transition">Browse Plans</a>
        </div>
      )}
    </div>
  );
}

function OrdersView() {
  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-bold tracking-tight mb-6 text-neutral-900">My Subscriptions</h2>
      
      <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm mb-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-neutral-900">Weight Loss Plan</h3>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider">Active</span>
            </div>
            <p className="text-neutral-500 font-medium">3 Meals/Day • Standard Delivery</p>
            <div className="mt-4 flex gap-3">
               <button onClick={() => alert("Redirecting to meal plan modification...")} className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg text-xs font-bold hover:bg-neutral-200 transition">Change Plan</button>
               <button onClick={() => alert("Subscription pause requested.")} className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg text-xs font-bold hover:bg-neutral-200 transition">Pause</button>
            </div>
          </div>
          <div className="bg-neutral-50 px-6 py-4 rounded-xl border border-neutral-100 text-center w-full md:w-auto">
            <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest mb-1">Remaining Time</p>
            <p className="text-2xl font-black text-emerald-600">24 Days</p>
            <button onClick={() => alert("Renewing subscription...")} className="mt-2 w-full py-2 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-emerald-200 transition">Renew</button>
          </div>
        </div>

        {/* 3 Meals Tracking */}
        <div className="space-y-6">
          <h4 className="font-bold text-neutral-900">Today's Deliveries</h4>
          
          <div className="border border-neutral-100 rounded-2xl p-5 bg-neutral-50">
            <div className="flex justify-between items-center mb-4">
              <div className="font-bold">Meal 1: Breakfast</div>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Delivered</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 text-xs">✓</div>
              <div className="h-1 flex-1 bg-emerald-100 mx-2"><div className="h-full bg-emerald-500 w-full rounded-full"></div></div>
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 text-xs">✓</div>
              <div className="h-1 flex-1 bg-emerald-100 mx-2"><div className="h-full bg-emerald-500 w-full rounded-full"></div></div>
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0"><MapPin className="w-3 h-3" /></div>
            </div>
          </div>

          <div className="border border-neutral-100 rounded-2xl p-5 bg-white">
            <div className="flex justify-between items-center mb-4">
              <div className="font-bold">Meal 2: Lunch</div>
              <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded">Out for Delivery</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 text-xs">✓</div>
              <div className="h-1 flex-1 bg-emerald-100 mx-2"><div className="h-full bg-emerald-500 w-full rounded-full"></div></div>
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 text-xs">✓</div>
              <div className="h-1 flex-1 bg-neutral-100 mx-2"><div className="h-full bg-emerald-500 w-1/2 rounded-full"></div></div>
              <div className="w-6 h-6 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center shrink-0"><Truck className="w-3 h-3" /></div>
            </div>
            <div className="mt-4 text-xs font-bold text-neutral-500 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" /> Tracking: Driver is 5 mins away
            </div>
          </div>

          <div className="border border-neutral-100 rounded-2xl p-5 bg-white opacity-60">
            <div className="flex justify-between items-center mb-4">
              <div className="font-bold">Meal 3: Dinner</div>
              <span className="text-xs font-bold bg-neutral-200 text-neutral-600 px-2 py-1 rounded">Preparing</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 text-xs">✓</div>
              <div className="h-1 flex-1 bg-neutral-100 mx-2"><div className="h-full bg-emerald-500 w-2/3 rounded-full"></div></div>
              <div className="w-6 h-6 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center shrink-0 text-xs">-</div>
              <div className="h-1 flex-1 bg-neutral-100 mx-2"><div className="h-full bg-neutral-200 w-0 rounded-full"></div></div>
              <div className="w-6 h-6 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center shrink-0"><Truck className="w-3 h-3" /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrackView() {
  const [filter, setFilter] = useState<'daily'|'weekly'|'monthly'>('daily');
  const [dailyWater, setDailyWater] = useState(6);
  const [baseWeight, setBaseWeight] = useState(72.5);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [newWeight, setNewWeight] = useState(baseWeight.toString());

  const stats = {
    daily: { cals: "870 / 1500", p: "45 / 60", c: "110 / 200", f: "25 / 50", cp: '58%', pp: '75%', pt: '55%', ft: '50%', w: dailyWater },
    weekly: { cals: "8500 / 10500", p: "320 / 420", c: "800 / 1400", f: "200 / 350", cp: '80%', pp: '76%', pt: '57%', ft: '57%', w: 42 + (dailyWater - 6) },
    monthly: { cals: "35000 / 45000", p: "1250 / 1800", c: "3500 / 6000", f: "850 / 1500", cp: '77%', pp: '69%', pt: '58%', ft: '56%', w: 160 + (dailyWater - 6) }
  };

  const curr = stats[filter];

  return (
    <div className="max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">Track Your Progress</h2>
        <button onClick={() => alert("Report downloaded successfully as PDF.")} className="flex justify-center items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all w-full sm:w-auto">
          <Download className="w-4 h-4" /> Download Report
        </button>
      </div>

      <div className="flex bg-neutral-200/50 p-1 rounded-xl w-fit mb-8 shadow-inner">
        <button onClick={() => setFilter('daily')} className={`px-6 py-2 rounded-lg font-bold text-sm transition ${filter === 'daily' ? 'bg-white shadow text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'}`}>Daily</button>
        <button onClick={() => setFilter('weekly')} className={`px-6 py-2 rounded-lg font-bold text-sm transition ${filter === 'weekly' ? 'bg-white shadow text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'}`}>Weekly</button>
        <button onClick={() => setFilter('monthly')} className={`px-6 py-2 rounded-lg font-bold text-sm transition ${filter === 'monthly' ? 'bg-white shadow text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'}`}>Monthly</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6 text-neutral-900">{filter === 'daily' ? "Today's" : filter === 'weekly' ? "This Week's" : "This Month's"} Nutrition</h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-neutral-700">Calories</span>
                <span className="text-emerald-600">{curr.cals} kcal</span>
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-2.5">
                <div className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500" style={{ width: curr.cp }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-neutral-700">Protein</span>
                <span className="text-blue-600">{curr.p}g</span>
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full transition-all duration-500" style={{ width: curr.pp }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-neutral-700">Carbs</span>
                <span className="text-orange-600">{curr.c}g</span>
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-2.5">
                <div className="bg-orange-500 h-2.5 rounded-full transition-all duration-500" style={{ width: curr.pt }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-neutral-700">Fats</span>
                <span className="text-yellow-500">{curr.f}g</span>
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-2.5">
                <div className="bg-yellow-400 h-2.5 rounded-full transition-all duration-500" style={{ width: curr.ft }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm text-center">
            <h3 className="text-lg font-bold mb-2 text-neutral-900">Water Intake</h3>
            <p className="text-3xl font-black text-blue-500 mb-6">{curr.w} <span className="text-lg text-neutral-400 font-bold">glasses</span></p>
            <div className="flex justify-center gap-2 mb-6">
              {Array.from({ length: curr.w }).map((_, i) => <Droplet key={`fill-${i}`} className="w-6 h-6 text-blue-500 fill-blue-500" />)}
              {Array.from({ length: Math.max(0, 8 - curr.w) }).map((_, i) => <Droplet key={`empty-${i}`} className="w-6 h-6 text-neutral-200" />)}
            </div>
            <button onClick={() => setDailyWater(prev => prev + 1)} className="w-full py-3 bg-blue-50 text-blue-600 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-blue-100 transition">
              + Add Glass
            </button>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm relative">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg font-bold text-neutral-900">Weight Tracking</h3>
              <button onClick={() => setShowWeightModal(true)} className="px-4 py-2 bg-neutral-100 text-neutral-600 rounded-lg text-xs font-bold hover:bg-neutral-200 transition">
                + Add Weight
              </button>
            </div>
            <div className="flex items-end gap-4">
              <span className="text-5xl font-black text-neutral-900">{baseWeight} <span className="text-xl text-neutral-400">kg</span></span>
            </div>
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-bold">
              <ArrowDown className="w-4 h-4" /> 2.5 kg this month
            </div>
          </div>
        </div>
      </div>

      {showWeightModal && (
        <div className="fixed inset-0 bg-neutral-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-neutral-900">Update Weight</h3>
              <button onClick={() => setShowWeightModal(false)} className="text-neutral-400 hover:text-neutral-900"><X className="w-6 h-6" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Weight (kg)</label>
                <input type="number" value={newWeight} onChange={e => setNewWeight(e.target.value)} step="0.1" className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-neutral-900" />
              </div>
              <button 
                onClick={() => { setBaseWeight(parseFloat(newWeight) || baseWeight); setShowWeightModal(false); }} 
                className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition"
              >
                Save Progress
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileView() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Sarah Jenkins");
  const [email, setEmail] = useState("sarah.j@example.com");

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  // Address State
  const [addresses, setAddresses] = useState([
    { id: 1, label: "Home", text: "123 Health Ave, Apt 4B\nNew York, NY 10001" }
  ]);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [editAddressLabel, setEditAddressLabel] = useState("");
  const [editAddressText, setEditAddressText] = useState("");

  // Payment State
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: "VISA", last4: "4242", expiry: "12/26" }
  ]);
  const [addingPayment, setAddingPayment] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newCardExpiry, setNewCardExpiry] = useState("");

  // Settings State
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [languageMenu, setLanguageMenu] = useState(false);
  const [privacyMenu, setPrivacyMenu] = useState(false);
  
  // Notification State
  const [notifs, setNotifs] = useState({ delivery: true, meals: true, marketing: false });

  const handleLogout = () => { window.location.href = '/_logout'; setTimeout(() => window.location.href = '/', 10); };

  return (
    <div className="max-w-4xl tracking-tight pb-10">
      <h2 className="text-2xl font-bold tracking-tight mb-8 text-neutral-900">My Profile</h2>
      
      <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm mb-6 relative">
        <button onClick={() => setIsEditing(!isEditing)} className="absolute top-6 right-6 p-2 bg-neutral-100 text-neutral-600 hover:bg-emerald-100 hover:text-emerald-700 rounded-full transition-colors">
          <Edit2 className="w-4 h-4" />
        </button>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group cursor-pointer" onClick={() => setIsEditing(true)}>
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl font-black shrink-0 overflow-hidden">
              SJ
            </div>
            {isEditing && (
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                 <span className="text-white text-xs font-bold uppercase tracking-widest">Edit</span>
              </div>
            )}
          </div>
          <div className="text-center sm:text-left flex-1">
            {isEditing ? (
              <div className="flex flex-col gap-3 max-w-sm">
                <input value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 border border-neutral-200 rounded-xl font-bold text-neutral-900 focus:outline-emerald-500" />
                <input value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 border border-neutral-200 rounded-xl text-neutral-500 font-medium focus:outline-emerald-500" />
                <button onClick={() => setIsEditing(false)} className="px-4 py-3 bg-emerald-600 text-white font-bold rounded-xl mt-2 tracking-wide uppercase text-sm hover:bg-emerald-700 transition">Save Changes</button>
              </div>
            ) : (
              <>
                <h3 className="text-3xl font-black text-neutral-900">{name}</h3>
                <p className="text-neutral-500 font-medium">{email}</p>
                <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider border border-emerald-100 shadow-sm">Premium Member</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-100">
            <div className="bg-neutral-100 p-2 rounded-lg text-neutral-600"><MapPin className="w-5 h-5" /></div>
            <h4 className="font-bold text-neutral-900 text-lg">Saved Addresses</h4>
          </div>
          <div className="space-y-4">
            {addresses.map(addr => (
              <div key={addr.id} className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded inline-block mb-2">{addr.label}</span>
                    <p className="text-neutral-900 font-medium whitespace-pre-line">{addr.text}</p>
                  </div>
                  <button onClick={() => {
                    setEditingAddressId(addr.id);
                    setEditAddressLabel(addr.label);
                    setEditAddressText(addr.text);
                    setShowAddressModal(true);
                  }} className="text-neutral-400 hover:text-emerald-600 transition-colors p-1"><Edit2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => {
            setEditingAddressId(null);
            setEditAddressLabel("");
            setEditAddressText("");
            setShowAddressModal(true);
          }} className="w-full mt-4 py-3 border-2 border-dashed border-neutral-200 text-neutral-500 rounded-xl font-bold text-sm hover:border-emerald-300 hover:text-emerald-700 transition hover:bg-emerald-50">
            + Add New Address
          </button>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-100">
            <div className="bg-neutral-100 p-2 rounded-lg text-neutral-600"><CreditCard className="w-5 h-5" /></div>
            <h4 className="font-bold text-neutral-900 text-lg">Payment Methods</h4>
          </div>
          <div className="space-y-4">
            {paymentMethods.map(pm => (
              <div key={pm.id} className="p-4 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center gap-4">
                <div className="w-12 h-8 bg-neutral-800 rounded flex items-center justify-center text-white text-xs font-black shrink-0 shadow">{pm.type}</div>
                <div className="flex-1">
                  <p className="font-bold text-neutral-900">•••• •••• •••• {pm.last4}</p>
                  <p className="text-xs text-neutral-500 font-medium">Expires {pm.expiry}</p>
                </div>
                <button onClick={() => {
                  setAddingPayment(false);
                  setShowPaymentModal(true);
                }} className="text-neutral-400 hover:text-emerald-600 transition-colors p-1"><Edit2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm md:col-span-2">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-100">
            <div className="bg-neutral-100 p-2 rounded-lg text-neutral-600"><FileText className="w-5 h-5" /></div>
            <h4 className="font-bold text-neutral-900 text-lg">My Documents & Labs</h4>
          </div>
          <div className="space-y-4 mb-4">
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center justify-between">
              <div className="flex gap-4 items-center">
                 <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded flex items-center justify-center shrink-0"><FileText className="w-5 h-5"/></div>
                 <div>
                   <p className="font-bold text-neutral-900 text-sm">Blood Test Results_Oct2026.pdf</p>
                   <p className="text-xs text-neutral-500 font-medium mt-1">Uploaded 2 days ago • Added note: "Slightly low Vitamin D"</p>
                 </div>
              </div>
              <button className="text-neutral-400 hover:text-red-500 transition-colors p-2"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
          <button onClick={() => alert("Upload dialog opened: Please select a PDF or Image file")} className="w-full py-3 border-2 border-dashed border-neutral-200 text-neutral-500 rounded-xl font-bold text-sm hover:border-emerald-300 hover:text-emerald-700 transition hover:bg-emerald-50 flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Upload Document
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <button onClick={() => setShowSettingsModal(true)} className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-neutral-200 hover:shadow-md hover:border-emerald-200 transition-all text-left group">
          <div className="flex items-center gap-4">
            <div className="bg-neutral-100 p-2.5 rounded-xl text-neutral-600 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors"><Settings className="w-5 h-5" /></div>
            <span className="font-bold text-neutral-900 text-lg">Account Settings</span>
          </div>
          <ChevronRight className="w-5 h-5 text-neutral-300 group-hover:text-emerald-500 transition" />
        </button>
        
        <button onClick={() => setShowNotificationsModal(true)} className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-neutral-200 hover:shadow-md hover:border-emerald-200 transition-all text-left group">
          <div className="flex items-center gap-4">
            <div className="bg-neutral-100 p-2.5 rounded-xl text-neutral-600 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors"><Bell className="w-5 h-5" /></div>
            <span className="font-bold text-neutral-900 text-lg">Notifications</span>
          </div>
          <ChevronRight className="w-5 h-5 text-neutral-300 group-hover:text-emerald-500 transition" />
        </button>

        <button onClick={handleLogout} className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-neutral-200 hover:border-red-200 hover:bg-red-50 transition-all text-left group mt-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-red-100 p-2.5 rounded-xl text-red-600 shadow-sm"><LogOut className="w-5 h-5" /></div>
            <span className="font-bold text-red-600 text-lg">Sign Out</span>
          </div>
        </button>
      </div>

      {showAddressModal && (
        <div className="fixed inset-0 bg-neutral-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-neutral-900">Manage Address</h3>
              <button onClick={() => setShowAddressModal(false)} className="text-neutral-400 hover:text-neutral-900"><X className="w-6 h-6" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Label</label>
                <input type="text" value={editAddressLabel} onChange={e => setEditAddressLabel(e.target.value)} placeholder="e.g. Home" className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-neutral-900 focus:outline-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Street Address</label>
                <textarea rows={3} value={editAddressText} onChange={e => setEditAddressText(e.target.value)} placeholder="Full Address..." className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-medium text-neutral-900 resize-none focus:outline-emerald-500"></textarea>
              </div>
              <div className="flex gap-3 mt-2">
                {editingAddressId && (
                   <button onClick={() => {
                     setAddresses(addresses.filter(a => a.id !== editingAddressId));
                     setShowAddressModal(false);
                   }} className="py-3 px-4 bg-red-100 text-red-600 rounded-xl font-bold hover:bg-red-200 transition uppercase tracking-widest text-xs"><Trash2 className="w-5 h-5 mx-auto" /></button>
                )}
                <button onClick={() => {
                  if (editingAddressId) {
                    setAddresses(addresses.map(a => a.id === editingAddressId ? { ...a, label: editAddressLabel, text: editAddressText } : a));
                  } else {
                    setAddresses([...addresses, { id: Date.now(), label: editAddressLabel || "New Address", text: editAddressText }]);
                  }
                  setShowAddressModal(false);
                }} className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition hover:shadow-lg hover:shadow-emerald-900/20 uppercase tracking-widest text-xs">Save Address</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 bg-neutral-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-neutral-900">Manage Payment</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-neutral-400 hover:text-neutral-900"><X className="w-6 h-6" /></button>
            </div>
            <div className="space-y-4">
              {!addingPayment ? (
                <>
                  {paymentMethods.map(pm => (
                    <div key={pm.id} className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-4">
                       <div className="w-12 h-8 bg-neutral-800 rounded flex items-center justify-center text-white text-xs font-black shadow">{pm.type}</div>
                       <div className="flex-1">
                         <p className="font-bold text-neutral-900">{pm.type === 'UPI' ? pm.upiId : `•••• ${pm.last4}`}</p>
                         {pm.expiry && <p className="text-xs font-medium text-neutral-500">Expires {pm.expiry}</p>}
                       </div>
                       <button onClick={() => setPaymentMethods(paymentMethods.filter(p => p.id !== pm.id))} className="text-red-400 hover:text-red-600 transition-colors p-1"><X className="w-4 h-4" /></button>
                    </div>
                  ))}
                  <button onClick={() => setAddingPayment(true)} className="w-full py-3 border-2 border-dashed border-neutral-200 rounded-xl font-bold text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 hover:border-neutral-300 transition">+ Add Card or UPI</button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-2 p-1 bg-neutral-100 rounded-xl mb-4">
                    <button onClick={() => setNewCardExpiry("")} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${newCardExpiry !== 'UPI' ? 'bg-white shadow text-neutral-900' : 'text-neutral-500'}`}>Credit Card</button>
                    <button onClick={() => { setNewCardExpiry("UPI"); setNewCardNumber(""); }} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${newCardExpiry === 'UPI' ? 'bg-white shadow text-neutral-900' : 'text-neutral-500'}`}>UPI</button>
                  </div>
                  
                  {newCardExpiry === 'UPI' ? (
                     <div>
                       <label className="block text-sm font-bold text-neutral-700 mb-2">UPI ID</label>
                       <input type="text" value={newCardNumber} onChange={e => setNewCardNumber(e.target.value)} placeholder="username@upi" className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-neutral-900 focus:outline-emerald-500" />
                     </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-bold text-neutral-700 mb-2">Card Number</label>
                        <input type="text" value={newCardNumber} onChange={e => setNewCardNumber(e.target.value)} placeholder="0000 0000 0000 0000" className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-neutral-900 focus:outline-emerald-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-neutral-700 mb-2">Expiry Date</label>
                        <input type="text" value={newCardExpiry} onChange={e => setNewCardExpiry(e.target.value)} placeholder="MM/YY" className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-neutral-900 focus:outline-emerald-500" />
                      </div>
                    </>
                  )}
                  <div className="flex gap-3 mt-4">
                    <button onClick={() => { setAddingPayment(false); setNewCardExpiry(""); setNewCardNumber(""); }} className="flex-1 py-3 bg-neutral-100 text-neutral-700 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-neutral-200 transition">Cancel</button>
                    <button onClick={() => {
                      if(newCardNumber) {
                        if(newCardExpiry === 'UPI') {
                           setPaymentMethods([...paymentMethods, { id: Date.now(), type: "UPI", upiId: newCardNumber }]);
                        } else {
                           setPaymentMethods([...paymentMethods, { id: Date.now(), type: "CARD", last4: newCardNumber.slice(-4) || "0000", expiry: newCardExpiry || "12/28" }]);
                        }
                      }
                      setAddingPayment(false);
                      setNewCardNumber("");
                      setNewCardExpiry("");
                    }} className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-emerald-700 transition">Save Payment</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showSettingsModal && (
        <div className="fixed inset-0 bg-neutral-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-neutral-900">Account Settings</h3>
              <button onClick={() => setShowSettingsModal(false)} className="text-neutral-400 hover:text-neutral-900"><X className="w-6 h-6" /></button>
            </div>
            <div className="space-y-4">
              <div className={`flex items-center justify-between p-4 rounded-xl transition ${isDarkMode ? 'bg-neutral-800' : 'bg-neutral-50'}`}>
                 <div>
                    <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>Dark Mode</div>
                 </div>
                 <div onClick={() => setIsDarkMode(!isDarkMode)} className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${isDarkMode ? 'bg-emerald-500' : 'bg-neutral-300'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isDarkMode ? 'left-7' : 'left-1'}`}></div></div>
              </div>
              <div className={`p-4 rounded-xl transition ${isDarkMode ? 'bg-neutral-800' : 'bg-neutral-50'}`}>
                <div className="flex items-center justify-between cursor-pointer" onClick={() => setLanguageMenu(!languageMenu)}>
                   <div>
                      <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>Language</div>
                      <div className="text-xs font-medium text-neutral-500">English (US)</div>
                   </div>
                   <ChevronRight className={`w-4 h-4 transition ${languageMenu ? 'rotate-90' : ''} ${isDarkMode ? 'text-white' : 'text-neutral-400'}`} />
                </div>
                {languageMenu && (
                  <div className="mt-4 pt-4 border-t border-neutral-200/20 flex flex-col gap-2">
                    <button className="text-left text-sm font-bold text-emerald-600">English (US)</button>
                    <button className="text-left text-sm font-medium text-neutral-500 hover:text-neutral-800">Spanish</button>
                    <button className="text-left text-sm font-medium text-neutral-500 hover:text-neutral-800">French</button>
                  </div>
                )}
              </div>
              <div className={`p-4 rounded-xl transition ${isDarkMode ? 'bg-neutral-800' : 'bg-neutral-50'}`}>
                <div className="flex items-center justify-between cursor-pointer" onClick={() => setPrivacyMenu(!privacyMenu)}>
                   <div>
                      <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>Privacy</div>
                      <div className="text-xs font-medium text-neutral-500">Manage data & tracking</div>
                   </div>
                   <ChevronRight className={`w-4 h-4 transition ${privacyMenu ? 'rotate-90' : ''} ${isDarkMode ? 'text-white' : 'text-neutral-400'}`} />
                </div>
                {privacyMenu && (
                  <div className="mt-4 pt-4 border-t border-neutral-200/20 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                       <span className={`text-sm ${isDarkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>Share Analytics</span>
                       <div className="w-10 h-5 bg-emerald-500 rounded-full relative"><div className="absolute right-1 top-0.5 w-4 h-4 bg-white rounded-full"></div></div>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className={`text-sm ${isDarkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>Targeted Ads</span>
                       <div className="w-10 h-5 bg-neutral-300 rounded-full relative"><div className="absolute left-1 top-0.5 w-4 h-4 bg-white rounded-full"></div></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showNotificationsModal && (
        <div className="fixed inset-0 bg-neutral-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-neutral-900">Notifications</h3>
              <button onClick={() => setShowNotificationsModal(false)} className="text-neutral-400 hover:text-neutral-900"><X className="w-6 h-6" /></button>
            </div>
            <div className="space-y-4">
              <div className={`flex items-center justify-between p-4 bg-neutral-50 rounded-xl transition-colors ${notifs.delivery ? 'border-l-4 border-emerald-500' : 'border-l-4 border-neutral-200'}`}>
                 <div>
                    <div className="font-bold text-neutral-900">Delivery Updates</div>
                    <div className="text-xs font-medium text-neutral-500">Get notified when driver is near</div>
                 </div>
                 <div onClick={() => setNotifs({...notifs, delivery: !notifs.delivery})} className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${notifs.delivery ? 'bg-emerald-500' : 'bg-neutral-300'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifs.delivery ? 'right-1' : 'left-1'}`}></div></div>
              </div>
              <div className={`flex items-center justify-between p-4 bg-neutral-50 rounded-xl transition-colors ${notifs.meals ? 'border-l-4 border-emerald-500' : 'border-l-4 border-neutral-200'}`}>
                 <div>
                    <div className="font-bold text-neutral-900">Meal Reminders</div>
                    <div className="text-xs font-medium text-neutral-500">Don't miss your eating window</div>
                 </div>
                 <div onClick={() => setNotifs({...notifs, meals: !notifs.meals})} className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${notifs.meals ? 'bg-emerald-500' : 'bg-neutral-300'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifs.meals ? 'right-1' : 'left-1'}`}></div></div>
              </div>
              <div className={`flex items-center justify-between p-4 bg-neutral-50 rounded-xl transition-colors ${notifs.marketing ? 'border-l-4 border-emerald-500' : 'border-l-4 border-neutral-200'}`}>
                 <div>
                    <div className="font-bold text-neutral-900">Marketing & Offers</div>
                    <div className="text-xs font-medium text-neutral-500">Weekly promotions</div>
                 </div>
                 <div onClick={() => setNotifs({...notifs, marketing: !notifs.marketing})} className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${notifs.marketing ? 'bg-emerald-500' : 'bg-neutral-300'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifs.marketing ? 'right-1' : 'left-1'}`}></div></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ConsultsView() {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(0);

  const doctors = [
    { id: 1, name: "Dr. Priya Sharma", spec: "Weight Loss Expert", img: "https://images.unsplash.com/photo-1612349316228-5942a9b489c2?q=80&w=2670&auto=format&fit=crop" },
    { id: 2, name: "Dr. Alex Chen", spec: "Sports Nutrition", img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2670&auto=format&fit=crop" },
    { id: 3, name: "Dr. Sarah Jenkins", spec: "Holistic Health", img: "https://images.unsplash.com/photo-1594824436928-135bafeded08?q=80&w=2670&auto=format&fit=crop" }
  ];

  const times = ["09:00 AM", "10:30 AM", "01:00 PM", "03:30 PM", "05:00 PM"];
  const [selectedTime, setSelectedTime] = useState("");

  return (
    <div className="max-w-4xl tracking-tight">
      <h2 className="text-2xl font-bold tracking-tight mb-6 text-neutral-900">Consultations</h2>
      
      <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm mb-6">
        <h3 className="font-bold text-lg mb-4 text-neutral-900">Upcoming Session</h3>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <div className="w-14 h-14 rounded-full border-4 border-white shadow-sm overflow-hidden bg-white">
              <img src="https://images.unsplash.com/photo-1612349316228-5942a9b489c2?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover" alt="Dr" />
            </div>
            <div>
              <div className="font-black text-neutral-900">Dr. Priya Sharma</div>
              <div className="text-xs text-neutral-500 font-bold flex items-center gap-1 mt-1">
                <Clock className="w-3 h-3 text-emerald-600" /> Tomorrow, 10:00 AM EDT
              </div>
            </div>
          </div>
          <button onClick={() => alert("Joining Zoom call...")} className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition">
            <Video className="w-4 h-4" /> Join Call
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm text-center">
        <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-neutral-400">
          <Calendar className="w-8 h-8" />
        </div>
        <h3 className="font-bold text-lg mb-2 text-neutral-900">Book New Appointment</h3>
        <p className="text-sm font-medium text-neutral-500 mb-6 max-w-md mx-auto">Schedule a 1-on-1 session with your assigned nutritionist to adjust your meal plan or macroscopic goals.</p>
        <button onClick={() => setShowBookingModal(true)} className="flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-neutral-800 transition mx-auto cursor-pointer">
          Open Scheduler
        </button>
      </div>

      {showBookingModal && (
        <div className="fixed inset-0 bg-neutral-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-neutral-900 tracking-tight">Book Consultation</h3>
              <button onClick={() => { setShowBookingModal(false); setBookingStep(1); setSelectedTime(""); }} className="text-neutral-400 hover:text-neutral-900"><X className="w-6 h-6" /></button>
            </div>

            {bookingStep === 1 && (
              <div className="space-y-6">
                <h4 className="font-bold text-neutral-700 mb-4">Step 1: Choose a Nutritionist</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {doctors.map(doc => (
                    <div 
                      key={doc.id} 
                      onClick={() => setSelectedDoctor(doc.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedDoctor === doc.id ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-neutral-200 hover:border-emerald-200 bg-white'}`}
                    >
                      <div className="w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden">
                         <img src={doc.img} alt={doc.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-sm text-neutral-900">{doc.name}</div>
                        <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">{doc.spec}</div>
                        <div className="flex justify-center mt-2 text-yellow-400"><Star className="w-3 h-3 fill-yellow-400" /><Star className="w-3 h-3 fill-yellow-400" /><Star className="w-3 h-3 fill-yellow-400" /><Star className="w-3 h-3 fill-yellow-400" /><Star className="w-3 h-3 fill-yellow-400" /></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 flex justify-end">
                   <button onClick={() => setBookingStep(2)} disabled={!selectedDoctor} className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-700 transition">Continue</button>
                </div>
              </div>
            )}

            {bookingStep === 2 && (
              <div className="space-y-6">
                 <h4 className="font-bold text-neutral-700 mb-4">Step 2: Check Availability</h4>
                 <div className="border border-neutral-200 rounded-2xl p-6 bg-neutral-50 mb-6 text-center">
                    <div className="text-sm font-bold text-neutral-500 mb-2 uppercase tracking-widest">Select Date</div>
                    <div className="flex items-center justify-center gap-4">
                       <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-neutral-200 text-neutral-400">&lt;</button>
                       <span className="font-bold text-xl text-neutral-900">Tomorrow, Oct {new Date().getDate() + 1}</span>
                       <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900">&gt;</button>
                    </div>
                 </div>

                 <h4 className="font-bold text-neutral-700 mb-4">Available Slots</h4>
                 <div className="flex flex-wrap gap-3 mb-8">
                   {times.map(t => (
                      <button 
                        key={t}
                        onClick={() => setSelectedTime(t)}
                        className={`px-4 py-2 rounded-xl border text-sm font-bold transition-all ${selectedTime === t ? 'border-emerald-500 bg-emerald-600 text-white shadow-sm' : 'border-neutral-200 bg-white text-neutral-600 hover:border-emerald-300'}`}
                      >
                         {t}
                      </button>
                   ))}
                 </div>

                <div className="pt-4 flex justify-between">
                   <button onClick={() => setBookingStep(1)} className="px-6 py-3 bg-neutral-100 text-neutral-600 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-neutral-200 transition">Back</button>
                   <button onClick={() => setBookingStep(3)} disabled={!selectedTime} className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-700 transition">Review & Book</button>
                </div>
              </div>
            )}

            {bookingStep === 3 && (
              <div className="space-y-6 text-center py-6">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                   <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-neutral-900 mb-2">Booking Confirmed!</h3>
                <p className="text-neutral-500 font-medium max-w-sm mx-auto mb-8">
                  Your appointment with {doctors.find(d => d.id === selectedDoctor)?.name} is beautifully scheduled for Tomorrow at {selectedTime}.
                </p>
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 mb-8 max-w-sm mx-auto flex items-center justify-center gap-3">
                   <Video className="w-5 h-5 text-emerald-600" /> <span className="font-bold text-neutral-700">Zoom Link sent to email</span>
                </div>
                <button onClick={() => { setShowBookingModal(false); setBookingStep(1); setSelectedTime(""); }} className="px-8 py-3 bg-neutral-900 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-neutral-800 transition">
                   Done
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

