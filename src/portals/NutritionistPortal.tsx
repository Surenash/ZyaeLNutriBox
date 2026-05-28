import { Users, FileText, Video, Calendar, Search, X, Plus, Trash2, Edit2, Download } from 'lucide-react';
import { useState } from 'react';

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
           <div className="bg-blue-100 p-1.5 rounded-lg text-blue-600"><Users className="w-5 h-5" /></div>
           Nutritionist Panel
        </div>
        <button onClick={handleLogout} className="text-sm font-semibold text-neutral-500 hover:text-neutral-900 transition-colors">
          Sign Out
        </button>
      </header>
      <div className="flex-1 bg-neutral-50 flex flex-col md:flex-row overflow-hidden">
      {/* Patient List */}
      <div className="w-full md:w-80 bg-white border-r border-neutral-200 flex flex-col">
        <div className="p-4 border-b border-neutral-200">
          <h2 className="font-bold tracking-tight mb-4">My Clients</h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search clients..." 
              className="w-full pl-9 pr-4 py-2 bg-neutral-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {customers.map(c => (
            <button 
              key={c.name}
              onClick={() => setActiveCustomer(c.name)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                activeCustomer === c.name ? 'bg-blue-50 border border-blue-200' : 'hover:bg-neutral-100 border border-transparent'
              }`}
            >
              <div className="font-semibold text-neutral-900">{c.name}</div>
              <div className="text-xs text-neutral-600 mt-1">{c.plan}</div>
              <div className="text-xs text-blue-600 mt-2 flex items-center gap-1 font-medium">
                <Calendar className="w-3 h-3" /> {c.nextAppt}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Client Detail */}
      <div className="flex-1 bg-neutral-50 overflow-y-auto p-6">
        {activeCustomer ? (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight text-neutral-900">{activeCustomer}</h1>
              <div className="flex gap-2">
                <button onClick={() => alert("Calendar scheduler opened")} className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm font-medium hover:bg-neutral-50 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Schedule
                </button>
                <button onClick={() => alert("Opening Zoom room...")} className="px-4 py-2 bg-blue-600 border border-transparent text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                  <Video className="w-4 h-4" /> Launch Zoom
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Intake Form Data */}
              <div className="bg-white p-6 rounded-2xl border border-neutral-200">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-blue-600" /> Intake Form & Vitals
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-neutral-500">Age:</span>
                      <div className="font-medium">32</div>
                    </div>
                    <div>
                      <span className="text-neutral-500">Starting Weight:</span>
                      <div className="font-medium">210 lbs</div>
                    </div>
                    <div>
                      <span className="text-neutral-500">Current Weight:</span>
                      <div className="font-medium">195 lbs</div>
                    </div>
                    <div>
                      <span className="text-neutral-500">Target Goal:</span>
                      <div className="font-medium">185 lbs</div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-neutral-100">
                    <span className="text-neutral-500 text-sm block mb-1">Allergies/Preferences:</span>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-rose-100 text-rose-700 text-xs font-semibold rounded">No Tree Nuts</span>
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded">Gluten Sensitivity</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meal Plan Config */}
              <div className="bg-white p-6 rounded-2xl border border-neutral-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" /> Active Protocol
                  </h3>
                  <button onClick={() => setShowEditPlanModal(true)} className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
                     <Edit2 className="w-3 h-3"/> Edit Plan
                  </button>
                </div>
                <div className="p-4 bg-neutral-50 rounded-xl mb-4">
                  <div className="font-bold text-lg">{planName}</div>
                  <div className="text-sm text-neutral-600">3 Meals / Day • Auto-renews 15th</div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-neutral-500">Target Calories</span>
                    <span className="font-bold">{planCals} kcal</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-neutral-500">Protein</span>
                    <span className="font-bold">{planProtein}g</span>
                  </div>
                   <div className="flex justify-between items-center text-sm">
                    <span className="text-neutral-500">Carbs</span>
                    <span className="font-bold">{planCarbs}g</span>
                  </div>
                   <div className="flex justify-between items-center text-sm">
                    <span className="text-neutral-500">Fat</span>
                    <span className="font-bold">{planFat}g</span>
                  </div>
                </div>
              </div>

              {/* Documents & Files */}
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 md:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" /> Patient Files & Reports
                  </h3>
                  <button onClick={() => setShowDocsModal(true)} className="text-sm border border-blue-200 bg-blue-50 text-blue-600 px-3 py-1.5 font-bold rounded-lg hover:bg-blue-100 flex items-center gap-2">
                     <Plus className="w-4 h-4"/> Upload File
                  </button>
                </div>
                <div className="space-y-2">
                   <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded flex items-center justify-center shrink-0"><FileText className="w-5 h-5"/></div>
                         <div>
                            <p className="font-bold text-sm text-neutral-900">Blood Work - Oct 2026.pdf</p>
                            <p className="text-xs text-neutral-500 mt-1">Uploaded by patient 2 days ago</p>
                         </div>
                      </div>
                      <div className="flex gap-2">
                         <button className="text-neutral-400 hover:text-blue-500 p-2"><Download className="w-4 h-4" /></button>
                      </div>
                   </div>
                   <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded flex items-center justify-center shrink-0"><FileText className="w-5 h-5"/></div>
                         <div>
                            <p className="font-bold text-sm text-neutral-900">Consult Notes - Initial.txt</p>
                            <p className="text-xs text-neutral-500 mt-1">Added by you on Oct 10th</p>
                         </div>
                      </div>
                      <div className="flex gap-2">
                         <button className="text-neutral-400 hover:text-blue-500 p-2"><Download className="w-4 h-4" /></button>
                         <button className="text-neutral-400 hover:text-red-500 p-2"><Trash2 className="w-4 h-4" /></button>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-neutral-500">Select a client to view details</div>
        )}
      </div>
      </div>

      {/* Modals */}
      {showEditPlanModal && (
        <div className="fixed inset-0 bg-neutral-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-neutral-900">Edit Meal Plan</h3>
              <button onClick={() => setShowEditPlanModal(false)} className="text-neutral-400 hover:text-neutral-900"><X className="w-6 h-6" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Protocol Name</label>
                <input type="text" value={planName} onChange={(e) => setPlanName(e.target.value)} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-neutral-900 focus:outline-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Calories (kcal)</label>
                  <input type="number" value={planCals} onChange={(e) => setPlanCals(e.target.value)} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-neutral-900 focus:outline-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Protein (g)</label>
                  <input type="number" value={planProtein} onChange={(e) => setPlanProtein(e.target.value)} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-neutral-900 focus:outline-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Carbs (g)</label>
                  <input type="number" value={planCarbs} onChange={(e) => setPlanCarbs(e.target.value)} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-neutral-900 focus:outline-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Fat (g)</label>
                  <input type="number" value={planFat} onChange={(e) => setPlanFat(e.target.value)} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-neutral-900 focus:outline-blue-500" />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                 <button onClick={() => setShowEditPlanModal(false)} className="flex-1 py-3 bg-neutral-100 text-neutral-700 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-neutral-200 transition">Cancel</button>
                 <button onClick={() => setShowEditPlanModal(false)} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-blue-700 transition">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDocsModal && (
        <div className="fixed inset-0 bg-neutral-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-neutral-900">Upload File</h3>
              <button onClick={() => setShowDocsModal(false)} className="text-neutral-400 hover:text-neutral-900"><X className="w-6 h-6" /></button>
            </div>
            <div className="space-y-4 text-center">
              <div className="w-full py-8 border-2 border-dashed border-neutral-200 rounded-xl bg-neutral-50 flex flex-col items-center justify-center cursor-pointer hover:border-blue-300 transition-colors">
                 <FileText className="w-8 h-8 text-neutral-400 mb-2" />
                 <span className="text-sm font-bold text-neutral-600">Click to browse or drag file here</span>
                 <span className="text-xs text-neutral-400 mt-1">PDF, JPG, PNG up to 10MB</span>
              </div>
              <div>
                <label className="block text-left text-sm font-bold text-neutral-700 mb-2">Internal Note (Optional)</label>
                <textarea rows={3} placeholder="Add a note about this document..." className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-medium text-neutral-900 resize-none focus:outline-blue-500"></textarea>
              </div>
              <button onClick={() => { setShowDocsModal(false); alert("File uploaded successfully"); }} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-blue-700 transition">
                 Upload Document
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
