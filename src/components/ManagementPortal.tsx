import { Link } from 'react-router-dom';
import { Stethoscope, ChefHat, Truck, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export function ManagementPortal() {
  const portals = [
    {
      id: 'nutritionist',
      title: 'Nutritionist Panel',
      description: 'Review customer intake forms, manage consultations, and schedule client calls.',
      icon: <Stethoscope className="w-6 h-6 text-blue-600" />,
      path: '/nutritionist',
      color: 'bg-blue-50 border-blue-200',
    },
    {
      id: 'kitchen',
      title: 'Cloud Kitchen (KDS)',
      description: 'Live order monitor. See incoming orders, details, and prep status on one screen.',
      icon: <ChefHat className="w-6 h-6 text-orange-600" />,
      path: '/kitchen',
      color: 'bg-orange-50 border-orange-200',
    },
    {
      id: 'delivery',
      title: 'Driver Portal',
      description: 'Driver application view for active deliveries, map details, routing, and timings.',
      icon: <Truck className="w-6 h-6 text-purple-600" />,
      path: '/delivery',
      color: 'bg-purple-50 border-purple-200',
    },
    {
      id: 'admin',
      title: 'Admin Platform',
      description: 'System management, edit active meal plans, subscription controls, and overall metrics.',
      icon: <Shield className="w-6 h-6 text-rose-600" />,
      path: '/admin',
      color: 'bg-rose-50 border-rose-200',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 w-full font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 mb-4 text-balance">
          Management Roles
        </h1>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          Select an internal platform to access your dedicated workspace.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {portals.map((portal, index) => (
          <motion.div
            key={portal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link 
              to={portal.path}
              className={`block p-6 rounded-2xl border ${portal.color} hover:shadow-md transition-shadow h-full flex flex-col bg-white`}
            >
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4">
                {portal.icon}
              </div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">{portal.title}</h2>
              <p className="text-neutral-600 mb-6 flex-1 text-sm leading-relaxed">
                {portal.description}
              </p>
              <div className="flex items-center text-sm font-semibold text-neutral-900 mt-auto group">
                Enter Portal 
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
