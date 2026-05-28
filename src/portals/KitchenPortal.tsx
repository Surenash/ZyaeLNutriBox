import { ChefHat, CheckCircle, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

export function KitchenPortal() {
  const [orders, setOrders] = useState([
    { id: 'ORD-1042', time: '10:02 AM', items: [{name: 'Keto Avocado Toast', done: false}, {name: 'Green Detox Smoothie', done: false}], status: 'preparing', priority: 'high' },
    { id: 'ORD-1043', time: '10:05 AM', items: [{name: 'Grilled Salmon Salad (No Nuts)', done: false}, {name: 'Sparkling Water', done: false}], status: 'pending', priority: 'normal' },
    { id: 'ORD-1044', time: '10:08 AM', items: [{name: 'Low-carb Steak & Broccoli', done: false}, {name: 'Protein Bites', done: false}], status: 'pending', priority: 'normal' },
    { id: 'ORD-1045', time: '10:15 AM', items: [{name: 'Vegan Buddha Bowl', done: false}, {name: 'Kombucha', done: false}], status: 'pending', priority: 'normal' },
  ]);

  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => { window.location.href = '/_logout'; setTimeout(() => window.location.href = '/management', 10); };

  const toggleItemDone = (orderId: string, itemIdx: number) => {
    setOrders(orders.map(o => {
      if (o.id === orderId) {
        const newItems = [...o.items];
        newItems[itemIdx].done = !newItems[itemIdx].done;
        return { ...o, items: newItems };
      }
      return o;
    }));
  };

  const handleBump = (orderId: string) => {
    // move order to back of the array
    const target = orders.find(o => o.id === orderId);
    if (target) {
       setOrders([...orders.filter(o => o.id !== orderId), target]);
    }
  };

  const handleReady = (orderId: string) => {
    // completely remove order
    setOrders(orders.filter(o => o.id !== orderId));
  };

  return (
    <div className="flex-1 bg-neutral-950 text-white h-screen overflow-hidden flex flex-col font-sans">
      {/* KDS Header */}
      <div className="bg-neutral-900 p-4 border-b border-neutral-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <ChefHat className="w-6 h-6 text-orange-500" />
          <h2 className="text-xl font-bold tracking-tight uppercase">Kitchen Display System</h2>
        </div>
        <div className="flex items-center gap-12">
          {/* Batch Summary */}
          <div className="hidden lg:flex gap-8 border-x border-neutral-800 px-8">
             <div className="text-center">
                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-0.5">Keto</p>
                <p className="font-mono font-bold text-lg text-emerald-500">24/40</p>
             </div>
             <div className="text-center">
                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-0.5">Vegan</p>
                <p className="font-mono font-bold text-lg text-blue-400">12/30</p>
             </div>
             <div className="text-center">
                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-0.5">Muscle</p>
                <p className="font-mono font-bold text-lg text-rose-400">18/25</p>
             </div>
          </div>
          <div className="text-neutral-400 font-mono text-xl">
            {currentTime}
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-bold rounded-lg transition-colors border border-neutral-700">
            Exit
          </button>
        </div>
      </div>

      {/* Tickets Grid */}
      <div className="flex-1 overflow-x-auto p-6 flex gap-6">
        {orders.length === 0 ? (
           <div className="mx-auto mt-20 text-center text-neutral-500 font-bold block">No active orders</div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="min-w-[300px] border border-neutral-700 bg-neutral-800 rounded-xl flex flex-col overflow-hidden shadow-2xl">
              <div className={`p-3 flex items-center justify-between border-b border-neutral-700 ${order.priority === 'high' ? 'bg-rose-900/40 text-rose-300' : 'bg-neutral-900'}`}>
                <span className="font-mono font-black">{order.id}</span>
                <span className="text-xs font-bold flex items-center gap-1 opacity-70"><Clock className="w-3 h-3"/> {order.time}</span>
              </div>
              <div className="p-4 flex-1">
                <ul className="space-y-4">
                  {order.items.map((item, idx) => {
                    const hasAllergen = item.name.includes('(');
                    return (
                      <li key={idx} onClick={() => toggleItemDone(order.id, idx)} className="flex items-start gap-3 text-lg font-bold cursor-pointer group">
                        <div className={`w-7 h-7 rounded-lg border-2 mt-0.5 flex-shrink-0 flex items-center justify-center transition-all ${item.done ? 'bg-emerald-500 border-emerald-500' : 'border-neutral-600 group-hover:border-neutral-400'}`}>
                           {item.done && <CheckCircle className="w-5 h-5 text-white" />}
                        </div>
                        <div className="flex flex-col">
                           <span className={`${item.done ? 'line-through text-neutral-600' : 'text-neutral-100'}`}>{item.name.split('(')[0]}</span>
                           {hasAllergen && !item.done && (
                              <span className="text-xs font-black text-rose-400 bg-rose-950/50 px-2 py-0.5 rounded mt-1 border border-rose-900/50 uppercase tracking-tighter">
                                 ⚠ Special Instruction: {item.name.split('(')[1].replace(')', '')}
                              </span>
                           )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="p-3 bg-neutral-900 border-t border-neutral-700 flex gap-2">
                <button onClick={() => handleBump(order.id)} className="flex-1 py-3 rounded-lg font-bold bg-neutral-700 text-white hover:bg-neutral-600 transition tracking-widest uppercase text-xs">
                  Bump
                </button>
                <button onClick={() => handleReady(order.id)} disabled={!order.items.every(i => i.done)} className="flex-1 py-3 rounded-lg font-bold bg-green-600 text-white hover:bg-green-500 transition flex items-center justify-center gap-2 disabled:bg-neutral-800 disabled:text-neutral-500 tracking-widest uppercase text-xs">
                  <CheckCircle className="w-4 h-4" /> Ready
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
