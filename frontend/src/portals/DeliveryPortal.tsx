import { Truck, MapPin, Navigation, Phone, Check, MessageSquare, Power, Wallet, X, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import '../../assets/Delivery.css'; // Make sure this path is correct!

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8080';

const getDriverId = () => {
  return localStorage.getItem('token') || '';
};

export function DeliveryPortal() {
  const [profile, setProfile] = useState<any>(null);
  const [availableOrders, setAvailableOrders] = useState<any[]>([]);
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // OTP Modal State
  const [otpModalOrder, setOtpModalOrder] = useState<any>(null);
  const [otpInput, setOtpInput] = useState("");

  const handleLogout = () => { 
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/delivery'; 
  };

  const fetchDashboardData = async () => {
    try {
      const driverId = getDriverId();
      
      const [profRes, availRes, activeRes] = await Promise.all([
        fetch(`${API_BASE}/api/delivery/profile?user_id=${driverId}`),
        fetch(`${API_BASE}/api/delivery/available-orders?user_id=${driverId}`),
        fetch(`${API_BASE}/api/delivery/orders/active?user_id=${driverId}`)
      ]);

      if (profRes.ok) setProfile(await profRes.json());
      if (availRes.ok) setAvailableOrders(await availRes.json());
      if (activeRes.ok) setActiveOrders(await activeRes.json());
      
    } catch (err) {
      console.error("Failed to load delivery data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000); // Auto-refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const toggleStatus = async () => {
    if (!profile) return;
    try {
      const newStatus = !profile.isActive;
      await fetch(`${API_BASE}/api/delivery/status?user_id=${getDriverId()}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newStatus })
      });
      fetchDashboardData();
    } catch (err) { alert("Failed to update status"); }
  };

  const handleAcceptOrder = async (order: any) => {
    try {
      const res = await fetch(`${API_BASE}/api/delivery/orders/${order.id}/accept?user_id=${getDriverId()}`, {
        method: 'PUT'
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.detail);
        return;
      }
      // Open the OTP Modal so they can pick it up from the kitchen
      setOtpModalOrder(order);
    } catch (err) { alert("Network error"); }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/delivery/orders/${otpModalOrder.id}/pickup?user_id=${getDriverId()}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: otpInput })
      });
      
      if (!res.ok) {
        const err = await res.json();
        alert(err.detail); // Will alert "Invalid OTP" if wrong
        return;
      }
      
      alert("Pickup Confirmed! Drive safely.");
      setOtpModalOrder(null);
      setOtpInput("");
      fetchDashboardData(); // Refreshes lists, moving it to Active Orders
    } catch (err) { alert("Network error"); }
  };

  const markDelivered = async (orderId: string) => {
    if(!confirm("Confirm order has been dropped off?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/delivery/orders/${orderId}/deliver?user_id=${getDriverId()}`, {
        method: 'PUT'
      });
      
      if (res.ok) {
        const data = await res.json();
        alert(data.message); // Tells them how much they earned!
        fetchDashboardData();
      } else {
        alert("Failed to complete delivery");
      }
    } catch (err) { alert("Network error"); }
  };

  // UI Derivations
  const currentStop = activeOrders.length > 0 ? activeOrders[0] : null;

  if (loading) return <div className="h-screen bg-neutral-100 flex items-center justify-center font-bold text-neutral-400 uppercase tracking-widest animate-pulse">Initializing Fleet System...</div>;

  return (
    <div className="delv-page-container">
      {/* Driver App Header */}
      <header className="delv-header">
        <div className="font-black flex items-center gap-3 text-lg uppercase tracking-tighter">
          <div className="bg-purple-600 p-1.5 rounded-lg shadow-lg shadow-purple-900/40">
            <Truck className="w-5 h-5 text-white" />
          </div>
          NutriBox <span className="text-purple-500">Fleet</span>
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] font-black uppercase text-neutral-500 tracking-widest leading-none">Vehicle ID</span>
              <span className="text-xs font-bold text-white uppercase">{profile?.vehicleNumber || 'Unassigned'}</span>
           </div>
           <button onClick={handleLogout} className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10">
             Sign Out
           </button>
        </div>
      </header>

      <div className="delv-main-wrapper">
        {/* Map Area */}
        <div className="delv-map-area">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400 bg-[#E5E7EB]">
            <div className="w-full h-full relative overflow-hidden">
               <div className="absolute inset-0 opacity-10 flex flex-wrap gap-4 p-4">
                  {Array.from({length: 100}).map((_, i) => <div key={i} className="w-20 h-20 border border-neutral-900 rounded-lg"></div>)}
               </div>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Navigation className={`w-20 h-20 mb-4 ${profile?.isActive && currentStop ? 'text-purple-600 animate-bounce' : 'text-neutral-300'}`} />
                  <p className="font-black text-neutral-400 uppercase tracking-[0.3em] text-xs">
                    {profile?.isActive ? (currentStop ? 'Navigation Active' : 'Waiting for Orders') : 'System Offline'}
                  </p>
               </div>
            </div>
          </div>
          
          {/* Floating Route Status */}
          {currentStop && profile?.isActive && (
            <div className="delv-floating-card">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-purple-600 p-3 rounded-2xl text-white shadow-lg shadow-purple-200">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] text-neutral-400 font-black uppercase tracking-widest mb-0.5">Estimated Arrival</div>
                  <div className="text-2xl font-black text-neutral-900">12 mins</div>
                </div>
              </div>
              <div className="relative border-l-4 border-neutral-100 ml-3 pl-8 py-2 space-y-8">
                <div className="relative">
                  <div className="absolute -left-[38px] top-1 w-4 h-4 rounded-full bg-neutral-300 border-4 border-white shadow-sm" />
                  <div>
                     <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-0.5">Origin</p>
                     <p className="text-sm font-bold text-neutral-600">Cloud Kitchen Hub</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -left-[38px] top-1 w-4 h-4 rounded-full bg-purple-600 border-4 border-white shadow-lg" />
                  <div>
                     <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-0.5">Destination</p>
                     <p className="text-sm font-black text-neutral-900 leading-tight">{currentStop.addressText || "Address missing"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Driver Controls */}
        <div className="delv-sidebar">
          <div className="delv-sidebar-header">
            <div>
               <h2 className="font-black text-xl text-neutral-900 uppercase tracking-tighter">{profile?.fullName}</h2>
               <div className="flex items-center gap-2 mt-1">
                 <Wallet className="w-3 h-3 text-emerald-600" />
                 <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">₹{profile?.totalEarnings?.toFixed(2)} Earned</span>
               </div>
            </div>
            <button 
              onClick={toggleStatus}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${profile?.isActive ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-neutral-100 text-neutral-500 border border-neutral-200'}`}
            >
              <Power className="w-4 h-4" /> {profile?.isActive ? 'Online' : 'Offline'}
            </button>
          </div>
          
          <div className="delv-scroll-area">
            {!profile?.isActive ? (
               <div className="text-center py-20 px-8">
                  <div className="w-20 h-20 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center mx-auto mb-6">
                     <Power className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-black text-neutral-900 mb-2">You are Offline</h3>
                  <p className="text-sm font-medium text-neutral-500">Go online to start receiving delivery pings and earning money.</p>
               </div>
            ) : currentStop ? (
              /* ACTIVE DELIVERY VIEW */
              <div className="delv-card active">
                <div className="absolute -top-3 right-8 bg-purple-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-widest">Active Dropoff</div>
                
                <div className="flex items-start justify-between mb-6 pt-2">
                  <div>
                     <h3 className="font-black text-neutral-900 text-sm uppercase tracking-widest mb-1">Customer Delivery</h3>
                     <p className="font-bold text-neutral-500 text-xs">{currentStop.customerName}</p>
                  </div>
                  <div className="bg-neutral-100 text-neutral-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                     {currentStop.id.split('-')[0]}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                   <div className="flex gap-4">
                      <div className="bg-neutral-50 p-2 rounded-xl h-fit border border-neutral-100"><MapPin className="w-4 h-4 text-purple-600" /></div>
                      <p className="font-bold text-neutral-900 text-sm leading-snug pt-1">{currentStop.addressText || "Contact customer for exact location"}</p>
                   </div>
                   
                   <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                         <MessageSquare className="w-3 h-3" /> Delivery Details
                      </p>
                      <p className="text-sm font-medium text-neutral-700 leading-relaxed italic">{currentStop.mealName}</p>
                   </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => alert(`Calling ${currentStop.customerPhone}...`)} className="flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-neutral-100 bg-white font-black uppercase tracking-widest text-[10px] text-neutral-600 hover:bg-neutral-50 transition-all active:scale-95">
                      <Phone className="w-4 h-4" /> Call
                    </button>
                    <button onClick={() => markDelivered(currentStop.id)} className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-purple-600 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-purple-200 hover:bg-purple-700 transition-all active:scale-95">
                      <Check className="w-4 h-4" /> Delivered
                    </button>
                </div>
              </div>
            ) : (
              /* AVAILABLE ORDERS VIEW */
              <>
                <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-2 px-1 flex items-center gap-2">
                  <Clock className="w-4 h-4"/> Ready for Pickup ({availableOrders.length})
                </h3>
                {availableOrders.length === 0 ? (
                  <div className="text-center py-10 px-8 border-2 border-dashed border-neutral-200 rounded-3xl">
                    <p className="text-sm font-bold text-neutral-400">No orders ready at the kitchen right now. Stay tuned.</p>
                  </div>
                ) : (
                  availableOrders.map(order => (
                    <div key={order.id} className="delv-card hover:border-purple-200 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 bg-amber-50 px-2 py-0.5 rounded">At Kitchen</span>
                          <h4 className="font-bold text-neutral-900 mt-2">{order.customerName}</h4>
                          <p className="text-xs text-neutral-500 truncate w-48 mt-1">{order.addressText}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Ticket</p>
                          <p className="font-mono font-bold text-sm text-neutral-700">{order.id.split('-')[0]}</p>
                        </div>
                      </div>
                      <button onClick={() => handleAcceptOrder(order)} className="delv-btn-primary py-3 w-full text-[10px]">
                        Accept & Navigate to Kitchen
                      </button>
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* OTP MODAL */}
      <AnimatePresence>
        {otpModalOrder && (
          <div className="delv-modal-overlay">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{opacity: 0, scale: 0.9}} className="bg-white rounded-3xl max-w-sm w-full p-8 shadow-2xl relative text-center">
              <button onClick={() => setOtpModalOrder(null)} className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900"><X className="w-6 h-6"/></button>
              
              <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <ChefHat className="w-8 h-8" />
              </div>
              
              <h3 className="text-2xl font-black text-neutral-900 uppercase tracking-tighter mb-2">Kitchen Handoff</h3>
              <p className="text-neutral-500 text-sm mb-8 font-medium">To take possession of Ticket <strong className="text-neutral-900">{otpModalOrder.id.split('-')[0]}</strong>, enter the 4-digit PIN provided by the kitchen staff.</p>
              
              <form onSubmit={handleVerifyOTP}>
                <input 
                  type="text" 
                  maxLength={4}
                  required
                  value={otpInput} 
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))} // Numbers only
                  className="w-full text-center text-4xl tracking-[0.5em] font-mono font-black text-neutral-900 bg-neutral-100 border-2 border-neutral-200 rounded-2xl py-4 mb-6 focus:outline-none focus:border-purple-500" 
                  placeholder="0000"
                />
                <button type="submit" className="delv-btn-primary py-4 w-full text-xs">
                  Verify Pickup
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}