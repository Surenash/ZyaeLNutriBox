import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import RoleSelector from "@/components/RoleSelector";
import ClientPortal from "@/pages/ClientPortal";
import KitchenPortal from "@/pages/KitchenPortal";
import NutritionistPortal from "@/pages/NutritionistPortal";
import DeliveryPortal from "@/pages/DeliveryPortal";
import AdminPortal from "@/pages/AdminPortal";
import LandingPage from "@/pages/LandingPage";
import Login from "@/pages/Login";
import NotFound from "@/pages/not-found";

function Router() {
  const [location, setLocation] = useLocation();
  const { user, logoutMutation } = useAuth();

  const handleRoleSelect = (role: string) => {
    setLocation(`/management/${role}`);
  };

  const isManagementRoute = location.startsWith('/management');

  return (
    <div className="relative">
      {user && isManagementRoute && (
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <button
            onClick={() => setLocation('/management')}
            className="px-4 py-2 bg-white text-foreground rounded-full shadow-md hover-elevate active-elevate-2 text-sm font-medium border border-border"
          >
            ← Switch Role
          </button>
          <button
            onClick={() => logoutMutation.mutate()}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-full shadow-md hover:bg-red-100 text-sm font-medium border border-red-200"
          >
            Logout
          </button>
        </div>
      )}

      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/login" component={Login} />
        
        <ProtectedRoute path="/management">
          <RoleSelector onRoleSelect={handleRoleSelect} />
        </ProtectedRoute>
        
        <ProtectedRoute path="/management/client">
          <ClientPortal />
        </ProtectedRoute>
        <ProtectedRoute path="/management/kitchen">
          <KitchenPortal />
        </ProtectedRoute>
        <ProtectedRoute path="/management/nutritionist">
          <NutritionistPortal />
        </ProtectedRoute>
        <ProtectedRoute path="/management/delivery">
          <DeliveryPortal />
        </ProtectedRoute>
        <ProtectedRoute path="/management/admin">
          <AdminPortal />
        </ProtectedRoute>
        
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
