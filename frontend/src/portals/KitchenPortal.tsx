import { ChefHat, CheckCircle, Clock, Calendar, Truck, RotateCcw, AlertTriangle, User, X, Activity, AlertCircle, Zap, ShieldAlert, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import '../../assets/Kitchen.css'; // Make sure path is correct

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8080';

const getKitchenId = () => {
  return localStorage.getItem('token') || '';
};

export function KitchenPortal() {
  const [activeTab, setActiveTab] = useState<'kds' | 'menu' | 'dispatch'>('kds');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => { 
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login'; 
  };

  return (
    <div className="kitchen-page-container">
      <div className="kitchen-sidebar">
         <div className="kitchen-sidebar-header">
            <ChefHat className="w-8 h-8 shrink-0" />
            <h2 className="text-xl font-bold tracking-tight uppercase hidden md:block text-white">Kitchen</h2>
         </div>
         <nav className="flex flex-col gap-2 px-3 w-full">
            <TabButton icon={<ChefHat/>} label="Active Orders" active={activeTab === 'kds'} onClick={() => setActiveTab('kds')} />
            <TabButton icon={<Calendar/>} label="Menu Manager" active={activeTab === 'menu'} onClick={() => setActiveTab('menu')} />
            <TabButton icon={<Truck/>} label="Dispatch Handoff" active={activeTab === 'dispatch'} onClick={() => setActiveTab('dispatch')} />
         </nav>
         <div className="mt-auto px-6 text-center md:text-left">
            <p className="font-mono text-xl text-neutral-400 hidden md:block">{currentTime.toLocaleTimeString()}</p>
            <button onClick={handleLogout} className="mt-4 w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-sm font-bold rounded-lg transition-colors border border-neutral-700">Exit System</button>
         </div>
      </div>

      <div className="kitchen-main-content">
        {activeTab === 'kds' && <ActiveKDSView />}
        {activeTab === 'menu' && <MenuManagerView currentTime={currentTime} />}
        {activeTab === 'dispatch' && <DispatchTrackerView />}
      </div>
    </div>
  );
}

function TabButton({ icon, label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`kitchen-nav-btn ${active ? 'active' : ''}`}>
       <div className="w-6 h-6 flex justify-center items-center">{icon}</div>
       <span className="hidden md:block uppercase tracking-widest text-xs">{label}</span>
    </button>
  );
}

// ---------------------------------------------------------
// 1. ACTIVE KDS VIEW
// ---------------------------------------------------------
function ActiveKDSView() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/kitchen/orders?user_id=${getKitchenId()}`);
      if (res.ok) setOrders(await res.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Poll every 10s for new orders
    return () => clearInterval(interval);
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await fetch(`${API_BASE}/api/kitchen/orders/${orderId}/status?user_id=${getKitchenId()}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchOrders();
    } catch (e) { alert("Failed to update status"); }
  };

  const bumpPriority = async (orderId: string) => {
    try {
      await fetch(`${API_BASE}/api/kitchen/orders/${orderId}/priority?user_id=${getKitchenId()}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority: 'HIGH' })
      });
      fetchOrders();
    } catch (e) { alert("Failed to update priority"); }
  };

  return (
    <div className="p-6 h-full flex flex-col relative">
      {selectedCustomer && <CustomerTimelineModal customerId={selectedCustomer} onClose={() => setSelectedCustomer(null)} />}
      
      {orders.length === 0 ? (
         <div className="m-auto flex flex-col items-center opacity-30">
            <CheckCircle className="w-16 h-16 mb-4" />
            <div className="text-center text-xl font-bold uppercase tracking-widest">Kitchen Clear</div>
            <p className="text-sm font-medium mt-2">Waiting for dynamic orders...</p>
         </div>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-4">
          {orders.map(order => (
            <div key={order.id} className="kitchen-order-card">
              <div className={`kitchen-order-header ${order.priority === 'HIGH' ? 'high-priority' : ''}`}>
                 <div>
                   <span className="font-mono font-black text-lg block text-white">{order.id.split('-')[0]} • {order.mealType}</span>
                   <button onClick={() => setSelectedCustomer(order.customerId)} className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 mt-1">
                      <User className="w-3 h-3"/> {order.customerName}
                   </button>
                 </div>
                 <div className="flex flex-col items-end gap-1">
                   <span className={`text-[10px] px-2 py-1 rounded font-black uppercase tracking-widest border ${order.priority === 'HIGH' ? 'bg-rose-600 border-rose-500 text-white' : 'bg-neutral-800 border-neutral-600 text-neutral-400'}`}>
                      {order.priority}
                   </span>
                   {order.priority !== 'HIGH' && (
                     <button onClick={() => bumpPriority(order.id)} className="text-[9px] text-amber-500 hover:underline flex items-center gap-1 uppercase font-bold"><Zap className="w-3 h-3"/> Bump</button>
                   )}
                 </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="mb-4">
                   <h4 className="text-lg font-bold text-white mb-2">{order.mealName}</h4>
                   {order.dietaryTags && order.dietaryTags.length > 0 && (
                     <div className="flex flex-wrap gap-2 mb-2">
                       {order.dietaryTags.map((tag: string, i: number) => (
                         <span key={i} className="text-[10px] bg-amber-900/50 text-amber-400 border border-amber-900/50 px-2 py-0.5 rounded uppercase tracking-widest font-black">{tag}</span>
                       ))}
                     </div>
                   )}
                   {order.instructions && (
                     <div className="bg-rose-950/30 border border-rose-900/50 p-2 rounded flex gap-2 items-start mt-2">
                       <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                       <p className="text-xs font-medium text-rose-200">{order.instructions}</p>
                     </div>
                   )}
                </div>
                
                <div className="mt-auto pt-4 border-t border-neutral-700 flex gap-2">
                   {order.status === 'PENDING' ? (
                     <button onClick={() => updateOrderStatus(order.id, 'COOKING')} className="kitchen-btn-secondary bg-blue-900 hover:bg-blue-800 text-blue-100 flex items-center justify-center gap-2">
                       <ChefHat className="w-4 h-4" /> Start Cooking
                     </button>
                   ) : (
                     <button onClick={() => updateOrderStatus(order.id, 'READY')} className="kitchen-btn-secondary bg-emerald-900 hover:bg-emerald-800 text-emerald-100 flex items-center justify-center gap-2">
                       <Check className="w-4 h-4" /> Mark Ready
                     </button>
                   )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- TIMELINE MODAL ---
function CustomerTimelineModal({ customerId, onClose }: { customerId: string, onClose: () => void }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/kitchen/customer/${customerId}/timeline?user_id=${getKitchenId()}`)
      .then(res => res.json())
      .then(setData)
      .catch(() => setData({ error: "Failed to load timeline" }));
  }, [customerId]);

  return (
    <div className="kitchen-modal-overlay">
       <div className="kitchen-modal-content">
          <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-white"><X className="w-6 h-6"/></button>
          
          {!data ? <p className="text-center text-neutral-500 font-bold animate-pulse">Loading timeline...</p> : data.error ? <p className="text-center text-rose-500 font-bold">{data.error}</p> : (
            <>
               <div className="flex items-center gap-3 mb-6">
                 <div className="p-3 bg-blue-900/30 text-blue-400 rounded-xl"><Activity className="w-6 h-6"/></div>
                 <div>
                    <h3 className="text-xl font-black text-white">{data.customerName}'s Profile</h3>
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest mt-1">Today's Intake Status</p>
                 </div>
               </div>
               
               <div className="flex gap-4 mb-8 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                  <div className="flex-1 text-center border-r border-neutral-800">
                     <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">Protein</p>
                     <p className="font-mono text-lg text-blue-400">{data.macrosConsumedToday.protein}g</p>
                  </div>
                  <div className="flex-1 text-center border-r border-neutral-800">
                     <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">Carbs</p>
                     <p className="font-mono text-lg text-amber-400">{data.macrosConsumedToday.carbs}g</p>
                  </div>
                  <div className="flex-1 text-center">
                     <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">Fats</p>
                     <p className="font-mono text-lg text-rose-400">{data.macrosConsumedToday.fats}g</p>
                  </div>
               </div>

               <div className="space-y-4">
                  <h4 className="text-xs font-black text-neutral-500 uppercase tracking-widest">Meals Consumed Today</h4>
                  {data.mealsToday.length === 0 ? <p className="text-sm text-neutral-400 italic">No meals logged yet today.</p> : 
                    data.mealsToday.map((event: any, idx: number) => (
                      <div key={idx} className="flex gap-4 items-start">
                         <div className="text-xs font-mono text-neutral-400 pt-1 w-16 text-right">
                           {new Date(event.deliveredAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                         </div>
                         <div className="flex-1 bg-neutral-800 p-3 rounded-lg border border-neutral-700">
                            <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest block mb-1">{event.mealType}</span>
                            <p className="text-sm font-bold text-white">{event.mealName}</p>
                         </div>
                      </div>
                    ))
                  }
               </div>
            </>
          )}
       </div>
    </div>
  );
}

// ---------------------------------------------------------
// 2. MENU MANAGER VIEW
// ---------------------------------------------------------
function MenuManagerView({ currentTime }: { currentTime: Date }) {
  const [formData, setFormData] = useState({ targetDate: new Date().toISOString().split('T')[0], mealType: 'BREAKFAST', defaultMealName: '', proteinGrams: '', carbsGrams: '', fatGrams: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const checkTimeLock = () => {
    if (formData.targetDate !== new Date().toISOString().split('T')[0]) return false; 
    const hours = currentTime.getHours();
    if (formData.mealType === 'BREAKFAST' && hours >= 7) return true; 
    if (formData.mealType === 'LUNCH' && hours >= 12) return true; 
    if (formData.mealType === 'DINNER' && hours >= 18) return true; 
    return false;
  };

  const handleSubmit = async () => {
    setError(''); setSuccess('');
    if(!formData.defaultMealName || !formData.proteinGrams) { setError("Fill all fields"); return; }

    const res = await fetch(`${API_BASE}/api/kitchen/menu?user_id=${getKitchenId()}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        ...formData, 
        proteinGrams: Number(formData.proteinGrams), 
        carbsGrams: Number(formData.carbsGrams),
        fatGrams: Number(formData.fatGrams)
      })
    });
    
    if (!res.ok) {
       const errData = await res.json();
       setError(errData.detail);
    } else {
       setSuccess("Menu Updated Successfully!");
       setFormData({ ...formData, defaultMealName: '', proteinGrams: '', carbsGrams: '', fatGrams: ''});
       setTimeout(() => setSuccess(''), 3000);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto md:mx-0">
      <h2 className="text-2xl font-black uppercase tracking-widest mb-6">Daily Menu Planner</h2>
      
      <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl space-y-6 shadow-xl">
         {error && <div className="bg-rose-950/50 border border-rose-900 text-rose-400 p-3 rounded text-sm font-bold flex gap-2"><ShieldAlert className="w-5 h-5"/> {error}</div>}
         {success && <div className="bg-emerald-950/50 border border-emerald-900 text-emerald-400 p-3 rounded text-sm font-bold flex gap-2"><CheckCircle className="w-5 h-5"/> {success}</div>}
         
         <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Target Day</label>
               <input type="date" value={formData.targetDate} onChange={e => setFormData({...formData, targetDate: e.target.value})} className="kitchen-input [color-scheme:dark]" />
            </div>
            <div>
               <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Meal Slot</label>
               <select value={formData.mealType} onChange={e => setFormData({...formData, mealType: e.target.value})} className="kitchen-input">
                  <option value="BREAKFAST">Breakfast (8:00 AM)</option>
                  <option value="LUNCH">Lunch (1:00 PM)</option>
                  <option value="DINNER">Dinner (7:00 PM)</option>
               </select>
            </div>
         </div>

         <div>
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Recipe / Meal Name</label>
            <input type="text" value={formData.defaultMealName} onChange={e => setFormData({...formData, defaultMealName: e.target.value})} placeholder="e.g. Keto Chicken Salad" className="kitchen-input" />
         </div>

         <div className="grid grid-cols-3 gap-4">
            <div>
               <label className="block text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">Protein (Grams)</label>
               <input type="number" value={formData.proteinGrams} onChange={e => setFormData({...formData, proteinGrams: e.target.value})} placeholder="0" className="kitchen-input" />
            </div>
            <div>
               <label className="block text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-2">Carbs (Grams)</label>
               <input type="number" value={formData.carbsGrams} onChange={e => setFormData({...formData, carbsGrams: e.target.value})} placeholder="0" className="kitchen-input" />
            </div>
            <div>
               <label className="block text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-2">Fats (Grams)</label>
               <input type="number" value={formData.fatGrams} onChange={e => setFormData({...formData, fatGrams: e.target.value})} placeholder="0" className="kitchen-input" />
            </div>
         </div>

         {checkTimeLock() ? (
            <div className="bg-rose-950/50 border border-rose-900 text-rose-400 p-4 rounded-lg flex items-center gap-3">
               <AlertTriangle className="w-5 h-5 shrink-0" />
               <p className="text-sm font-bold">Menu Locked! You must update at least 1 hour before meal time.</p>
            </div>
         ) : (
            <button onClick={handleSubmit} className="kitchen-btn-primary">Save to Menu Grid</button>
         )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// 3. DISPATCH TRACKER VIEW
// ---------------------------------------------------------
function DispatchTrackerView() {
  const [dispatches, setDispatches] = useState<any[]>([]);

  const fetchDispatch = () => {
    fetch(`${API_BASE}/api/kitchen/dispatch?user_id=${getKitchenId()}`)
      .then(res => res.json())
      .then(setDispatches)
      .catch(console.error);
  }

  useEffect(() => {
    fetchDispatch();
    const interval = setInterval(fetchDispatch, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto md:mx-0">
      <div className="flex justify-between items-end mb-6">
         <h2 className="text-2xl font-black uppercase tracking-widest">Driver Handoff</h2>
         <button onClick={fetchDispatch} className="text-xs font-bold text-neutral-400 flex items-center gap-1 hover:text-white uppercase"><RotateCcw className="w-3 h-3"/> Refresh</button>
      </div>
      
      {dispatches.length === 0 ? (
         <div className="bg-neutral-900 border border-neutral-800 p-12 rounded-2xl text-center shadow-xl">
            <Truck className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-500 font-bold uppercase tracking-widest text-sm">No Orders Waiting for Dispatch</p>
         </div>
      ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dispatches.map((d, idx) => (
               <div key={idx} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex justify-between items-center shadow-xl">
                  <div>
                     <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-900/30 px-2 py-0.5 rounded">{d.status}</span>
                     <h3 className="font-bold text-lg mt-2 text-white">{d.driverName}</h3>
                     <p className="text-xs text-neutral-400 font-mono mb-2">{d.driverPhone}</p>
                     <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Customer: <span className="text-white">{d.customerName}</span></p>
                     <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mt-1">Ticket: <span className="font-mono text-white">{d.orderId.split('-')[0]}</span></p>
                  </div>
                  <div className="text-center bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                     <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1">Verify OTP</p>
                     <p className="font-mono text-3xl font-black text-emerald-400 tracking-widest">{d.otp}</p>
                  </div>
               </div>
            ))}
         </div>
      )}
    </div>
  );
}