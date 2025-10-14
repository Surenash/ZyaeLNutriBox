import { Users, Utensils, TrendingUp, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { pageTransitionVariants, viewportConfig } from "@/lib/animations";
import StatsCard from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AdminPortal() {
  // Fetch meal plans from API
  const { data: mealPlansData, isLoading: mealPlansLoading } = useQuery({
    queryKey: ["/api/meal-plans"],
  });

  // Fetch clients from API (for total users)
  const { data: clientsData, isLoading: clientsLoading } = useQuery({
    queryKey: ["/api/clients"],
  });

  // Fetch orders from API (for recent orders)
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/orders"],
  });

  // Calculate stats
  const totalUsers = Array.isArray(clientsData) ? clientsData.length : 0;
  const activeMealPlans = Array.isArray(mealPlansData) 
    ? mealPlansData.filter((plan: any) => plan.isActive).length 
    : 0;
  
  // Get recent orders (clone array to avoid mutating cache)
  const recentOrders = Array.isArray(ordersData) 
    ? [...ordersData]
        .sort((a: any, b: any) => new Date(b.orderedAt).getTime() - new Date(a.orderedAt).getTime())
        .slice(0, 5)
    : [];
  return (
    <motion.div
      {...pageTransitionVariants}
      className="min-h-screen bg-background"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-[#6B46C1] text-white py-8 mb-8"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
          <p className="text-white/90">Manage your entire ecosystem</p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <StatsCard
            title="Total Users"
            value={clientsLoading ? "..." : String(totalUsers)}
            subtitle="Active clients"
            icon={Users}
          />
          <StatsCard
            title="Meal Plans"
            value={mealPlansLoading ? "..." : String(activeMealPlans)}
            subtitle="Active plans"
            icon={Utensils}
          />
          <StatsCard
            title="Revenue"
            value="₹48.7L"
            subtitle="This month"
            icon={DollarSign}
            trend={{ value: "+8.3%", isPositive: true }}
          />
          <StatsCard
            title="Growth Rate"
            value="18.2%"
            subtitle="Month over month"
            icon={TrendingUp}
            trend={{ value: "+2.1%", isPositive: true }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportConfig}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportConfig}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">
                Meal Menu Management
              </h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-primary-foreground rounded-full hover-elevate active-elevate-2" data-testid="button-add-meal">
                    Add Meal
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Meal</DialogTitle>
                    <DialogDescription>
                      Create a new meal plan for your customers
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="meal-name">Meal Name</Label>
                      <Input
                        id="meal-name"
                        placeholder="e.g., Weight Loss Special"
                        data-testid="input-meal-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="diet-type">Diet Type</Label>
                      <Select>
                        <SelectTrigger id="diet-type" data-testid="select-diet-type">
                          <SelectValue placeholder="Select diet type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="veg">Vegetarian</SelectItem>
                          <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
                          <SelectItem value="vegan">Vegan</SelectItem>
                          <SelectItem value="keto">Keto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="price">Price (₹)</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="15000"
                        data-testid="input-price"
                      />
                    </div>
                    <Button className="w-full bg-primary text-primary-foreground rounded-full hover-elevate active-elevate-2" data-testid="button-save-meal">
                      Save Meal
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {mealPlansLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 border border-border rounded-lg animate-pulse">
                    <div className="h-4 bg-muted rounded mb-2 w-1/2"></div>
                    <div className="h-3 bg-muted rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {(Array.isArray(mealPlansData) ? mealPlansData : []).slice(0, 5).map((plan: any) => (
                  <div key={plan.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <p className="font-semibold text-foreground">{plan.title}</p>
                      <p className="text-sm text-muted-foreground">₹{plan.currentPrice.toLocaleString()}/month</p>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-full" data-testid={`button-edit-meal-${plan.id}`}>
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportConfig}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-xl font-bold text-foreground mb-6">
              Recent Orders
            </h2>
            {ordersLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 border border-border rounded-lg animate-pulse">
                    <div className="h-4 bg-muted rounded mb-2 w-1/2"></div>
                    <div className="h-3 bg-muted rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : recentOrders.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No recent orders
              </p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <p className="font-semibold text-foreground">{order.clientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.dietPlan} - {order.mealType}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-primary">₹{order.price.toLocaleString()}</p>
                      <span className={`text-xs ${order.status === 'delivered' ? 'text-success' : 'text-warning'}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.section>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportConfig}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h2 className="text-xl font-bold text-foreground mb-6">
            Analytics Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-muted/30 rounded-lg">
              <p className="text-3xl font-bold text-primary mb-2">87%</p>
              <p className="text-sm text-muted-foreground">
                Customer Satisfaction
              </p>
            </div>
            <div className="text-center p-6 bg-muted/30 rounded-lg">
              <p className="text-3xl font-bold text-primary mb-2">4.8</p>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </div>
            <div className="text-center p-6 bg-muted/30 rounded-lg">
              <p className="text-3xl font-bold text-primary mb-2">94%</p>
              <p className="text-sm text-muted-foreground">Meal Completion</p>
            </div>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}
