import { Home, ShoppingCart, Package, Activity, User } from "lucide-react";
import { motion } from "framer-motion";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function BottomNavigation({
  activeTab,
  onTabChange,
}: BottomNavigationProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'cart', label: 'Cart', icon: ShoppingCart },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'track', label: 'Track', icon: Activity },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg z-50"
    >
      <div className="flex justify-around items-center h-16 max-w-screen-xl mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 relative ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
              whileTap={{ scale: 0.9 }}
              data-testid={`button-nav-${tab.id}`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/10 rounded-lg"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <motion.div
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative z-10"
              >
                <Icon className="w-5 h-5" />
              </motion.div>
              <span className="text-xs font-medium relative z-10">{tab.label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
