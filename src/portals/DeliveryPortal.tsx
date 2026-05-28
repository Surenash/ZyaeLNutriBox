import { Truck, MapPin, Navigation, Phone, Check } from 'lucide-react';
import { useState } from 'react';

export function DeliveryPortal() {
  const [stops, setStops] = useState([
    { id: 1, address: '123 Health Ave, Apt 4B', customer: 'John Doe', order: 'ORD-1042', instructions: 'Leave at front door and ring the doorbell.', completed: false },
    { id: 2, address: '456 Corporate Blvd, Floor 12', customer: 'Mike Johnson', order: 'ORD-1044', instructions: 'Leave at reception.', completed: false },
    { id: 3, address: '789 Sunset Way, House', customer: 'Sarah Jenkins', order: 'ORD-1045', instructions: 'Beware of dog.', completed: false }
  ]);

  const activeStops = stops.filter(s => !s.completed);
  const currentStop = activeStops.length > 0 ? activeStops[0] : null;

  const handleLogout = () => { window.location.href = '/_logout'; setTimeout(() => window.location.href = '/management', 10); };

  const markDelivered = (id: number) => {
    setStops(stops.map(s => s.id === id ? { ...s, completed: true } : s));
  };

  return (
    <div className="flex flex-col h-screen font-sans overflow-hidden bg-neutral-100">
      {/* Driver App Header */}
      <header className="bg-[#1A1A1A] text-white h-16 flex items-center justify-between px-4 sm:px-6 shrink-0 relative z-20 shadow-xl border-b border-white/5">
        <div className="font-black flex items-center gap-3 text-lg uppercase tracking-tighter">
          <div className="bg-purple-600 p-1.5 rounded-lg shadow-lg shadow-purple-900/40">
            <Truck className="w-5 h-5 text-white" />
          </div>
          NutriBox <span className="text-purple-500">Fleet</span>
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] font-black uppercase text-neutral-500 tracking-widest leading-none">Vehicle ID</span>
              <span className="text-xs font-bold text-white uppercase">DL-04-NB-1234</span>
           </div>
           <button onClick={handleLogout} className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10">
             Sign Out
           </button>
        </div>
      </header>

      <div className="flex-1 bg-neutral-100 flex flex-col md:flex-row overflow-hidden">
      {/* Map Area */}
      <div className="flex-1 relative bg-neutral-200">
        {/* Placeholder for Interactive Map */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400 bg-[#E5E7EB]">
          <div className="w-full h-full relative overflow-hidden">
             {/* Simple visual map representation */}
             <div className="absolute inset-0 opacity-10 flex flex-wrap gap-4 p-4">
                {Array.from({length: 100}).map((_, i) => <div key={i} className="w-20 h-20 border border-neutral-900 rounded-lg"></div>)}
             </div>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Navigation className="w-20 h-20 mb-4 text-purple-200 animate-pulse" />
                <p className="font-black text-neutral-400 uppercase tracking-[0.3em] text-xs">Navigation Active</p>
             </div>
          </div>
        </div>
        
        {/* Floating Route Status */}
        {currentStop && (
          <div className="absolute top-6 left-6 right-6 md:right-auto md:w-80 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white p-6 z-10">
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
                   <p className="text-sm font-bold text-neutral-600">Cloud Kitchen Hub #4</p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -left-[38px] top-1 w-4 h-4 rounded-full bg-purple-600 border-4 border-white shadow-lg" />
                <div>
                   <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-0.5">Destination</p>
                   <p className="text-sm font-black text-neutral-900 leading-tight">{currentStop.address}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Driver Controls */}
      <div className="w-full md:w-[400px] bg-white border-l border-neutral-200 flex flex-col z-20 shadow-2xl">
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-white sticky top-0">
          <div>
             <h2 className="font-black text-xl text-neutral-900 uppercase tracking-tighter">Route #842</h2>
             <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Morning Dispatch</p>
          </div>
          <span className="text-[10px] font-black bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full border border-purple-100 uppercase tracking-widest">{activeStops.length} stops left</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeStops.length === 0 && (
             <div className="text-center py-20 px-8">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Check className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-neutral-900 mb-2">Run Completed!</h3>
                <p className="text-sm font-medium text-neutral-500 mb-8">All 12 deliveries successfully dropped off. Return to the hub for the next dispatch.</p>
                <button onClick={() => alert("Setting navigation to Hub...")} className="w-full py-4 bg-[#1A1A1A] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-neutral-800 transition shadow-xl">Return to Hub</button>
             </div>
          )}

          {activeStops.map((stop, idx) => (
            <div key={stop.id} className={`group relative border rounded-[32px] p-6 transition-all duration-500 ${idx === 0 ? 'border-purple-200 bg-white shadow-xl shadow-purple-900/5' : 'border-neutral-100 opacity-40 hover:opacity-100 grayscale hover:grayscale-0'}`}>
              {idx === 0 && <div className="absolute -top-3 right-8 bg-purple-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-widest">Current Stop</div>}
              
              <div className="flex items-start justify-between mb-6">
                <div>
                   <h3 className="font-black text-neutral-900 text-sm uppercase tracking-widest mb-1">Stop #{stop.id}</h3>
                   <p className="font-bold text-neutral-500 text-xs">Customer: {stop.customer}</p>
                </div>
                <div className="bg-neutral-100 text-neutral-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                   {stop.order}
                </div>
              </div>

              <div className="space-y-4 mb-8">
                 <div className="flex gap-4">
                    <div className="bg-neutral-50 p-2 rounded-xl h-fit border border-neutral-100"><MapPin className="w-4 h-4 text-purple-600" /></div>
                    <p className="font-bold text-neutral-900 text-sm leading-snug pt-1">{stop.address}</p>
                 </div>
                 
                 {idx === 0 && (
                   <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                         <MessageSquare className="w-3 h-3" /> Special Instructions
                      </p>
                      <p className="text-sm font-medium text-neutral-700 leading-relaxed italic">"{stop.instructions}"</p>
                   </div>
                 )}
              </div>
              
              {idx === 0 && (
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => alert("Calling customer...")} className="flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-neutral-100 bg-white font-black uppercase tracking-widest text-[10px] text-neutral-600 hover:bg-neutral-50 transition-all active:scale-95">
                      <Phone className="w-4 h-4" /> Call
                    </button>
                    <button onClick={() => markDelivered(stop.id)} className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-purple-600 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-purple-200 hover:bg-purple-700 transition-all active:scale-95">
                      <Check className="w-4 h-4" /> Delivered
                    </button>
                </div>
              )}
            </div>
          ))}

          {/* Delivery History */}
          {stops.some(s => s.completed) && (
             <div className="mt-12 pt-12 border-t border-neutral-100">
                <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-6">Completed Deliveries</h3>
                <div className="space-y-3">
                   {stops.filter(s => s.completed).map(s => (
                      <div key={s.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100 opacity-60">
                         <div className="flex items-center gap-3 min-w-0">
                            <div className="bg-emerald-100 p-1.5 rounded-lg text-emerald-600 shrink-0"><Check className="w-3 h-3" /></div>
                            <p className="text-xs font-bold text-neutral-700 truncate">{s.customer}</p>
                         </div>
                         <span className="text-[10px] font-black text-neutral-400 whitespace-nowrap ml-4">Delivered</span>
                      </div>
                   ))}
                </div>
             </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
