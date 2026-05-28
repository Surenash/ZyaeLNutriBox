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
      <header className="bg-purple-900 text-white h-16 flex items-center justify-between px-4 sm:px-6 shrink-0 relative z-20 shadow-md">
        <div className="font-bold flex items-center gap-2 text-lg">
          <Truck className="w-6 h-6" /> 
          NutriBox Driver App
        </div>
        <button onClick={handleLogout} className="text-sm font-medium text-purple-200 hover:text-white transition-colors bg-purple-800 px-3 py-1.5 rounded-lg border border-purple-700">
          Sign Out
        </button>
      </header>

      <div className="flex-1 bg-neutral-100 flex flex-col md:flex-row overflow-hidden">
      {/* Map Area */}
      <div className="flex-1 relative bg-neutral-200">
        {/* Placeholder for Interactive Map */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400 bg-blue-50/50">
          <Navigation className="w-16 h-16 mb-4 text-blue-200" />
          <p className="font-semibold text-blue-900/40">Google Maps Integration Active</p>
          <p className="text-sm text-blue-900/30">Displaying route for current delivery</p>
        </div>
        
        {/* Floating Route Status */}
        {currentStop && (
          <div className="absolute top-6 left-6 right-6 md:right-auto md:w-80 bg-white rounded-2xl shadow-lg border border-neutral-200 p-4 z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 p-2 rounded-full text-purple-700">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm text-neutral-500 font-medium">Next Drop-off</div>
                <div className="font-bold">12 mins away</div>
              </div>
            </div>
            <div className="border-l-2 border-dashed border-neutral-200 ml-4 pl-6 py-2 space-y-4">
              <div className="relative">
                <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-neutral-400" />
                <div className="text-sm font-medium">Cloud Kitchen Hub</div>
              </div>
              <div className="relative">
                <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-purple-600" />
                <div className="text-sm font-bold text-purple-700">{currentStop.address}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Driver Controls */}
      <div className="w-full md:w-96 bg-white border-l border-neutral-200 flex flex-col z-20">
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <h2 className="font-bold tracking-tight">Active Run #842</h2>
          <span className="text-sm font-mono bg-purple-100 text-purple-700 px-2 py-0.5 rounded">{activeStops.length} stops left</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeStops.length === 0 && (
             <div className="text-center font-bold text-neutral-500 mt-20">All deliveries completed!</div>
          )}

          {activeStops.map((stop, idx) => (
            <div key={stop.id} className={`border rounded-xl p-4 transition-all ${idx === 0 ? 'border-purple-200 bg-purple-50 shadow-sm' : 'border-neutral-200 opacity-60'}`}>
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-neutral-900">Drop-off {stop.id}</h3>
                {idx === 0 && <span className="text-xs font-bold text-white bg-purple-600 px-2 py-1 rounded">CURRENT</span>}
              </div>
              <p className="font-medium">{stop.address}</p>
              <p className="text-sm text-neutral-600 mb-4">Customer: {stop.customer} • {stop.order}</p>
              
              {idx === 0 && (
                <>
                  <div className="bg-white p-3 rounded-lg text-sm mb-4 border border-purple-100">
                    <strong>Instructions:</strong> {stop.instructions}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => alert("Calling customer...")} className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-neutral-300 bg-white font-medium hover:bg-neutral-50 transition">
                      <Phone className="w-4 h-4" /> Call
                    </button>
                    <button onClick={() => markDelivered(stop.id)} className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition">
                      <Check className="w-4 h-4" /> Delivered
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
