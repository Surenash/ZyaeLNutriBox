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
          <h2 className="text-xl font-bold tracking-tight">Kitchen Display System</h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-neutral-400 font-mono text-xl">
            {currentTime}
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-bold rounded-lg transition-colors border border-neutral-700">
            Exit KDS
          </button>
        </div>
      </div>

      {/* Tickets Grid */}
      <div className="flex-1 overflow-x-auto p-6 flex gap-6">
        {orders.length === 0 ? (
           <div className="mx-auto mt-20 text-center text-neutral-500 font-bold block">No active orders</div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="min-w-[300px] border border-neutral-700 bg-neutral-800 rounded-xl flex flex-col overflow-hidden">
              <div className={`p-3 flex items-center justify-between border-b border-neutral-700 ${order.priority === 'high' ? 'bg-rose-900/40 text-rose-300' : 'bg-neutral-900'}`}>
                <span className="font-mono font-bold">{order.id}</span>
                <span className="text-sm flex items-center gap-1"><Clock className="w-3 h-3"/> {order.time}</span>
              </div>
              <div className="p-4 flex-1">
                <ul className="space-y-4">
                  {order.items.map((item, idx) => (
                    <li key={idx} onClick={() => toggleItemDone(order.id, idx)} className="flex items-start gap-3 text-lg font-medium cursor-pointer hover:opacity-80 transition-opacity">
                      <div className={`w-6 h-6 rounded border-2 mt-0.5 flex-shrink-0 flex items-center justify-center ${item.done ? 'bg-green-500 border-green-500' : 'border-neutral-500'}`}>
                         {item.done && <CheckCircle className="w-4 h-4 text-white" />}
                      </div>
                      <span className={item.done ? 'line-through text-neutral-500' : ''}>{item.name}</span>
                    </li>
                  ))}
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
