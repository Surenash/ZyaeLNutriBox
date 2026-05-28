import { Link } from 'react-router-dom';
import { Stethoscope, ChefHat, Truck, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export function ManagementPortalOriginal() {
  const portals = [
    {
      id: 'admin',
      title: 'Admin Platform',
      description: 'System management, edit active meal plans, subscription controls, and overall metrics.',
      icon: <Shield className="w-6 h-6 text-rose-600" />,
      path: '/admin',
      color: 'bg-rose-50 border-rose-200 text-rose-900',
    },
    {
      id: 'nutritionist',
      title: 'Nutritionist Panel',
      description: 'Review customer intake forms, manage consultations, and schedule client calls.',
      icon: <Stethoscope className="w-6 h-6 text-blue-600" />,
      path: '/nutritionist',
      color: 'bg-blue-50 border-blue-200 text-blue-900',
    },
    {
      id: 'kitchen',
      title: 'Cloud Kitchen (KDS)',
      description: 'Live order monitor. See incoming orders, details, and prep status on one screen.',
      icon: <ChefHat className="w-6 h-6 text-orange-600" />,
      path: '/kitchen',
      color: 'bg-orange-50 border-orange-200 text-orange-900',
    },
    {
      id: 'delivery',
      title: 'Driver Portal',
      description: 'Driver application view for active deliveries, map details, routing, and timings.',
      icon: <Truck className="w-6 h-6 text-purple-600" />,
      path: '/delivery',
      color: 'bg-purple-50 border-purple-200 text-purple-900',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <header className="bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
              Z
            </div>
            <span className="font-bold text-xl tracking-tight text-white">ZyaeL <span className="text-emerald-400 font-medium">Internal</span></span>
          </Link>
          <Link to="/" className="text-slate-300 text-sm hover:text-white font-medium">Public Site</Link>
        </div>
      </header>

      <main className="flex-1 w-full flex items-center justify-center py-16 px-4">
        <div className="max-w-5xl w-full">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4 text-balance">
              Management Access
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Select an internal platform to access your dedicated workspace. You will be required to authenticate.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {portals.map((portal, index) => (
              <motion.div
                key={portal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="h-full"
              >
                <Link 
                  to={portal.path}
                  className={`block p-6 rounded-2xl border ${portal.color} hover:shadow-lg transition-all duration-200 h-full flex flex-col bg-white hover:-translate-y-1`}
                >
                  <div className={`w-12 h-12 bg-white rounded-xl shadow border border-neutral-100 flex items-center justify-center mb-5`}>
                    {portal.icon}
                  </div>
                  <h2 className="text-xl font-bold mb-2">{portal.title}</h2>
                  <p className="text-slate-600 mb-8 flex-1 text-sm leading-relaxed">
                    {portal.description}
                  </p>
                  <div className="flex items-center text-sm font-bold mt-auto group">
                    Login to Terminal 
                    <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
