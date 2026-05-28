import { Users, FileText, Video, Calendar, Search, X, Plus, Trash2, Edit2, Download, Activity, Clock, TrendingUp, Target } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';

const viewportConfig = { once: true, margin: "-100px" };

export function NutritionistPortal() {
  const [activeCustomer, setActiveCustomer] = useState<string | null>('John Doe');
  const [showEditPlanModal, setShowEditPlanModal] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);

  // Plan state
  const [planCals, setPlanCals] = useState("1800");
  const [planProtein, setPlanProtein] = useState("120");
  const [planCarbs, setPlanCarbs] = useState("80");
  const [planFat, setPlanFat] = useState("65");
  const [planName, setPlanName] = useState("Keto Weight Loss");

  const customers = [
    { name: 'John Doe', plan: 'Keto Weight Loss', nextAppt: 'Tomorrow, 10:00 AM' },
    { name: 'Sarah Smith', plan: 'Vegan Maintenance', nextAppt: 'Thursday, 2:30 PM' },
    { name: 'Mike Johnson', plan: 'High Protein Build', nextAppt: 'Unscheduled' },
  ];

  const handleLogout = () => { window.location.href = '/_logout'; setTimeout(() => window.location.href = '/management', 10); };

  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans bg-neutral-50">
      <header className="bg-white border-b border-neutral-200 h-16 flex items-center justify-between px-4 sm:px-6 shrink-0">
        <div className="font-bold text-xl text-neutral-900 flex items-center gap-2">
           <div className="bg-blue-600 p-1.5 rounded-lg text-white shadow-lg shadow-blue-900/20"><Users className="w-5 h-5" /></div>
           Nutritionist Portal
        </div>
        <button onClick={handleLogout} className="text-xs font-black uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors">
          Sign Out
        </button>
      </header>
      
      <div className="flex-1 bg-neutral-50 flex flex-col md:flex-row overflow-hidden">
        {/* Patient List */}
        <aside className="w-full md:w-80 bg-white border-r border-neutral-200 flex flex-col shrink-0">
          <div className="p-6 border-b border-neutral-100">
            <h2 className="font-black text-xs uppercase tracking-[0.2em] text-neutral-400 mb-4">My Patient Registry</h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300" />
              <input 
                type="text" 
                placeholder="Search patients..." 
                className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 border border-neutral-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none font-medium"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {customers.map(c => (
              <button 
                key={c.name}
                onClick={() => setActiveCustomer(c.name)}
                className={`w-full text-left p-4 rounded-[20px] transition-all duration-300 ${
                  activeCustomer === c.name ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/20 translate-x-2' : 'hover:bg-neutral-50 text-neutral-600'
                }`}
              >
                <div className="font-black text-sm uppercase tracking-tight">{c.name}</div>
                <div className={`text-[10px] font-bold uppercase tracking-widest mt-1 opacity-70 ${activeCustomer === c.name ? 'text-blue-100' : 'text-neutral-400'}`}>{c.plan}</div>
                <div className={`text-[10px] mt-3 flex items-center gap-1.5 font-black uppercase tracking-widest ${activeCustomer === c.name ? 'text-white' : 'text-blue-600'}`}>
                  <Calendar className="w-3 h-3" /> {c.nextAppt}
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Client Detail */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-neutral-50/50">
          {activeCustomer ? (
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-2 block">Patient Overview</span>
                   <h1 className="text-4xl font-black tracking-tighter text-neutral-900 uppercase">{activeCustomer}</h1>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => alert("Calendar scheduler opened")} className="px-6 py-3 bg-white border border-neutral-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-neutral-50 flex items-center gap-2 shadow-sm transition-all active:scale-95">
                    <Calendar className="w-4 h-4" /> Schedule
                  </button>
                  <button onClick={() => alert("Opening Secure Zoom Consultation...")} className="px-8 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 flex items-center gap-2 shadow-xl shadow-blue-900/20 transition-all active:scale-95">
                    <Video className="w-4 h-4" /> Launch Call
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Vitals Card */}
                <div className="bg-white p-8 rounded-[32px] border border-neutral-200 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-[64px] -z-10 transition-colors group-hover:bg-blue-100" />
                  <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-8 text-neutral-900">
                    <Activity className="w-4 h-4 text-blue-600" /> Clinical Vitals
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                     <div>
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Current Weight</p>
                        <p className="text-2xl font-black text-neutral-900 tracking-tighter">195 <span className="text-xs text-neutral-400 font-bold uppercase">lbs</span></p>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Target Goal</p>
                        <p className="text-2xl font-black text-emerald-600 tracking-tighter">185 <span className="text-xs text-neutral-400 font-bold uppercase">lbs</span></p>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Start Weight</p>
                        <p className="text-xl font-bold text-neutral-400 tracking-tighter">210 lbs</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Age / Sex</p>
                        <p className="text-xl font-bold text-neutral-900 tracking-tighter">32 / M</p>
                     </div>
                  </div>
                </div>

                {/* Weight Trend Simulation */}
                <div className="bg-white p-8 rounded-[32px] border border-neutral-200 shadow-sm flex flex-col lg:col-span-2">
                   <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-8 text-neutral-900">
                      <TrendingUp className="w-4 h-4 text-emerald-600" /> Progress Curve
                   </h3>
                   <div className="flex-1 flex items-end justify-between gap-4 h-32 px-4">
                      {[210, 208, 205, 203, 198, 195].map((val, i) => (
                         <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                            <div className="text-[10px] font-black text-neutral-300 group-hover:text-blue-600 transition-colors">{val}</div>
                            <motion.div 
                               initial={{ height: 0 }}
                               animate={{ height: `${(val / 210) * 100}%` }}
                               transition={{ delay: i * 0.1, duration: 1 }}
                               className="w-full bg-neutral-100 rounded-t-xl group-hover:bg-blue-600 transition-all duration-500 cursor-help relative"
                            >
                               {i === 5 && <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>}
                            </motion.div>
                         </div>
                      ))}
                   </div>
                </div>

                {/* Active Protocol */}
                <div className="bg-white p-8 rounded-[32px] border border-neutral-200 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-neutral-900">
                      <Target className="w-4 h-4 text-blue-600" /> Active Protocol
                    </h3>
                    <button onClick={() => setShowEditPlanModal(true)} className="p-2 bg-neutral-50 rounded-lg text-blue-600 hover:bg-blue-100 transition-all">
                       <Edit2 className="w-4 h-4"/>
                    </button>
                  </div>
                  <div className="bg-neutral-50 p-6 rounded-[24px] mb-8 border border-neutral-100">
                    <div className="font-black text-xl text-neutral-900 mb-1">{planName}</div>
                    <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Macro-Balanced • Tier 1</div>
                  </div>
                  <div className="space-y-4">
                    <MacroRow label="Calories" value={`${planCals} kcal`} color="bg-emerald-500" />
                    <MacroRow label="Protein" value={`${planProtein}g`} color="bg-blue-500" />
                    <MacroRow label="Carbs" value={`${planCarbs}g`} color="bg-amber-500" />
                    <MacroRow label="Fat" value={`${planFat}g`} color="bg-rose-500" />
                  </div>
                </div>

                {/* Files & History */}
                <div className="lg:col-span-2 space-y-8">
                   <div className="bg-white p-8 rounded-[32px] border border-neutral-200 shadow-sm">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-neutral-900">
                          <FileText className="w-4 h-4 text-blue-600" /> Patient Documentation
                        </h3>
                        <button onClick={() => setShowDocsModal(true)} className="text-[10px] font-black uppercase tracking-widest border-2 border-blue-100 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300">
                           Upload File
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <FileCard name="Blood Work - Oct 2026.pdf" meta="Uploaded by patient • 2d ago" type="pdf" />
                         <FileCard name="Initial Consultation.txt" meta="Added by you • Oct 10th" type="text" />
                      </div>
                   </div>

                   <div className="bg-white p-8 rounded-[32px] border border-neutral-200 shadow-sm">
                      <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-8 text-neutral-900">
                        <Clock className="w-4 h-4 text-amber-600" /> Recent Activity Logs
                      </h3>
                      <div className="space-y-6">
                         {[
                            { type: 'Meal Log', desc: 'Patient logged Breakfast: Keto Avocado Toast', time: '2 hours ago', compliant: true },
                            { type: 'Vitals', desc: 'Daily weight check: 195.2 lbs (-0.4)', time: 'Yesterday', compliant: true },
                            { type: 'Alert', desc: 'Missed Lunch log entry', time: 'Oct 12', compliant: false }
                         ].map((log, i) => (
                            <div key={i} className="flex gap-6 items-start">
                               <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 shadow-lg ${log.compliant ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-rose-500 shadow-rose-500/20'}`}></div>
                               <div className="flex-1">
                                  <div className="flex justify-between items-center mb-1">
                                     <span className="font-black text-sm text-neutral-900 uppercase tracking-tight">{log.type}</span>
                                     <span className="text-[10px] font-black text-neutral-300 uppercase tracking-widest">{log.time}</span>
                                  </div>
                                  <p className="text-sm font-medium text-neutral-500">{log.desc}</p>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-neutral-400 font-black uppercase tracking-widest text-xs animate-pulse">Select a patient to begin clinical review</div>
          )}
        </main>
      </div>

      {/* Modals */}
      {showEditPlanModal && (
        <div className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[40px] max-w-lg w-full p-10 shadow-2xl border border-neutral-100">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-neutral-900 uppercase tracking-tighter">Edit Protocol</h3>
              <button onClick={() => setShowEditPlanModal(false)} className="text-neutral-300 hover:text-neutral-900 transition-colors"><X className="w-8 h-8" /></button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-3">Protocol Identity</label>
                <input type="text" value={planName} onChange={(e) => setPlanName(e.target.value)} className="w-full px-5 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl font-black text-neutral-900 focus:outline-blue-500 shadow-inner" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <PlanInput label="Calories (kcal)" value={planCals} setter={setPlanCals} />
                <PlanInput label="Protein (g)" value={planProtein} setter={setPlanProtein} />
                <PlanInput label="Carbs (g)" value={planCarbs} setter={setPlanCarbs} />
                <PlanInput label="Fat (g)" value={planFat} setter={setPlanFat} />
              </div>
              <div className="pt-8 flex gap-4">
                 <button onClick={() => setShowEditPlanModal(false)} className="flex-1 py-4 bg-neutral-50 text-neutral-500 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-neutral-100 transition-all">Discard</button>
                 <button onClick={() => setShowEditPlanModal(false)} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 shadow-xl shadow-blue-900/30 transition-all active:scale-95">Save Changes</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {showDocsModal && (
        <div className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[40px] max-w-md w-full p-10 shadow-2xl border border-neutral-100">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-neutral-900 uppercase tracking-tighter">Clinical Upload</h3>
              <button onClick={() => setShowDocsModal(false)} className="text-neutral-300 hover:text-neutral-900 transition-colors"><X className="w-8 h-8" /></button>
            </div>
            <div className="space-y-8 text-center">
              <div className="w-full py-12 border-4 border-dashed border-neutral-50 rounded-[32px] bg-neutral-50/50 flex flex-col items-center justify-center cursor-pointer hover:border-blue-100 hover:bg-blue-50 transition-all duration-500 group">
                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-xl group-hover:scale-110 transition-transform">
                    <FileText className="w-8 h-8 text-blue-300" />
                 </div>
                 <span className="text-xs font-black text-neutral-400 uppercase tracking-widest">Drop patient records here</span>
              </div>
              <button onClick={() => { setShowDocsModal(false); alert("File uploaded successfully"); }} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 shadow-2xl shadow-blue-900/30 transition-all active:scale-95">
                 Finalize Upload
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}

function MacroRow({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-100 shadow-sm">
       <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${color}`}></div>
          <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{label}</span>
       </div>
       <span className="font-black text-neutral-900 text-sm tracking-tight">{value}</span>
    </div>
  );
}

function FileCard({ name, meta, type }: { name: string, meta: string, type: 'pdf' | 'text' }) {
  return (
    <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100 hover:bg-white hover:shadow-xl transition-all duration-500 group cursor-pointer border-transparent hover:border-neutral-100">
       <div className="flex items-center gap-4 min-w-0">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${type === 'pdf' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
             <FileText className="w-6 h-6"/>
          </div>
          <div className="min-w-0">
             <p className="font-black text-neutral-900 text-xs truncate uppercase tracking-tight">{name}</p>
             <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">{meta}</p>
          </div>
       </div>
       <Download className="w-4 h-4 text-neutral-300 group-hover:text-blue-600 transition-colors" />
    </div>
  );
}

function PlanInput({ label, value, setter }: { label: string, value: string, setter: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2 px-1">{label}</label>
      <input type="number" value={value} onChange={(e) => setter(e.target.value)} className="w-full px-5 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl font-black text-neutral-900 focus:outline-blue-500 shadow-inner" />
    </div>
  );
}
