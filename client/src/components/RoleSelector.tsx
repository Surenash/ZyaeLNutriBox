import { Users, Stethoscope, Truck, Shield, ChefHat } from "lucide-react";
import { motion } from "framer-motion";

interface RoleSelectorProps {
  onRoleSelect: (role: string) => void;
}

export default function RoleSelector({ onRoleSelect }: RoleSelectorProps) {
  const roles = [
    {
      id: 'client',
      title: 'Client Portal',
      description: 'Track meals, nutrition & connect with nutritionists',
      icon: Users,
      color: 'from-[#006442] to-[#00845A]',
    },
    {
      id: 'kitchen',
      title: 'Cloud Kitchen',
      description: 'Manage orders, meal prep & delivery coordination',
      icon: ChefHat,
      color: 'from-[#DC2626] to-[#EF4444]',
    },
    {
      id: 'nutritionist',
      title: 'Nutritionist Portal',
      description: 'Manage clients & track their progress',
      icon: Stethoscope,
      color: 'from-[#0077B6] to-[#0096C7]',
    },
    {
      id: 'delivery',
      title: 'Delivery Agent',
      description: 'Manage deliveries & track routes',
      icon: Truck,
      color: 'from-[#FF8C00] to-[#FFA500]',
    },
    {
      id: 'admin',
      title: 'Admin Panel',
      description: 'Manage users, menus & analytics',
      icon: Shield,
      color: 'from-[#6B46C1] to-[#805AD5]',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#006442]/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-6xl w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-[#006442] text-xs font-black uppercase tracking-widest mb-6 border border-green-100">
            <Shield className="h-3 w-3" />
            Management Access
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
            ZyaeL <span className="text-[#006442]">NutriBox</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
            Select a portal to manage operations, clients, and clinical nutrition workflows.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <motion.button
                key={role.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -12, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onRoleSelect(role.id)}
                className="group relative bg-white rounded-[32px] p-10 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-[#006442]/10 transition-all duration-500 text-left border border-slate-100 overflow-hidden"
                data-testid={`button-role-${role.id}`}
              >
                {/* Accent Gradient */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-bl-[100px]`} />
                
                <div className="relative z-10">
                  <motion.div
                    className={`inline-flex p-5 bg-gradient-to-br ${role.color} rounded-2xl mb-8 shadow-lg shadow-inherit`}
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-[#006442] transition-colors">
                    {role.title}
                  </h2>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    {role.description}
                  </p>
                  
                  <div className="mt-8 flex items-center gap-2 text-[#006442] font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                    Enter Portal <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-20"
        >
          <div className="flex items-center justify-center gap-8 text-slate-300 font-bold text-sm">
            <span>Support: +91 6363882921</span>
            <div className="w-1 h-1 bg-slate-200 rounded-full" />
            <span>inquiries@zyaelnutribox.com</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
