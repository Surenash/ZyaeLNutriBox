import { Users, Stethoscope, Truck, Shield } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#006442] mb-4">
            ZyaeL NutriBox
          </h1>
          <p className="text-lg text-foreground/70">
            Home-Cooked Goodness, Perfected by Nutritionists
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.id}
                onClick={() => onRoleSelect(role.id)}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover-elevate active-elevate-2 text-left overflow-hidden"
                data-testid={`button-role-${role.id}`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${role.color} opacity-10 rounded-bl-full`} />
                <div className="relative">
                  <div className={`inline-flex p-4 bg-gradient-to-br ${role.color} rounded-xl mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {role.title}
                  </h2>
                  <p className="text-muted-foreground">
                    {role.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            Contact: +91 6363882921 | inquiries@zyaelnutribox.com
          </p>
        </div>
      </div>
    </div>
  );
}
