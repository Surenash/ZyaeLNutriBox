import { Users, FileText, Video, Calendar, Search, X, Edit2, Download, Activity, Clock, TrendingUp, Target, CheckCircle, XCircle, User, Save, Check, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import '../../assets/Nutritionist.css'; // Import the new CSS file

// Dynamically pull from .env, fallback to localhost if missing
const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8080';

const getUserId = () => {
  return localStorage.getItem('token') || '';
};

const viewportConfig = { once: true, margin: "-100px" };

export function NutritionistPortal() {
  const [activeTab, setActiveTab] = useState<'patients' | 'schedule' | 'profile'>('patients');
  const [activeCustomerId, setActiveCustomerId] = useState<string | null>(null);

  // Dynamic Data State
  const [profile, setProfile] = useState<any>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => { 
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/nutritionist'; 
  };

  const fetchData = async () => {
    const userId = getUserId();
    try {
      // Fetch everything dynamically
      const [profileRes, patientsRes, consultsRes] = await Promise.all([
        fetch(`${API_BASE}/api/nutritionist/profile?user_id=${userId}`),
        fetch(`${API_BASE}/api/nutritionist/patients?user_id=${userId}`),
        fetch(`${API_BASE}/api/nutritionist/consultations?user_id=${userId}`)
      ]);

      if (profileRes.ok) setProfile(await profileRes.json());
      
      if (patientsRes.ok && consultsRes.ok) {
        const pData = await patientsRes.json();
        const cData = await consultsRes.json();
        setPatients(pData);
        setConsultations(cData);
        if (pData.length > 0 && !activeCustomerId) {
          setActiveCustomerId(pData[0].customerId);
        }
      }
    } catch (err) {
      console.error("Failed to fetch nutritionist data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="nutri-page-container">
      <header className="nutri-header">
        <div className="font-bold text-xl text-neutral-900 flex items-center gap-2">
           <div className="bg-emerald-600 p-1.5 rounded-lg text-white shadow-lg shadow-emerald-900/20">
             <Users className="w-5 h-5" />
           </div>
           Nutritionist Portal
        </div>
        <div className="flex items-center gap-4">
          {profile && (
            <span className={`nutri-status-badge ${profile.isApproved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              {profile.isApproved ? 'Verified' : 'Pending Verification'}
            </span>
          )}
          <button onClick={handleLogout} className="text-xs font-black uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors">
            Sign Out
          </button>
        </div>
      </header>
      
      {/* Dynamic Warning Banner for unapproved nutritionists */}
      {!loading && profile && !profile.isApproved && (
        <div className="nutri-warning-banner">
          <AlertCircle className="w-4 h-4" />
          Your account is pending Admin Verification. You cannot approve patient consultations until verified.
        </div>
      )}
      
      <div className="flex-1 bg-neutral-50 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 nutri-sidebar p-4 md:flex flex-col gap-2 overflow-y-auto hidden">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 px-3 mt-2">
            Navigation
          </div>
          <NavItem icon={<Users />} label="My Patients" isActive={activeTab === 'patients'} onClick={() => setActiveTab('patients')} />
          <NavItem icon={<Calendar />} label="Schedule & Requests" isActive={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} />
          <NavItem icon={<User />} label="My Profile" isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeTab === 'patients' && (
                <PatientDashboard 
                  patients={patients} 
                  consultations={consultations} 
                  activeCustomerId={activeCustomerId} 
                  setActiveCustomerId={setActiveCustomerId} 
                  loading={loading} 
                  isApproved={profile?.isApproved}
                />
              )}
              {activeTab === 'schedule' && (
                <ScheduleView 
                  consultations={consultations} 
                  patients={patients} 
                  refreshData={fetchData} 
                  isApproved={profile?.isApproved}
                />
              )}
              {activeTab === 'profile' && (
                <ProfileView profile={profile} refreshProfile={fetchData} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-neutral-200 py-3 pb-5 flex justify-evenly items-center z-50 shadow-2xl">
        <button onClick={() => setActiveTab('patients')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'patients' ? 'text-emerald-600' : 'text-neutral-400 hover:text-emerald-600'}`}>
          <Users className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Patients</span>
        </button>
        <button onClick={() => setActiveTab('schedule')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'schedule' ? 'text-emerald-600' : 'text-neutral-400 hover:text-emerald-600'}`}>
          <Calendar className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Schedule</span>
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

// ------------------------------------------
// 1. PATIENT DASHBOARD (Dynamic Views)
// ------------------------------------------
function PatientDashboard({ patients, consultations, activeCustomerId, setActiveCustomerId, loading, isApproved }: any) {
  const activePatient = patients.find((p: any) => p.customerId === activeCustomerId);
  
  return (
    <div className="flex h-full">
      {/* Patient List */}
      <div className="w-80 bg-white border-r border-neutral-200 flex flex-col shrink-0 hidden lg:flex">
        <div className="p-6 border-b border-neutral-100">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300" />
            <input 
              type="text" 
              placeholder="Search patients..." 
              className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 border border-neutral-100 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none font-medium"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {loading ? (
            <div className="text-center p-4 text-neutral-400 text-xs font-bold animate-pulse">Loading patients...</div>
          ) : patients.length === 0 ? (
            <div className="text-center p-4 text-neutral-400 text-xs font-bold">No patients assigned yet.</div>
          ) : (
            patients.map((c: any) => (
              <button 
                key={c.customerId}
                onClick={() => setActiveCustomerId(c.customerId)}
                className={`w-full text-left p-4 rounded-[20px] transition-all duration-300 ${
                  activeCustomerId === c.customerId ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/20 translate-x-2' : 'hover:bg-neutral-50 text-neutral-600'
                }`}
              >
                <div className="font-black text-sm uppercase tracking-tight truncate">{c.fullName}</div>
                <div className={`text-[10px] font-bold uppercase tracking-widest mt-1 opacity-70 ${activeCustomerId === c.customerId ? 'text-emerald-100' : 'text-neutral-400'}`}>
                  {c.dietaryTags?.length ? c.dietaryTags.join(', ') : 'Standard Protocol'}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Clinical Details (Dynamic checks for data) */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-neutral-50/50 pb-32">
        {activePatient ? (
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-2 block">Patient Overview • {activePatient.customerId.split('-')[1]}</span>
                 <h1 className="text-4xl font-black tracking-tighter text-neutral-900 uppercase">{activePatient.fullName}</h1>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Dynamic Vitals Card */}
              <div className="nutri-card group">
                <div className="nutri-card-accent" />
                <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-8 text-neutral-900 relative z-10">
                  <Activity className="w-4 h-4 text-emerald-600" /> Clinical Vitals
                </h3>
                
                {activePatient.vitals ? (
                  <div className="grid grid-cols-2 gap-6 relative z-10">
                     <div>
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Current Weight</p>
                        <p className="text-2xl font-black text-neutral-900 tracking-tighter">{activePatient.vitals.currentWeight} <span className="text-xs text-neutral-400 font-bold uppercase">lbs</span></p>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Target Goal</p>
                        <p className="text-2xl font-black text-emerald-600 tracking-tighter">{activePatient.vitals.targetWeight} <span className="text-xs text-neutral-400 font-bold uppercase">lbs</span></p>
                     </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-neutral-400 text-xs font-bold relative z-10">
                    No vitals recorded by patient yet.
                  </div>
                )}
              </div>

              {/* Dynamic Weight Trend */}
              <div className="nutri-card flex flex-col lg:col-span-2 group">
                 <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-8 text-neutral-900">
                    <TrendingUp className="w-4 h-4 text-emerald-600" /> Progress Curve
                 </h3>
                 {activePatient.weightHistory && activePatient.weightHistory.length > 0 ? (
                   <div className="flex-1 flex items-end justify-between gap-4 h-32 px-4">
                      {activePatient.weightHistory.map((val: number, i: number) => (
                         <div key={i} className="flex-1 flex flex-col items-center gap-3">
                            <div className="text-[10px] font-black text-neutral-300">{val}</div>
                            <div className="w-full bg-emerald-600 rounded-t-xl transition-all duration-500 relative" style={{ height: `${(val / Math.max(...activePatient.weightHistory)) * 100}%` }}></div>
                         </div>
                      ))}
                   </div>
                 ) : (
                   <div className="flex-1 flex items-center justify-center text-neutral-400 text-xs font-bold">
                     Insufficient data points to generate curve.
                   </div>
                 )}
              </div>

              {/* Dynamic Active Protocol */}
              <div className="nutri-card">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-neutral-900">
                    <Target className="w-4 h-4 text-emerald-600" /> Active Protocol
                  </h3>
                </div>
                {activePatient.activePlan ? (
                  <>
                    <div className="bg-neutral-50 p-6 rounded-[24px] mb-8 border border-neutral-100">
                      <div className="font-black text-xl text-neutral-900 mb-1">{activePatient.activePlan.name}</div>
                    </div>
                    <div className="space-y-4">
                      <MacroRow label="Calories" value={`${activePatient.activePlan.calories} kcal`} color="bg-emerald-500" />
                      <MacroRow label="Protein" value={`${activePatient.activePlan.protein}g`} color="bg-blue-500" />
                    </div>
                  </>
                ) : (
                   <div className="text-center py-6 text-neutral-400 text-xs font-bold">
                     No custom protocol assigned yet.
                   </div>
                )}
              </div>

              {/* Dynamic Files & Logs */}
              <div className="lg:col-span-2 space-y-8">
                 <div className="nutri-card">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-neutral-900">
                        <FileText className="w-4 h-4 text-emerald-600" /> Patient Documentation
                      </h3>
                    </div>
                    {activePatient.documents && activePatient.documents.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {activePatient.documents.map((doc: any, i: number) => (
                           <FileCard key={i} name={doc.name} meta={doc.meta} type={doc.type} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-neutral-400 text-xs font-bold">
                        No clinical documents uploaded for this patient.
                      </div>
                    )}
                 </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-neutral-400 font-black uppercase tracking-widest text-xs">Select a patient to begin clinical review</div>
        )}
      </div>
    </div>
  );
}

// ------------------------------------------
// 2. SCHEDULE & REQUESTS VIEW
// ------------------------------------------
function ScheduleView({ consultations, patients, refreshData, isApproved }: { consultations: any[], patients: any[], refreshData: () => void, isApproved: boolean }) {
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [pendingConsultId, setPendingConsultId] = useState<string | null>(null);
  const [zoomLinkInput, setZoomLinkInput] = useState("");

  const handleUpdateStatus = async (consultId: string, newStatus: string, link: string = "") => {
    if (!isApproved && newStatus === 'ACCEPTED') {
      alert("Your account is pending verification. You cannot accept patients yet.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/nutritionist/consultations/${consultId}/status?user_id=${getUserId()}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, meetingLink: link })
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.detail); 
        return;
      }

      setShowZoomModal(false);
      setZoomLinkInput("");
      refreshData();
    } catch (error) {
      alert("Network Error");
    }
  };

  const getPatientName = (id: string) => {
    const p = patients.find((p: any) => p.customerId === id);
    return p ? p.fullName : "Unknown Patient";
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 pb-32">
      <h2 className="text-3xl font-black tracking-tighter mb-8 text-neutral-900 uppercase">Consultations</h2>
      
      {consultations.length === 0 ? (
        <div className="nutri-card text-center py-12">
          <Calendar className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500 font-bold">Your schedule is clear.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {consultations.map((c: any) => (
            <div key={c.id} className="nutri-card flex flex-col md:flex-row justify-between md:items-center gap-6 p-6">
              <div className={`absolute top-0 left-0 w-2 h-full ${c.status === 'REQUESTED' ? 'bg-amber-500' : c.status === 'ACCEPTED' ? 'bg-emerald-600' : 'bg-neutral-300'}`} />
              
              <div className="pl-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`nutri-status-badge ${
                    c.status === 'REQUESTED' ? 'bg-amber-100 text-amber-700' : 
                    c.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    {c.status}
                  </span>
                </div>
                <h3 className="text-2xl font-black tracking-tight text-neutral-900 mb-1">{getPatientName(c.customerId)}</h3>
                <p className="text-xs text-neutral-400 font-bold flex items-center gap-2 uppercase tracking-widest">
                  <Clock className="w-3 h-3" /> {new Date(c.scheduledTime).toLocaleString()}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pl-4 md:pl-0">
                {c.status === 'REQUESTED' && (
                  <>
                    <button onClick={() => handleUpdateStatus(c.id, 'REJECTED')} className="px-6 py-3 bg-neutral-100 text-neutral-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 hover:text-rose-600 flex items-center gap-2 transition-all active:scale-95">
                      <XCircle className="w-4 h-4" /> Decline
                    </button>
                    <button 
                      onClick={() => { 
                        if (!isApproved) {
                          alert("Your account is pending verification. You cannot accept patients yet.");
                          return;
                        }
                        setPendingConsultId(c.id); 
                        setShowZoomModal(true); 
                      }} 
                      className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${isApproved ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl shadow-emerald-900/20 active:scale-95' : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'}`}
                    >
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                  </>
                )}
                {c.status === 'ACCEPTED' && (
                  <>
                    <button onClick={() => handleUpdateStatus(c.id, 'COMPLETED')} className="px-6 py-3 bg-blue-100 text-blue-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-200 flex items-center gap-2 transition-all active:scale-95">
                      <Check className="w-4 h-4" /> Mark Done
                    </button>
                    <a href={c.meetingLink || '#'} target="_blank" rel="noreferrer" className="nutri-btn-primary px-6 py-3 text-[10px]">
                      <Video className="w-4 h-4" /> Launch Zoom
                    </a>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Approval Modal */}
      <AnimatePresence>
        {showZoomModal && (
          <div className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{opacity: 0, scale: 0.9}} className="nutri-glass-modal max-w-lg w-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-neutral-900 uppercase tracking-tighter">Approve Consult</h3>
                <button onClick={() => setShowZoomModal(false)} className="text-neutral-300 hover:text-neutral-900 transition-colors"><X className="w-8 h-8" /></button>
              </div>
              <p className="text-neutral-500 text-sm mb-6 font-medium">To approve this consultation, please provide a secure video link for the patient to join.</p>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-3">Zoom / Meet Link</label>
                  <input type="text" placeholder="https://zoom.us/j/..." value={zoomLinkInput} onChange={(e) => setZoomLinkInput(e.target.value)} className="w-full px-5 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl font-black text-neutral-900 focus:outline-emerald-500 shadow-inner" />
                </div>
                <button onClick={() => handleUpdateStatus(pendingConsultId!, 'ACCEPTED', zoomLinkInput)} className="nutri-btn-primary w-full py-4 text-xs">
                  Confirm & Send to Patient
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ------------------------------------------
// 3. DOCTOR PROFILE VIEW
// ------------------------------------------
function ProfileView({ profile, refreshProfile }: { profile: any, refreshProfile: () => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: '', specialty: '', profilePictureUrl: '', phoneNumber: '' });
  const [imageError, setImageError] = useState(false); // Track if the saved image is broken
  const [previewError, setPreviewError] = useState(false); // Track if the edit form link is broken

  useEffect(() => {
    if (profile) {
      setEditForm({
        fullName: profile.fullName || '', 
        specialty: profile.specialty || '',
        profilePictureUrl: profile.profilePictureUrl || '',
        phoneNumber: profile.phoneNumber || ''
      });
      setImageError(false); // Reset error state when new profile loads
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/nutritionist/profile?user_id=${getUserId()}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (response.ok) {
        setIsEditing(false);
        refreshProfile();
      } else {
        alert("Failed to save changes.");
      }
    } catch (err) {
      alert("Network Error");
    }
  };

  if (!profile) return <div className="text-center py-20 font-bold text-neutral-500 animate-pulse">Loading Profile...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 pb-32">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-3xl font-black tracking-tighter text-neutral-900 uppercase">My Profile</h2>
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
      
      <div className="nutri-card">
        <div className="nutri-card-accent" />
        
        {isEditing ? (
          <div className="space-y-6 relative z-10">
            {/* Live Image Preview Section */}
            <div className="flex items-center gap-6 mb-8 p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
              <div className="w-20 h-20 rounded-2xl border-2 border-white shadow-lg overflow-hidden bg-neutral-200 flex items-center justify-center shrink-0">
                {editForm.profilePictureUrl && !previewError ? (
                  <img 
                    src={editForm.profilePictureUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                    onError={() => setPreviewError(true)} // Catches broken links in real-time
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
              <input type="text" value={editForm.fullName} onChange={e => setEditForm({...editForm, fullName: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 font-medium" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-2">Specialty</label>
              <input type="text" value={editForm.specialty} onChange={e => setEditForm({...editForm, specialty: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 font-medium" placeholder="e.g. Clinical Nutritionist" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-2">Phone Number</label>
              <input type="text" value={editForm.phoneNumber} onChange={e => setEditForm({...editForm, phoneNumber: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 font-medium" placeholder="For Admin Verification" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-2">Profile Image URL</label>
              <input 
                type="text" 
                value={editForm.profilePictureUrl} 
                onChange={e => {
                  setEditForm({...editForm, profilePictureUrl: e.target.value});
                  setPreviewError(false); // Reset error when typing a new link
                }} 
                className={`w-full bg-neutral-50 border rounded-xl px-4 py-3 text-sm focus:outline-none font-medium ${previewError ? 'border-red-300 focus:border-red-500 text-red-600' : 'border-neutral-200 focus:border-emerald-500'}`} 
                placeholder="https://example.com/my-photo.jpg"
              />
            </div>
            <button onClick={handleSaveProfile} className="nutri-btn-primary w-full py-4 mt-4 text-[10px]">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="w-32 h-32 rounded-[40px] border-4 border-white shadow-2xl overflow-hidden bg-neutral-100 flex items-center justify-center">
              {/* Added onError fallback logic here! */}
              {profile?.profilePictureUrl && !imageError ? (
                <img 
                  src={profile.profilePictureUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                  onError={() => setImageError(true)} 
                />
              ) : (
                <User className="w-12 h-12 text-neutral-400" />
              )}
            </div>
            <div className="text-center md:text-left">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-2 block">{profile?.specialty || "General Nutritionist"}</span>
              <h3 className="text-4xl font-black text-neutral-900 tracking-tighter mb-2">Dr. {profile?.fullName}</h3>
              <p className="text-neutral-400 font-bold text-xs uppercase tracking-widest mb-4">ID: {profile?.userId}</p>
              
              <span className={`nutri-status-badge ${profile?.isApproved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {profile?.isApproved ? 'Verified by Admin' : 'Pending Verification'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}