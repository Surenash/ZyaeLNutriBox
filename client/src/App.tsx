import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import RoleSelector from "@/components/RoleSelector";
import ClientPortal from "@/pages/ClientPortal";
import KitchenPortal from "@/pages/KitchenPortal";
import NutritionistPortal from "@/pages/NutritionistPortal";
import DeliveryPortal from "@/pages/DeliveryPortal";
import AdminPortal from "@/pages/AdminPortal";
import NotFound from "@/pages/not-found";

function Router() {
  const [location, setLocation] = useLocation();

  const handleRoleSelect = (role: string) => {
    setLocation(`/${role}`);
  };

  const isPortalRoute = ['/client', '/kitchen', '/nutritionist', '/delivery', '/admin'].includes(location);

  return (
    <div className="relative">
      {isPortalRoute && (
        <button
          onClick={() => setLocation('/')}
          className="fixed top-4 right-4 z-50 px-4 py-2 bg-white text-foreground rounded-full shadow-md hover-elevate active-elevate-2 text-sm font-medium border border-border"
          data-testid="button-back-to-roles"
        >
          ← Back to Roles
        </button>
      )}

      <Switch>
        <Route path="/">
          <RoleSelector onRoleSelect={handleRoleSelect} />
        </Route>
        <Route path="/client">
          <ClientPortal />
        </Route>
        <Route path="/kitchen">
          <KitchenPortal />
        </Route>
        <Route path="/nutritionist">
          <NutritionistPortal />
        </Route>
        <Route path="/delivery">
          <DeliveryPortal />
        </Route>
        <Route path="/admin">
          <AdminPortal />
        </Route>
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
