import { Settings, Users, Activity, Briefcase, Plus, TrendingUp, Shield, Truck, ChefHat, HeartPulse, Edit2, CheckCircle, Trash2, X, Star, FileText, Newspaper } from 'lucide-react';
import { useState, useEffect } from 'react';
import '../../assets/Admin.css'; // Ensure path is correct

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8080';

const getAdminId = () => {
  return localStorage.getItem('token') || '';
};

export function AdminPortal() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'meals' | 'kds' | 'delivery' | 'nutritionists' | 'users' | 'articles'>('dashboard');

  const handleLogout = () => { 
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/admin'; 
  };

  return (
    <div className="admin-page-container flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
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
          <AdminNav icon={<Users />} label="Customer Accounts" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
          <AdminNav icon={<Newspaper />} label="News & Articles" active={activeTab === 'articles'} onClick={() => setActiveTab('articles')} />
        </nav>
      </aside>

      {/* Main Admin View */}
      <main className="admin-main-content">
        {activeTab === 'dashboard' && <AdminDashboard />}
        {activeTab === 'meals' && <MealPlanManager />}
        {activeTab === 'kds' && <KDSPlanning />}
        {activeTab === 'delivery' && <DeliveryManager />}
        {activeTab === 'nutritionists' && <NutritionistManager />}
        {activeTab === 'users' && <UsersManager />}
        {activeTab === 'articles' && <ArticlesManager />}
      </main>
    </div>
  );
}

function AdminNav({ icon, label, active, onClick }: { icon: any; label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`admin-nav-btn ${active ? 'active' : ''}`}>
      <div className="w-5 h-5 opacity-80">{icon}</div>
      {label}
    </button>
  );
}

// ---------------------------------------------------------
// 1. DASHBOARD
// ---------------------------------------------------------
function AdminDashboard() {
  const [metrics, setMetrics] = useState({ users: 0, plans: 0, drivers: 0, nutritionists: 0 });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const adminId = getAdminId();
        const [uRes, pRes, dRes, nRes] = await Promise.all([
          fetch(`${API_BASE}/api/admin/customer_profiles?user_id=${adminId}`),
          fetch(`${API_BASE}/api/admin/meal_plans?user_id=${adminId}`),
          fetch(`${API_BASE}/api/admin/driver_profiles?user_id=${adminId}`),
          fetch(`${API_BASE}/api/admin/nutritionist_profiles?user_id=${adminId}`)
        ]);

        setMetrics({
          users: (await uRes.json()).count || 0,
          plans: (await pRes.json()).count || 0,
          drivers: (await dRes.json()).count || 0,
          nutritionists: (await nRes.json()).count || 0
        });
      } catch (err) { console.error(err); }
    };
    fetchMetrics();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">System Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <MetricCard title="Registered Customers" value={metrics.users.toString()} trend="+12.5%" />
        <MetricCard title="Active Meal Plans" value={metrics.plans.toString()} trend="Live" isPositive={true} />
        <MetricCard title="Nutritionists Online" value={metrics.nutritionists.toString()} trend="+2" />
        <MetricCard title="Delivery Drivers" value={metrics.drivers.toString()} trend="Live" isPositive={true} />
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, isPositive = true }: { title: string; value: string; trend: string, isPositive?: boolean }) {
  return (
    <div className="admin-card p-5">
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

// ---------------------------------------------------------
// 2. MEAL PLAN MANAGER
// ---------------------------------------------------------
function MealPlanManager() {
  const [plans, setPlans] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);

  const fetchPlans = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/meal_plans?user_id=${getAdminId()}`);
      const json = await res.json();
      setPlans(json.data || []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchPlans(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const payload = {
      data: {
        name: formData.get('name'),
        description: formData.get('description'),
        monthlyPrice: parseFloat(formData.get('monthlyPrice') as string),
        imageUrl: formData.get('imageUrl')
      }
    };

    try {
      const url = editingPlan?.id 
        ? `${API_BASE}/api/admin/meal_plans/${editingPlan.id}?user_id=${getAdminId()}` 
        : `${API_BASE}/api/admin/meal_plans?user_id=${getAdminId()}`;
      
      const res = await fetch(url, {
        method: editingPlan?.id ? 'PUT' : 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.detail || "Failed to save plan");
      } else {
        setShowModal(false);
        fetchPlans();
      }
    } catch (err) { alert("Network Error"); }
  };

  const deletePlan = async (id: number) => {
    if (!confirm("Delete this plan forever?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/meal_plans/${id}?user_id=${getAdminId()}`, { method: 'DELETE' });
      if(!res.ok) { const err = await res.json(); alert(err.detail); return; }
      fetchPlans();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="max-w-6xl mx-auto">
       <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Meal Plans</h2>
        <button onClick={() => { setEditingPlan({}); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700">
          <Plus className="w-4 h-4" /> Create New Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="admin-card p-5 border-rose-200 flex flex-col">
            <div className="w-full h-32 mb-4 bg-neutral-100 rounded-lg overflow-hidden shrink-0">
              <img src={plan.imageUrl || 'https://via.placeholder.com/300x150?text=No+Image'} alt={plan.name} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-lg font-bold mb-2">{plan.name}</h3>
            <p className="text-sm text-neutral-600 mb-4 h-10 overflow-hidden line-clamp-2">{plan.description}</p>
            <div className="flex justify-between items-center pt-4 mt-auto border-t border-neutral-100">
              <span className="font-bold text-lg">₹{plan.monthlyPrice}<span className="text-sm text-neutral-500">/mo</span></span>
              <div className="flex gap-3">
                 <button onClick={() => deletePlan(plan.id)} className="text-neutral-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                 <button onClick={() => { setEditingPlan(plan); setShowModal(true); }} className="text-sm text-blue-600 font-bold hover:underline">Edit</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="admin-modal-overlay">
           <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{editingPlan?.id ? 'Edit Plan' : 'Create Plan'}</h3>
                <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-neutral-400"/></button>
              </div>
              <form onSubmit={handleSave} className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
                 <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1">Plan Name</label>
                    <input type="text" name="name" required defaultValue={editingPlan?.name} className="w-full p-2.5 border rounded-lg" />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1">Description</label>
                    <textarea name="description" required defaultValue={editingPlan?.description} className="w-full p-2.5 border rounded-lg h-24"></textarea>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1">Monthly Price (₹)</label>
                    <input type="number" step="0.01" name="monthlyPrice" required defaultValue={editingPlan?.monthlyPrice} className="w-full p-2.5 border rounded-lg" />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1">Image URL</label>
                    <input type="text" name="imageUrl" defaultValue={editingPlan?.imageUrl} placeholder="https://..." className="w-full p-2.5 border rounded-lg text-sm" />
                 </div>
                 <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg font-bold text-neutral-600">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-rose-600 text-white rounded-lg font-bold">Save Plan</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------
// 3. KDS PLANNING (Dynamic)
// ---------------------------------------------------------
function KDSPlanning() {
  const [plans, setPlans] = useState<any[]>([]);
  const meals = ['BREAKFAST', 'LUNCH', 'DINNER'];
  const [inputs, setInputs] = useState<{[key: string]: string}>({});

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/meal_plans?user_id=${getAdminId()}`)
      .then(res => res.json())
      .then(json => setPlans(json.data || []))
      .catch(console.error);
  }, []);

  const handlePush = async (plan: any, mealType: string) => {
    const dish = inputs[`${plan.id}-${mealType}`];
    if (!dish) { alert('Please enter a meal name first'); return; }
    
    try {
      const payload = {
        data: {
          targetDate: new Date().toISOString().split('T')[0],
          mealType: mealType,
          defaultMealName: dish,
          proteinGrams: 25, // Fallback macros if not specified
          carbsGrams: 35,
          fatGrams: 15,
          planId: plan.id
        }
      };

      const res = await fetch(`${API_BASE}/api/admin/daily_menus?user_id=${getAdminId()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.detail || "Failed to push to KDS");
        return;
      }

      alert(`Pushed "${dish}" to Kitchen Display System for ${plan.name} - ${mealType}`);
      setInputs(prev => ({...prev, [`${plan.id}-${mealType}`]: ''}));
    } catch (e) {
      alert("Network Error while pushing to KDS");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">KDS Menu Planning</h2>
      <div className="admin-card overflow-hidden">
        {plans.length === 0 ? <p className="p-6 text-neutral-500">Create Meal Plans first to plan menus.</p> : null}
        {plans.map((plan) => (
          <div key={plan.id} className="border-b border-neutral-100 last:border-0 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">{plan.name} - Today's Menu</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {meals.map((meal) => (
                 <div key={meal} className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                    <div className="font-bold text-sm text-neutral-500 mb-2 uppercase tracking-widest">{meal}</div>
                    <input 
                      type="text" placeholder="Enter meal name..." 
                      value={inputs[`${plan.id}-${meal}`] || ''}
                      onChange={(e) => setInputs(prev => ({...prev, [`${plan.id}-${meal}`]: e.target.value}))}
                      className="w-full p-2.5 mb-3 border border-neutral-200 rounded-lg text-sm font-bold" 
                    />
                    <button onClick={() => handlePush(plan, meal)} className="w-full py-2 bg-slate-900 text-white text-xs font-bold rounded-lg uppercase tracking-widest hover:bg-slate-800">Push to KDS</button>
                 </div>
               ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// 4. DELIVERY FLEET MANAGER
// ---------------------------------------------------------
function DeliveryManager() {
  const [drivers, setDrivers] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/driver_profiles?user_id=${getAdminId()}`)
      .then(res => res.json())
      .then(json => setDrivers(json.data || []))
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Delivery Fleet</h2>
      <div className="admin-card overflow-hidden">
         <table className="w-full text-left text-sm">
           <thead className="bg-neutral-50 text-neutral-500 font-bold uppercase tracking-widest text-xs border-b border-neutral-100">
             <tr>
                <th className="p-4">Driver Name</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Vehicle</th>
                <th className="p-4">Status</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-neutral-100">
             {drivers.length === 0 && (
               <tr><td colSpan={4} className="p-8 text-center text-neutral-400 font-bold">No drivers registered yet.</td></tr>
             )}
             {drivers.map(d => (
               <tr key={d.userId} className="hover:bg-neutral-50">
                 <td className="p-4 font-bold text-slate-900">{d.fullName}</td>
                 <td className="p-4 text-neutral-600">{d.phoneNumber || 'N/A'}</td>
                 <td className="p-4 text-neutral-600">{d.vehicleNumber || 'N/A'}</td>
                 <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-black ${d.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-100 text-neutral-500'}`}>
                      {d.isActive ? 'Online' : 'Offline'}
                    </span>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// 5. NUTRITIONIST MANAGER
// ---------------------------------------------------------
function NutritionistManager() {
  const [nutritionists, setNutritionists] = useState<any[]>([]);

  const fetchNutritionists = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/nutritionist_profiles?user_id=${getAdminId()}`);
      const json = await res.json();
      setNutritionists(json.data || []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchNutritionists(); }, []);

  const handleApprove = async (id: string) => {
    if(!confirm("Verify this nutritionist?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/nutritionists/${id}/approve?user_id=${getAdminId()}`, { method: 'PUT' });
      if(!res.ok) { const err = await res.json(); alert(err.detail); return; }
      fetchNutritionists();
    } catch (e) { console.error(e); }
  };

  const deleteDoctor = async (id: string) => {
    if(!confirm("Remove this nutritionist permanently? This will revoke their access.")) return;
    try {
      // Delete the root USER record to trigger Cascade deletion properly
      const res = await fetch(`${API_BASE}/api/admin/users/${id}?user_id=${getAdminId()}`, { method: 'DELETE' });
      if(!res.ok) { 
        const err = await res.json(); 
        alert(`Deletion Failed:\n${err.detail}`); 
        return; 
      }
      fetchNutritionists();
    } catch(e) { console.error(e); }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Registered Nutritionists</h2>
      <div className="admin-card overflow-hidden">
         <table className="w-full text-left text-sm">
           <thead className="bg-neutral-50 text-neutral-500 font-bold uppercase tracking-widest text-xs border-b border-neutral-100">
             <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Specialty</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-neutral-100">
             {nutritionists.map(n => (
               <tr key={n.userId} className="hover:bg-neutral-50">
                 <td className="p-4 font-bold text-slate-900">{n.fullName}</td>
                 <td className="p-4 text-neutral-600">{n.specialty || 'General'}</td>
                 <td className="p-4 text-neutral-600 font-mono text-xs">{n.phoneNumber || 'N/A'}</td>
                 <td className="p-4">
                    {n.isApproved ? (
                      <span className="text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full text-[10px] uppercase font-black">Approved</span>
                    ) : (
                      <span className="text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-[10px] uppercase font-black">Pending</span>
                    )}
                 </td>
                 <td className="p-4 text-right">
                    {!n.isApproved && (
                      <button onClick={() => handleApprove(n.userId)} className="text-emerald-600 font-bold hover:underline text-xs mr-4 uppercase tracking-wider">Verify</button>
                    )}
                    <button onClick={() => deleteDoctor(n.userId)} className="text-red-600 font-bold hover:underline text-xs uppercase tracking-wider">Remove</button>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// 6. USERS MANAGER (Safe Parsing Fix)
// ---------------------------------------------------------
function UsersManager() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/admin/customer_profiles?user_id=${getAdminId()}`);
        const json = await res.json();
        setUsers(json.data || []);
      } catch (e) { console.error(e); }
    };
    fetchUsers();
  }, []);

  const safeRenderTags = (tags: any) => {
    if (!tags) return "Standard";
    let parsedTags = [];
    if (Array.isArray(tags)) {
      parsedTags = tags;
    } else if (typeof tags === 'string') {
      try { parsedTags = JSON.parse(tags); } 
      catch (e) { parsedTags = [tags]; }
    }
    if (parsedTags.length === 0) return "Standard";
    return parsedTags.join(', ');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Customer Accounts</h2>
      <div className="admin-card overflow-hidden">
         <table className="w-full text-left text-sm">
           <thead className="bg-neutral-50 text-neutral-500 font-bold uppercase tracking-widest text-xs border-b border-neutral-100">
             <tr>
                <th className="p-4">Customer Name</th>
                <th className="p-4">User ID</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Dietary Tags</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-neutral-100">
             {users.length === 0 && (
               <tr><td colSpan={4} className="p-8 text-center text-neutral-400 font-bold">No customers found.</td></tr>
             )}
             {users.map(u => (
               <tr key={u.userId} className="hover:bg-neutral-50">
                 <td className="p-4 font-bold text-slate-900">{u.fullName}</td>
                 <td className="p-4 text-neutral-500 font-mono text-xs">{u.userId}</td>
                 <td className="p-4 text-neutral-600">{u.phoneNumber || 'N/A'}</td>
                 <td className="p-4">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest">
                      {safeRenderTags(u.dietaryTags)}
                    </span>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// 7. ARTICLES & NEWS MANAGER (New Component)
// ---------------------------------------------------------
function ArticlesManager() {
  const [articles, setArticles] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null);

  const fetchArticles = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/articles?user_id=${getAdminId()}`);
      const json = await res.json();
      setArticles(json.data || []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchArticles(); }, []);

  // Inside AdminPortal.tsx -> ArticlesManager component

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    // FIX: Format the date cleanly for the SQL Database (Removes 'T' and 'Z')
    const sqlFriendlyDate = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const payload = {
      data: {
        headline: formData.get('headline'),
        content: formData.get('content'),
        source: formData.get('source') || "ZyaeL Media",
        link: formData.get('link') || null, // FIX: Pass null instead of empty string
        imageUrl: formData.get('imageUrl') || null, // FIX: Pass null instead of empty string
        publishedDate: sqlFriendlyDate
      }
    };

    try {
      const url = editingArticle?.id 
        ? `${API_BASE}/api/admin/articles/${editingArticle.id}?user_id=${getAdminId()}` 
        : `${API_BASE}/api/admin/articles?user_id=${getAdminId()}`;
      
      const res = await fetch(url, {
        method: editingArticle?.id ? 'PUT' : 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.detail || "Failed to save article");
      } else {
        setShowModal(false);
        fetchArticles();
      }
    } catch (err) { 
      alert("Network Error"); 
    }
  };

  const deleteArticle = async (id: string) => {
    if (!confirm("Delete this article?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/articles/${id}?user_id=${getAdminId()}`, { method: 'DELETE' });
      if(!res.ok) { const err = await res.json(); alert(err.detail); return; }
      fetchArticles();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="max-w-6xl mx-auto">
       <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">News & Articles</h2>
        <button onClick={() => { setEditingArticle({}); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700">
          <Plus className="w-4 h-4" /> Publish Article
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.length === 0 && <p className="text-neutral-500 font-bold p-4">No articles published yet.</p>}
        {articles.map((article) => (
          <div key={article.id} className="admin-card p-5 border-rose-200 flex flex-col">
            <div className="w-full h-40 mb-4 bg-neutral-100 rounded-lg overflow-hidden shrink-0 border border-neutral-200">
              <img src={article.imageUrl || 'https://via.placeholder.com/400x200?text=News'} alt={article.headline} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-lg font-bold mb-2">{article.headline}</h3>
            <p className="text-sm text-neutral-600 mb-4 h-10 overflow-hidden line-clamp-2">{article.content}</p>
            <div className="flex justify-between items-center pt-4 mt-auto border-t border-neutral-100">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{new Date(article.createdAt).toLocaleDateString()}</span>
              <div className="flex gap-3">
                 <button onClick={() => deleteArticle(article.id)} className="text-neutral-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                 <button onClick={() => { setEditingArticle(article); setShowModal(true); }} className="text-sm text-blue-600 font-bold hover:underline">Edit</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="admin-modal-overlay">
           <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{editingArticle?.id ? 'Edit Article' : 'Draft Article'}</h3>
                <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-neutral-400"/></button>
              </div>
              <form onSubmit={handleSave} className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
                 <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1">Headline</label>
                    <input type="text" name="headline" required defaultValue={editingArticle?.headline} className="w-full p-2.5 border rounded-lg" />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1">Article Content</label>
                    <textarea name="content" required defaultValue={editingArticle?.content} className="w-full p-2.5 border rounded-lg h-32"></textarea>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1">Image URL</label>
                    <input type="text" name="imageUrl" defaultValue={editingArticle?.imageUrl} className="w-full p-2.5 border rounded-lg text-sm" />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1">Source / Author (Optional)</label>
                    <input type="text" name="source" defaultValue={editingArticle?.source} className="w-full p-2.5 border rounded-lg text-sm" />
                 </div>
                 <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg font-bold text-neutral-600">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-rose-600 text-white rounded-lg font-bold">Publish</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}