import { Settings, Users, Activity, Briefcase, Plus, TrendingUp, Shield, Truck, ChefHat, HeartPulse, Edit2, CheckCircle, Trash2, X, Star } from 'lucide-react';
import { useState } from 'react';

export function AdminPortal() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'meals' | 'kds' | 'delivery' | 'nutritionists' | 'users'>('dashboard');

  const handleLogout = () => { window.location.href = '/_logout'; setTimeout(() => window.location.href = '/management', 10); };

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-neutral-50 h-screen overflow-hidden">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
        <div className="p-4 bg-slate-950 font-bold text-white tracking-tight flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-rose-500" />
            Admin Console
          </div>
          <button onClick={handleLogout} className="text-xs bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-md text-slate-300 font-medium transition-colors">Exit</button>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <AdminNav icon={<Activity />} label="System Overview" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <AdminNav icon={<Briefcase />} label="Meal Plan Management" active={activeTab === 'meals'} onClick={() => setActiveTab('meals')} />
          <AdminNav icon={<ChefHat />} label="KDS Planning" active={activeTab === 'kds'} onClick={() => setActiveTab('kds')} />
          <AdminNav icon={<Truck />} label="Delivery Fleet" active={activeTab === 'delivery'} onClick={() => setActiveTab('delivery')} />
          <AdminNav icon={<HeartPulse />} label="Nutritionists" active={activeTab === 'nutritionists'} onClick={() => setActiveTab('nutritionists')} />
          <AdminNav icon={<Users />} label="Users & Subscriptions" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
        </nav>
      </aside>

      {/* Main Admin View */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 relative">
        {activeTab === 'dashboard' && <AdminDashboard />}
        {activeTab === 'meals' && <MealPlanManager />}
        {activeTab === 'kds' && <KDSPlanning />}
        {activeTab === 'delivery' && <DeliveryManager />}
        {activeTab === 'nutritionists' && <NutritionistManager />}
        {activeTab === 'users' && <UsersManager />}
      </main>
    </div>
  );
}

function AdminNav({ icon, label, active, onClick }: { icon: any; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
        active ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 hover:text-white'
      }`}
    >
      <div className="w-5 h-5 opacity-80">{icon}</div>
      {label}
    </button>
  );
}

function AdminDashboard() {
  return (
    <div className="max-w-6xl">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">System Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <MetricCard title="Active Subscriptions" value="1,248" trend="+12.5%" />
        <MetricCard title="Meals Delivered (Today)" value="3,102" trend="+4.1%" />
        <MetricCard title="Nutritionists Online" value="14" trend="0%" />
        <MetricCard title="Kitchen Load" value="82%" trend="+5%" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Total Revenue (Weekly)" value="$42,850" trend="+8.4%" />
        <MetricCard title="Active Drivers" value="38" trend="+2.0%" />
        <MetricCard title="Customer Churn" value="1.2%" trend="-0.3%" />
        <MetricCard title="Support Tickets" value="23" trend="-15%" />
      </div>

      <div className="bg-white border text-left text-sm border-neutral-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-neutral-100 font-semibold text-slate-900 flex justify-between items-center">
          Recent Signups
        </div>
        <table className="w-full">
          <thead className="bg-neutral-50 text-neutral-500 font-medium">
            <tr>
              <th className="py-3 px-6">Customer</th>
              <th className="py-3 px-6">Plan Selected</th>
              <th className="py-3 px-6">Status</th>
              <th className="py-3 px-6 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            <tr>
              <td className="py-3 px-6 font-medium text-slate-900">Emma Watson</td>
              <td className="py-3 px-6">Keto Weight Loss</td>
              <td className="py-3 px-6"><span className="text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full text-xs font-bold">Active</span></td>
              <td className="py-3 px-6 text-right text-neutral-500">2 mins ago</td>
            </tr>
            <tr>
              <td className="py-3 px-6 font-medium text-slate-900">Liam Neeson</td>
              <td className="py-3 px-6">Vegan Maintenance</td>
              <td className="py-3 px-6"><span className="text-amber-700 bg-amber-50 px-2 py-1 rounded-full text-xs font-bold">Pending Payment</span></td>
              <td className="py-3 px-6 text-right text-neutral-500">1 hr ago</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend }: { title: string; value: string; trend: string }) {
  const isPositive = trend.startsWith('+');
  return (
    <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
      <div className="text-neutral-500 text-sm font-medium mb-2">{title}</div>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <div className={`text-sm font-bold flex items-center ${isPositive ? 'text-emerald-600' : 'text-amber-600'}`}>
          <TrendingUp className="w-4 h-4 mr-1" /> {trend}
        </div>
      </div>
    </div>
  );
}

function MealPlanManager() {
  const [plans, setPlans] = useState([
    { id: 1, name: 'Keto Weight Loss', price: 350, promoted: true, desc: 'High fat, moderate protein, very low carb protocol for steady state ketosis.' },
    { id: 2, name: 'Vegan Maintenance', price: 310, promoted: false, desc: '100% plant-based balanced macros for sustainable energy and weight maintenance.' }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);

  const handleSave = () => {
     setShowModal(false);
     setEditingPlan(null);
     // simplistic mock save
  };

  const togglePromoted = (id: number) => {
    setPlans(plans.map(p => p.id === id ? { ...p, promoted: !p.promoted } : p));
  };

  return (
    <div className="max-w-6xl">
       <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Meal Plans</h2>
        <button onClick={() => { setEditingPlan({}); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700">
          <Plus className="w-4 h-4" /> Create New Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white p-5 rounded-xl border border-rose-200 shadow-sm relative overflow-hidden flex flex-col">
            <div className={`absolute top-0 right-0 w-2 h-full ${plan.promoted ? 'bg-rose-500' : 'bg-neutral-300'}`}></div>
            <div className="flex justify-between items-start mb-2">
               <h3 className="text-lg font-bold">{plan.name}</h3>
               <button onClick={() => togglePromoted(plan.id)} className={`text-xs px-2 py-1 rounded font-bold ${plan.promoted ? 'bg-amber-100 text-amber-700' : 'bg-neutral-100 text-neutral-500'}`}>
                  {plan.promoted ? '★ Promoted' : '☆ Promote'}
               </button>
            </div>
            <p className="text-sm text-neutral-600 mb-4 h-10">{plan.desc}</p>
            <div className="flex justify-between items-center pt-4 mt-auto border-t border-neutral-100">
              <span className="font-bold text-lg">${plan.price}<span className="text-sm text-neutral-500">/wk</span></span>
              <div className="flex gap-2">
                 <button className="text-neutral-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                 <button onClick={() => { setEditingPlan(plan); setShowModal(true); }} className="text-sm text-blue-600 font-medium hover:underline">Edit</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
              <h3 className="text-xl font-bold mb-4">{editingPlan?.id ? 'Edit Plan' : 'Create Plan'}</h3>
              <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-1">Plan Name</label>
                    <input type="text" defaultValue={editingPlan?.name} className="w-full p-2 border border-neutral-200 rounded" />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-1">Description</label>
                    <textarea defaultValue={editingPlan?.desc} className="w-full p-2 border border-neutral-200 rounded"></textarea>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-1">Weekly Price ($)</label>
                    <input type="number" defaultValue={editingPlan?.price} className="w-full p-2 border border-neutral-200 rounded" />
                 </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                 <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded font-bold hover:bg-neutral-50">Cancel</button>
                 <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700">Save</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

function KDSPlanning() {
  const plans = ['Keto Weight Loss', 'Vegan Maintenance'];
  const meals = ['Breakfast', 'Lunch', 'Dinner'];
  const [inputs, setInputs] = useState<{[key: string]: string}>({});

  const handlePush = (plan: string, meal: string) => {
    const dish = inputs[`${plan}-${meal}`];
    if (!dish) {
      alert('Please enter a meal name first');
      return;
    }
    alert(`Pushed "${dish}" to KDS for ${plan} - ${meal}`);
    setInputs(prev => ({...prev, [`${plan}-${meal}`]: ''}));
  };

  return (
    <div className="max-w-6xl">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">KDS Menu Planning</h2>
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        {plans.map((plan, i) => (
          <div key={i} className="border-b border-neutral-100 last:border-0 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">{plan} - Today's Menu</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {meals.map((meal) => (
                 <div key={meal} className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                    <div className="font-bold text-sm text-neutral-500 mb-2">{meal}</div>
                    <input 
                      type="text" 
                      placeholder="Enter meal name..." 
                      value={inputs[`${plan}-${meal}`] || ''}
                      onChange={(e) => setInputs(prev => ({...prev, [`${plan}-${meal}`]: e.target.value}))}
                      className="w-full p-2 mb-2 border border-neutral-200 rounded text-sm font-bold" 
                    />
                    <button onClick={() => handlePush(plan, meal)} className="w-full py-1.5 bg-neutral-800 text-white text-xs font-bold rounded uppercase tracking-widest hover:bg-neutral-700">Push to KDS</button>
                 </div>
               ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeliveryManager() {
  const [drivers, setDrivers] = useState([
     { id: 1, name: 'Jason Smith', status: 'Online', phone: '(555) 123-4567' },
     { id: 2, name: 'Anna Lee', status: 'Offline', phone: '(555) 987-6543' }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState<any>(null);

  const handleSave = () => {
    setShowModal(false);
    setEditingDriver(null);
  };

  const removeDriver = (id: number) => {
    setDrivers(drivers.filter(d => d.id !== id));
  };

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Delivery Fleet</h2>
        <button onClick={() => { setEditingDriver({}); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">
          <Plus className="w-4 h-4" /> Add Driver
        </button>
      </div>
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
         <table className="w-full text-left text-sm">
           <thead className="bg-neutral-50 text-neutral-500 font-medium border-b border-neutral-100">
             <tr>
                <th className="p-4">Driver Name</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-neutral-100">
             {drivers.map(d => (
               <tr key={d.id}>
                 <td className="p-4 font-bold">{d.name}</td>
                 <td className="p-4 text-neutral-600">{d.phone}</td>
                 <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${d.status === 'Online' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'}`}>{d.status}</span>
                 </td>
                 <td className="p-4 text-right">
                    <button onClick={() => { setEditingDriver(d); setShowModal(true); }} className="text-blue-600 font-medium hover:underline text-xs mr-3">Edit</button>
                    <button onClick={() => removeDriver(d.id)} className="text-red-600 font-medium hover:underline text-xs">Remove</button>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
              <h3 className="text-xl font-bold mb-4">{editingDriver?.id ? 'Edit Driver' : 'Add Driver'}</h3>
              <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-1">Name</label>
                    <input type="text" defaultValue={editingDriver?.name} className="w-full p-2 border border-neutral-200 rounded" />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-1">Phone</label>
                    <input type="text" defaultValue={editingDriver?.phone} className="w-full p-2 border border-neutral-200 rounded" />
                 </div>
                 {editingDriver?.id && (
                    <div>
                      <label className="block text-sm font-bold text-neutral-700 mb-1">Status</label>
                      <select className="w-full p-2 border border-neutral-200 rounded">
                        <option>Online</option>
                        <option>Offline</option>
                      </select>
                    </div>
                 )}
              </div>
              <div className="flex justify-end gap-2 mt-6">
                 <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded font-bold hover:bg-neutral-50">Cancel</button>
                 <button onClick={handleSave} className="px-4 py-2 bg-purple-600 text-white rounded font-bold hover:bg-purple-700">Save</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

function NutritionistManager() {
  const [nutritionists, setNutritionists] = useState([
     { id: 1, name: 'Dr. Priya Sharma', patients: 42, reqs: 3 },
     { id: 2, name: 'Dr. Alex Chen', patients: 28, reqs: 0 }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingNutritionist, setEditingNutritionist] = useState<any>(null);

  const handleSave = () => {
    setShowModal(false);
    setEditingNutritionist(null);
  };

  const navigateToPortal = () => {
    window.open('/nutritionist', '_blank');
  };

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Nutritionists</h2>
        <button onClick={() => { setEditingNutritionist({}); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Add Nutritionist
        </button>
      </div>
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
         <table className="w-full text-left text-sm">
           <thead className="bg-neutral-50 text-neutral-500 font-medium border-b border-neutral-100">
             <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Active Patients</th>
                <th className="p-4">Pending Requests</th>
                <th className="p-4 text-right">Actions</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-neutral-100">
             {nutritionists.map(n => (
               <tr key={n.id}>
                 <td className="p-4 font-bold">{n.name}</td>
                 <td className="p-4 text-neutral-600">{n.patients}</td>
                 <td className="p-4">
                    {n.reqs > 0 ? <span className="text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded">{n.reqs} Pending</span> : <span className="text-neutral-400">None</span>}
                 </td>
                 <td className="p-4 text-right">
                    <button onClick={navigateToPortal} className="text-blue-600 font-medium hover:underline text-xs mr-3">View Portal</button>
                    <button onClick={() => { setEditingNutritionist(n); setShowModal(true); }} className="text-blue-600 font-medium hover:underline text-xs mr-3">Edit</button>
                    <button onClick={() => setNutritionists(nutritionists.filter(x => x.id !== n.id))} className="text-red-600 font-medium hover:underline text-xs">Remove</button>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
              <h3 className="text-xl font-bold mb-4">{editingNutritionist?.id ? 'Edit Nutritionist' : 'Add Nutritionist'}</h3>
              <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-1">Name</label>
                    <input type="text" defaultValue={editingNutritionist?.name} className="w-full p-2 border border-neutral-200 rounded" />
                 </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                 <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded font-bold hover:bg-neutral-50">Cancel</button>
                 <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700">Save</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

function UsersManager() {
  const [users, setUsers] = useState([
     { id: 1, name: 'Emma Watson', email: 'emma@example.com', plan: 'Keto Weight Loss', status: 'Active' },
     { id: 2, name: 'Liam Neeson', email: 'liam@example.com', plan: 'Vegan Maintenance', status: 'Pending' }
  ]);
  const [showSubModal, setShowSubModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const handleStatusToggle = () => {
    setUsers(users.map(u => {
      if (u.id === editingUser?.id) {
         return { ...u, status: u.status === 'Active' ? 'Paused' : 'Active' };
      }
      return u;
    }));
    setShowSubModal(false);
    setEditingUser(null);
  };

  const handleCancel = (id: number) => {
    if (confirm("Are you sure you want to cancel this subscription and issue a refund?")) {
      setUsers(users.map(u => u.id === id ? { ...u, status: 'Cancelled' } : u));
    }
  };

  return (
    <div className="max-w-6xl">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Users & Subscriptions</h2>
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
         <table className="w-full text-left text-sm">
           <thead className="bg-neutral-50 text-neutral-500 font-medium border-b border-neutral-100">
             <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Email</th>
                <th className="p-4">Meal Plan</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-neutral-100">
             {users.map(u => (
               <tr key={u.id}>
                 <td className="p-4 font-bold">{u.name}</td>
                 <td className="p-4 text-neutral-600">{u.email}</td>
                 <td className="p-4">{u.plan}</td>
                 <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${u.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : (u.status === 'Cancelled' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700')}`}>{u.status}</span>
                 </td>
                 <td className="p-4 text-right">
                    <button onClick={() => { setEditingUser(u); setShowSubModal(true); }} className="text-blue-600 font-medium hover:underline text-xs mr-3">Manage Sub</button>
                    <button onClick={() => handleCancel(u.id)} className="text-red-600 font-medium hover:underline text-xs">Cancel/Refund</button>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
      </div>

      {showSubModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl text-center">
              <h3 className="text-xl font-bold mb-2">Manage Subscription</h3>
              <p className="text-sm text-neutral-600 mb-6">Customer: {editingUser?.name}</p>
              
              <div className="space-y-3">
                 <button onClick={handleStatusToggle} className="w-full py-3 bg-neutral-100 text-neutral-900 font-bold rounded hover:bg-neutral-200 transition">
                    Toggle Status (Active/Pause)
                 </button>
                 <button onClick={() => setShowSubModal(false)} className="w-full py-3 text-neutral-500 font-bold rounded hover:bg-neutral-50 transition">
                    Nevermind
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
