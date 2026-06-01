import { useState, useEffect } from 'react';
import { MapPin, Calendar, Activity, Clock, Video, User, Home, ShoppingCart, ShoppingBag, Truck, Download, Save, Edit2, X, CheckCircle2, Zap, Phone, FileText, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import '../../assets/Customer.css'; // Make sure this path is correct for your project!

// Dynamically pull from .env, fallback to localhost if missing
const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8080';

const getUserId = () => {
  return localStorage.getItem('token') || '';
};

// ==========================================
// MAIN EXPORT
// ==========================================
export function CustomerPortal() {
  const [activeTab, setActiveTab] = useState<'cart' | 'orders' | 'track' | 'profile' | 'consults'>('track');

  const handleLogout = () => { 
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/'; 
  };

  return (
    <div className="cust-page-container">
      <header className="cust-header md:px-8">
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
        <aside className="w-full md:w-64 cust-sidebar p-4 md:flex flex-col gap-2 overflow-y-auto hidden">
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
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'cart' && <CartView onCheckoutSuccess={() => setActiveTab('orders')} />}
              {activeTab === 'orders' && <OrdersView />}
              {activeTab === 'track' && <TrackView />}
              {activeTab === 'consults' && <ConsultsView />}
              {activeTab === 'profile' && <ProfileView />}
            </motion.div>
          </AnimatePresence>
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
        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'profile' ? 'text-emerald-600' : 'text-neutral-400 hover:text-emerald-600'}`}>
          <User className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Profile</span>
        </button>
      </div>
    </div>
  );
}

// ==========================================
// SUB-COMPONENTS
// ==========================================

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

// ... (CartView, OrdersView, TrackView remain exactly the same)

function CartView({ onCheckoutSuccess }: { onCheckoutSuccess: () => void }) {
  const [catalog, setCatalog] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showQR, setShowQR] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/customer/plans`)
      .then(res => res.json())
      .then(data => setCatalog(data))
      .catch(console.error);
  }, []);

  const handleSimulatePayment = async () => {
    setIsCheckingOut(true);
    try {
      const response = await fetch(`${API_BASE}/api/customer/subscription?user_id=${getUserId()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: selectedPlan.id }), 
      });

      if (response.ok) {
        onCheckoutSuccess();
      } else {
        const err = await response.json();
        alert(err.detail || "Checkout Failed");
        setShowQR(false);
      }
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (showQR) {
    return (
      <div className="max-w-md mx-auto cust-card text-center shadow-xl">
        <h3 className="text-2xl font-black mb-4">Scan to Pay</h3>
        <p className="text-neutral-500 mb-6">Pay ₹{selectedPlan.monthlyPrice} for the 30-day plan.</p>
        <div className="w-64 h-64 mx-auto bg-neutral-100 rounded-2xl flex items-center justify-center border-4 border-dashed border-emerald-200 mb-6">
          <span className="text-neutral-400 font-bold">[ QR Code Image ]</span>
        </div>
        <button onClick={handleSimulatePayment} disabled={isCheckingOut} className="cust-btn-primary w-full py-4 text-[10px] disabled:opacity-50">
          {isCheckingOut ? 'Verifying...' : 'I have Completed Payment'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-black tracking-tighter mb-8 text-neutral-900 uppercase">Your Basket</h2>
      
      {selectedPlan ? (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 flex justify-between items-center shadow-sm">
             <div>
                <h3 className="font-bold text-xl">{selectedPlan.name}</h3>
                <p className="text-neutral-500 text-sm mt-1 max-w-md">{selectedPlan.description}</p>
             </div>
             <div className="flex flex-col items-end gap-2 shrink-0">
                <span className="font-black text-2xl text-emerald-600">₹{selectedPlan.monthlyPrice}/mo</span>
                <button onClick={() => setSelectedPlan(null)} className="text-red-500 text-[10px] font-black uppercase tracking-widest hover:underline">Remove</button>
             </div>
          </div>
          <div className="flex justify-end">
             <button onClick={() => setShowQR(true)} className="cust-btn-primary px-12 py-4 text-xs">Proceed to Pay</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {catalog.map(plan => (
            <div key={plan.id} className="bg-white p-6 rounded-[32px] border border-neutral-200 hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer group flex flex-col" onClick={() => setSelectedPlan(plan)}>
              <h3 className="text-xl font-black mb-2 text-neutral-900">{plan.name}</h3>
              <p className="text-neutral-500 text-sm mb-6 flex-1">{plan.description}</p>
              <div className="flex justify-between items-center mt-auto border-t border-neutral-100 pt-4">
                <span className="font-black text-emerald-600">₹{plan.monthlyPrice}/mo</span>
                <span className="bg-neutral-100 text-neutral-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:bg-emerald-600 group-hover:text-white transition-colors">Select Plan</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OrdersView() {
  const [subscription, setSubscription] = useState<any>(null);
  const [planDetails, setPlanDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/customer/subscription?user_id=${getUserId()}`)
      .then(res => res.json())
      .then(async data => {
        if (!data.detail) {
          setSubscription(data);
          const plansRes = await fetch(`${API_BASE}/api/customer/plans`);
          const plans = await plansRes.json();
          const activePlan = plans.find((p: any) => p.id === data.planId);
          setPlanDetails(activePlan);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-20 font-bold text-neutral-500 animate-pulse">Syncing subscription with database...</div>;
  }

  if (!subscription) return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-black tracking-tighter mb-8 text-neutral-900 uppercase">My Subscriptions</h2>
      <div className="cust-card text-center p-12">
        <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
        <h3 className="text-xl font-black mb-2 text-neutral-900">No Active Subscriptions</h3>
        <p className="text-neutral-500 font-medium mb-6">Head over to your basket to checkout a plan.</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-black tracking-tighter mb-8 text-neutral-900 uppercase">My Subscriptions</h2>
      <div className="cust-card p-8">
        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-100">ACTIVE</span>
        <h3 className="text-3xl font-black mt-4 mb-8 tracking-tight">{planDetails ? planDetails.name : `Plan ID: ${subscription.planId}`}</h3>
        
        <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
           <div>
             <p className="text-[10px] text-neutral-400 font-black uppercase tracking-[0.2em] mb-1">Time Remaining</p>
             <p className="text-4xl font-black text-emerald-600">{subscription.daysLeft} <span className="text-lg text-emerald-600/50">Days</span></p>
           </div>
           <div className="sm:text-right">
             <p className="text-[10px] text-neutral-400 font-black uppercase tracking-[0.2em] mb-1">Renews / Expires On</p>
             <p className="text-xl font-black text-neutral-900">{new Date(subscription.expiryDate).toLocaleDateString()}</p>
           </div>
        </div>
      </div>
    </div>
  );
}

function TrackView() {
  const [trackingData, setTrackingData] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/customer/today?user_id=${getUserId()}`)
      .then(res => res.json())
      .then(data => setTrackingData(data))
      .catch(() => setTrackingData({ message: "Network error" }));
  }, []);

  if (!trackingData) return <div className="text-center py-20 font-bold text-neutral-500 animate-pulse">Syncing timeline...</div>;

  if (trackingData.message) return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-black tracking-tighter mb-8 uppercase">Your Progress</h2>
      <div className="cust-card text-center p-8">
         <Package className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
         <p className="text-neutral-500 font-bold">{trackingData.message}</p>
      </div>
    </div>
  );

  const totalCalories = (trackingData.macros?.protein * 4) + (trackingData.macros?.carbs * 4) + (trackingData.macros?.fats * 9);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-black tracking-tighter mb-8 uppercase text-neutral-900">Your Progress</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="cust-card p-8">
          <h3 className="text-lg font-black mb-8 uppercase tracking-tight">Today's Nutrition</h3>
          <div className="space-y-4">
             <div className="flex justify-between items-center p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Total Calories</span>
                <span className="font-black text-lg text-emerald-600">{totalCalories || 0} kcal</span>
             </div>
             <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-2xl text-center">
                   <span className="block text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1">Protein</span>
                   <span className="font-black text-lg text-blue-600">{trackingData.macros?.protein || 0}g</span>
                </div>
                <div className="bg-amber-50 p-4 rounded-2xl text-center">
                   <span className="block text-[10px] font-black uppercase tracking-widest text-amber-400 mb-1">Carbs</span>
                   <span className="font-black text-lg text-amber-600">{trackingData.macros?.carbs || 0}g</span>
                </div>
                <div className="bg-rose-50 p-4 rounded-2xl text-center">
                   <span className="block text-[10px] font-black uppercase tracking-widest text-rose-400 mb-1">Fats</span>
                   <span className="font-black text-lg text-rose-600">{trackingData.macros?.fats || 0}g</span>
                </div>
             </div>
             {trackingData.customInstructions && (
               <div className="mt-4 p-3 bg-neutral-100 rounded-xl">
                 <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1">Dietary Request Saved:</p>
                 <p className="text-xs text-neutral-700 font-medium">{trackingData.customInstructions}</p>
               </div>
             )}
          </div>
        </div>

        <div className="cust-card p-8 group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-[64px] -z-10 transition-colors" />
          <div className="flex justify-between items-start mb-8">
             <h3 className="text-lg font-black uppercase tracking-tight">Assigned Meal</h3>
             {trackingData.otp && (
               <div className="text-right">
                 <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-1">Pickup OTP</span>
                 <span className="bg-neutral-900 text-white px-2 py-1 rounded text-xs font-mono font-bold tracking-widest">{trackingData.otp}</span>
               </div>
             )}
          </div>
          <div className="space-y-4">
             <MealStatusRow status={trackingData.status} title={trackingData.mealName} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ConsultsView() {
  const [consults, setConsults] = useState<any[]>([]);
  const [availableNutritionists, setAvailableNutritionists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Booking Modal State
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedNutritionist, setSelectedNutritionist] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  const fetchConsults = () => {
    fetch(`${API_BASE}/api/customer/consultations?user_id=${getUserId()}`)
      .then(res => res.json())
      .then(data => {
        setConsults(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setConsults([]);
        setLoading(false);
      });
  };

  const fetchNutritionists = async () => {
    try {
      // Fetching from the public/admin endpoint to get the list of doctors
      const res = await fetch(`${API_BASE}/api/admin/nutritionist_profiles?user_id=ADMN-SYSTEM`);
      if (res.ok) {
        const json = await res.json();
        // Only allow booking with APPROVED nutritionists
        const approved = (json.data || []).filter((doc: any) => doc.isApproved);
        setAvailableNutritionists(approved);
      }
    } catch (e) {
      console.error("Failed to fetch nutritionists");
    }
  };

  useEffect(() => {
    fetchConsults();
    fetchNutritionists();
  }, []);

  const handleBookConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNutritionist || !bookingDate || !bookingTime) {
      alert("Please fill out all fields");
      return;
    }

    setIsBooking(true);
    
    // Combine Date and Time into an ISO String for the backend
    const scheduledTime = new Date(`${bookingDate}T${bookingTime}`).toISOString().replace('T', ' ').substring(0, 19);

    try {
      const response = await fetch(`${API_BASE}/api/customer/consultations?user_id=${getUserId()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nutritionistId: selectedNutritionist,
          scheduledTime: scheduledTime
        })
      });

      if (!response.ok) {
        const err = await response.json();
        alert(err.detail || "Failed to book consultation");
      } else {
        alert("Consultation requested successfully!");
        setShowBookModal(false);
        setBookingDate("");
        setBookingTime("");
        setSelectedNutritionist("");
        fetchConsults(); // Refresh the list
      }
    } catch (err) {
      alert("Network Error");
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) return <div className="text-center py-20 font-bold text-neutral-500 animate-pulse">Syncing consultations...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <h2 className="text-3xl font-black tracking-tighter text-neutral-900 uppercase">Consultations</h2>
        <button 
          onClick={() => setShowBookModal(true)} 
          className="cust-btn-primary px-6 py-3 text-[10px]"
        >
          Book Session
        </button>
      </div>

      {(!consults || consults.length === 0) ? (
        <div className="cust-card text-center p-12">
           <Video className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
           <p className="text-neutral-500 font-bold">No active consultations booked at this time.</p>
        </div>
      ) : (
        consults.map((consult, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[40px] border border-neutral-200 mb-6 flex flex-col md:flex-row justify-between md:items-center gap-6 shadow-sm relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-full h-2 ${consult.status === 'COMPLETED' ? 'bg-neutral-300' : 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]'}`} />
            <div>
              <div className="flex items-center gap-3 mb-2">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em]">Scheduled Session</p>
                <span className="text-[9px] font-black uppercase tracking-widest bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full">{consult.status}</span>
              </div>
              
              <h3 className="text-2xl font-black tracking-tight text-neutral-900 mb-1">
                Nutritionist ID: {consult.nutritionistId ? consult.nutritionistId.split('-')[1] || consult.nutritionistId : 'Pending Assignment'}
              </h3>
              
              <p className="text-xs text-neutral-400 font-bold flex items-center gap-2 uppercase tracking-widest">
                <Clock className="w-3 h-3" /> {new Date(consult.scheduledTime).toLocaleString()}
              </p>
            </div>
            {consult.meetingLink && consult.status !== 'COMPLETED' ? (
              <a href={consult.meetingLink} target="_blank" rel="noreferrer" className="cust-btn-primary px-8 py-4 text-[10px] shrink-0">
                <Video className="w-4 h-4" /> Join Meeting
              </a>
            ) : (
              <div className="px-8 py-4 bg-neutral-100 text-neutral-400 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center">
                {consult.status === 'REQUESTED' ? 'Waiting for Approval' : 'Meeting Unavailable'}
              </div>
            )}
          </div>
        ))
      )}

      {/* BOOKING MODAL */}
      <AnimatePresence>
        {showBookModal && (
          <div className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{opacity: 0, scale: 0.9}} className="bg-white rounded-[40px] max-w-lg w-full p-10 shadow-2xl border border-neutral-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-neutral-900 uppercase tracking-tighter">Book Specialist</h3>
                <button onClick={() => setShowBookModal(false)} className="text-neutral-300 hover:text-neutral-900 transition-colors"><X className="w-8 h-8" /></button>
              </div>
              
              <form onSubmit={handleBookConsultation} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-3">Select Nutritionist</label>
                  <select 
                    value={selectedNutritionist} 
                    onChange={(e) => setSelectedNutritionist(e.target.value)} 
                    required
                    className="w-full px-5 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl font-black text-neutral-900 focus:outline-emerald-500 shadow-inner"
                  >
                    <option value="" disabled>Choose a specialist...</option>
                    {availableNutritionists.map(n => (
                      <option key={n.userId} value={n.userId}>Dr. {n.fullName} ({n.specialty || 'General'})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-3">Date</label>
                    <input 
                      type="date" 
                      required
                      value={bookingDate} 
                      onChange={(e) => setBookingDate(e.target.value)} 
                      className="w-full px-5 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl font-black text-neutral-900 focus:outline-emerald-500 shadow-inner text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-3">Time</label>
                    <input 
                      type="time" 
                      required
                      value={bookingTime} 
                      onChange={(e) => setBookingTime(e.target.value)} 
                      className="w-full px-5 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl font-black text-neutral-900 focus:outline-emerald-500 shadow-inner text-sm" 
                    />
                  </div>
                </div>

                <button type="submit" disabled={isBooking} className="cust-btn-primary w-full py-4 text-xs mt-4 disabled:opacity-50">
                  {isBooking ? 'Requesting...' : 'Send Request'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ------------------------------------------
// FIXED PROFILE VIEW WITH PICTURE EDITING
// ------------------------------------------
function ProfileView() {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const [imageError, setImageError] = useState(false);

  const [editForm, setEditForm] = useState({
    fullName: '', phoneNumber: '', addressText: '', profilePictureUrl: ''
  });

  const fetchProfile = () => {
    fetch(`${API_BASE}/api/customer/profile?user_id=${getUserId()}`)
      .then(res => res.json())
      .then(data => {
        setProfileData(data);
        setEditForm({
          fullName: data.fullName || '', 
          phoneNumber: data.phoneNumber || '',
          addressText: data.addressText || '',
          profilePictureUrl: data.profilePictureUrl || ''
        });
        setImageError(false);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load profile", err);
        setLoading(false);
      });
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleSaveProfile = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/customer/profile?user_id=${getUserId()}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (response.ok) {
        setIsEditing(false);
        fetchProfile();
      } else {
        alert("Failed to save changes.");
      }
    } catch (err) {
      alert("Network Error");
    }
  };

  if (loading) return <div className="text-center py-20 font-bold text-neutral-500 animate-pulse">Syncing profile from database...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-3xl font-black tracking-tighter text-neutral-900 uppercase">My Account</h2>
        {!isEditing ? (
          <button onClick={() => { setIsEditing(true); setPreviewError(false); }} className="flex items-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl hover:bg-emerald-100 transition-colors">
            <Edit2 className="w-4 h-4" /> Edit Details
          </button>
        ) : (
          <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 text-sm font-bold text-neutral-500 bg-neutral-200 px-4 py-2 rounded-xl hover:bg-neutral-300 transition-colors">
            <X className="w-4 h-4" /> Cancel
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
         {/* Profile Card */}
         <div className="cust-card p-10 col-span-1 md:col-span-2 group">
            <div className="cust-card-accent" />
            
            {isEditing ? (
              <div className="space-y-6 relative z-10">
                {/* Live Image Preview */}
                <div className="flex items-center gap-6 mb-8 p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <div className="w-20 h-20 rounded-2xl border-2 border-white shadow-lg overflow-hidden bg-neutral-200 flex items-center justify-center shrink-0">
                    {editForm.profilePictureUrl && !previewError ? (
                      <img 
                        src={editForm.profilePictureUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover" 
                        onError={() => setPreviewError(true)} 
                      />
                    ) : (
                      <User className="w-8 h-8 text-neutral-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-black text-neutral-900 uppercase tracking-widest">Image Preview</p>
                    {previewError ? (
                      <p className="text-[10px] font-bold text-red-500 mt-1">Invalid link. Ensure it ends in .jpg, .png, etc.</p>
                    ) : (
                      <p className="text-[10px] font-bold text-emerald-600 mt-1">Looking good!</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-2">Full Name</label>
                  <input type="text" value={editForm.fullName} onChange={(e) => setEditForm({...editForm, fullName: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 font-medium" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-2">Profile Image URL</label>
                  <input 
                    type="text" 
                    value={editForm.profilePictureUrl} 
                    onChange={e => {
                      setEditForm({...editForm, profilePictureUrl: e.target.value});
                      setPreviewError(false);
                    }} 
                    className={`w-full bg-neutral-50 border rounded-xl px-4 py-3 text-sm focus:outline-none font-medium ${previewError ? 'border-red-300 focus:border-red-500 text-red-600' : 'border-neutral-200 focus:border-emerald-500'}`} 
                    placeholder="https://example.com/my-photo.jpg"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                 <div className="w-32 h-32 rounded-[40px] border-4 border-white shadow-2xl overflow-hidden bg-neutral-100 flex items-center justify-center">
                    {profileData?.profilePictureUrl && !imageError ? (
                      <img 
                        src={profileData.profilePictureUrl} 
                        alt="Profile" 
                        className="w-full h-full object-cover" 
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <User className="w-12 h-12 text-neutral-400" />
                    )}
                 </div>
                 <div className="text-center md:text-left flex-1 w-full">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-2 block">Customer Account</span>
                    <h3 className="text-4xl font-black text-neutral-900 tracking-tighter mb-1">{profileData?.fullName || "Guest Customer"}</h3>
                    <p className="text-neutral-500 font-bold text-sm mb-1 uppercase tracking-widest">{profileData?.email}</p>
                    <p className="text-neutral-400 font-bold text-xs mb-6 uppercase tracking-widest">ID: {profileData?.userId}</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                       {profileData?.dietaryTags?.map((tag: string, idx: number) => (
                         <span key={idx} className="bg-white border border-neutral-200 text-neutral-900 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{tag}</span>
                       ))}
                    </div>
                 </div>
              </div>
            )}
         </div>

         {/* Contact & Address Edit Form */}
         <div className="cust-card p-8 flex flex-col col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-8">
               <div className="bg-neutral-100 p-2.5 rounded-2xl text-neutral-600 shadow-inner"><MapPin className="w-6 h-6" /></div>
               <h4 className="font-black text-lg uppercase tracking-tight text-neutral-900">Contact Details</h4>
            </div>
            {isEditing ? (
              <div className="space-y-4 mb-8 flex-1">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-1">Phone Number</label>
                  <input type="text" value={editForm.phoneNumber} onChange={e => setEditForm({...editForm, phoneNumber: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 font-medium" placeholder="+91 9876543210" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-1">Full Delivery Address</label>
                  <textarea rows={3} value={editForm.addressText} onChange={e => setEditForm({...editForm, addressText: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 font-medium resize-none" placeholder="123 Main St, Apartment 4B, City, Zip" />
                </div>
                <button onClick={handleSaveProfile} className="cust-btn-primary w-full py-4 mt-4 text-[10px]">
                  <Save className="w-4 h-4" /> Save All Changes
                </button>
              </div>
            ) : (
              <div className="space-y-4 mb-8 flex-1">
                 <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-start gap-4">
                    <Phone className="w-5 h-5 text-neutral-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1 block">Phone</span>
                      <p className="font-bold text-neutral-900">{profileData?.phoneNumber || "Not provided"}</p>
                    </div>
                 </div>
                 <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-neutral-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1 block">Saved Address</span>
                      <p className="font-bold text-neutral-900 leading-relaxed whitespace-pre-wrap">
                        {profileData?.addressText ? profileData.addressText : "No delivery address saved yet."}
                      </p>
                    </div>
                 </div>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}

function MealStatusRow({ status, title }: { status: string, title: string }) {
  const getStatusConfig = (dbStatus: string) => {
    switch (dbStatus) {
      case 'DELIVERED': return { icon: CheckCircle2, color: 'text-emerald-600', bgColor: 'bg-emerald-50', label: 'Delivered' };
      case 'IN_TRANSIT': return { icon: Truck, color: 'text-amber-600', bgColor: 'bg-amber-50', label: 'In Transit' };
      case 'READY': return { icon: ShoppingBag, color: 'text-blue-600', bgColor: 'bg-blue-50', label: 'Ready for Pickup' };
      case 'COOKING': return { icon: Zap, color: 'text-orange-600', bgColor: 'bg-orange-50', label: 'Cooking Now' };
      case 'PENDING': default: return { icon: Clock, color: 'text-neutral-400', bgColor: 'bg-neutral-100', label: 'Pending Kitchen' };
    }
  };
  
  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-4 p-4 rounded-3xl border border-neutral-100 bg-white hover:shadow-2xl transition-all duration-500 group cursor-pointer border-transparent hover:border-neutral-200/50">
      <div className={`p-3 rounded-2xl ${config.bgColor} ${config.color} group-hover:scale-110 transition-transform shadow-sm`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
           <p className="font-black text-neutral-900 text-sm tracking-tight truncate uppercase">{title}</p>
        </div>
        <div className="flex items-center gap-2">
           <div className={`w-2 h-2 rounded-full ${config.bgColor.replace('bg-', 'bg-').replace('50', '400')}`}></div>
           <span className={`text-[10px] font-black uppercase tracking-widest ${config.color}`}>{config.label}</span>
        </div>
      </div>
    </div>
  );
}