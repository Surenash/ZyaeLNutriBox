import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, 
  ChefHat, 
  Package, 
  CheckCircle2, 
  AlertCircle,
  Users,
  Truck
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { deliveryWS } from "@/lib/websocket";
import StatsCard from "@/components/StatsCard";
import { pageTransitionVariants, viewportConfig } from "@/lib/animations";

export default function KitchenPortal() {
  const [selectedTab, setSelectedTab] = useState<"pending" | "preparing" | "ready" | "completed">("pending");

  // Listen for WebSocket tracking updates
  useEffect(() => {
    const unsubscribe = deliveryWS.on("location_update", (data) => {
      console.log("[Kitchen] Received location update:", data);
      // Invalidate delivery tracking queries to refresh delivery status
      queryClient.invalidateQueries({ queryKey: ["/api/delivery-tracking"] });
    });

    return unsubscribe;
  }, []);

  // Fetch kitchen queue
  const { data: kitchenQueue = [], isLoading } = useQuery({
    queryKey: ["/api/kitchen/queue"],
  });

  // Fetch orders
  const { data: orders = [] } = useQuery({
    queryKey: ["/api/orders"],
  });

  // Fetch available delivery agents
  const { data: deliveryAgents = [] } = useQuery({
    queryKey: ["/api/delivery-agents/available"],
  });

  // Update kitchen queue status
  const updateKitchenStatus = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      return await apiRequest(`/api/kitchen/queue/${id}`, "PATCH", updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/kitchen/queue"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
    },
  });

  // Assign delivery agent
  const assignDeliveryAgent = useMutation({
    mutationFn: async ({ orderId, agentId, agentName }: { orderId: string; agentId: string; agentName: string }) => {
      return await apiRequest(`/api/orders/${orderId}`, "PATCH", {
        deliveryAgentId: agentId,
        deliveryAgentName: agentName,
        kitchenStatus: "assigned",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/kitchen/queue"] });
    },
  });

  const handleStatusChange = (id: string, newStatus: string) => {
    const now = new Date().toISOString();
    const updates: any = { status: newStatus };
    
    if (newStatus === "preparing") {
      updates.startedAt = now;
    } else if (newStatus === "ready") {
      updates.completedAt = now;
    }
    
    updateKitchenStatus.mutate({ id, updates });
  };

  const pendingOrders = kitchenQueue.filter((item: any) => item.status === "pending");
  const preparingOrders = kitchenQueue.filter((item: any) => item.status === "preparing");
  const readyOrders = kitchenQueue.filter((item: any) => item.status === "ready");
  const completedOrders = kitchenQueue.filter((item: any) => item.status === "completed");

  const getOrderDetails = (orderId: string) => {
    return orders.find((order: any) => order.id === orderId);
  };

  return (
    <motion.div
      {...pageTransitionVariants}
      className="min-h-screen bg-background"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-[#DC2626] to-[#EF4444] text-white py-8 mb-8"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">Cloud Kitchen Dashboard</h1>
          <p className="text-white/90">Manage orders and coordinate with delivery</p>
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
            title="Pending Orders"
            value={pendingOrders.length.toString()}
            subtitle="Awaiting preparation"
            icon={AlertCircle}
          />
          <StatsCard
            title="In Progress"
            value={preparingOrders.length.toString()}
            subtitle="Being prepared"
            icon={ChefHat}
          />
          <StatsCard
            title="Ready for Pickup"
            value={readyOrders.length.toString()}
            subtitle="Awaiting delivery"
            icon={Package}
          />
          <StatsCard
            title="Completed"
            value={completedOrders.length.toString()}
            subtitle="Today"
            icon={CheckCircle2}
          />
        </motion.div>

        <div className="flex gap-2 border-b border-border overflow-x-auto">
          <Button
            variant={selectedTab === "pending" ? "default" : "ghost"}
            onClick={() => setSelectedTab("pending")}
            className="rounded-b-none"
            data-testid="tab-pending"
          >
            Pending ({pendingOrders.length})
          </Button>
          <Button
            variant={selectedTab === "preparing" ? "default" : "ghost"}
            onClick={() => setSelectedTab("preparing")}
            className="rounded-b-none"
            data-testid="tab-preparing"
          >
            Preparing ({preparingOrders.length})
          </Button>
          <Button
            variant={selectedTab === "ready" ? "default" : "ghost"}
            onClick={() => setSelectedTab("ready")}
            className="rounded-b-none"
            data-testid="tab-ready"
          >
            Ready ({readyOrders.length})
          </Button>
          <Button
            variant={selectedTab === "completed" ? "default" : "ghost"}
            onClick={() => setSelectedTab("completed")}
            className="rounded-b-none"
            data-testid="tab-completed"
          >
            Completed ({completedOrders.length})
          </Button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading orders...</p>
              </div>
            ) : (
              <>
                {selectedTab === "pending" && pendingOrders.map((item: any, index: number) => {
                  const order = getOrderDetails(item.orderId);
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-card rounded-xl shadow-md p-6 hover-elevate"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Badge className="bg-yellow-500 text-white">Pending</Badge>
                            <span className="text-sm text-muted-foreground">Order #{item.orderId.slice(0, 8)}</span>
                          </div>
                          <h3 className="text-lg font-semibold text-foreground mb-2">{item.dietPlan}</h3>
                          <p className="text-sm text-muted-foreground mb-1">{item.mealType} × {item.quantity}</p>
                          {order && (
                            <>
                              <p className="text-sm text-muted-foreground">{order.clientName}</p>
                              <p className="text-xs text-muted-foreground">{order.clientAddress}</p>
                            </>
                          )}
                        </div>
                        <Button
                          onClick={() => handleStatusChange(item.id, "preparing")}
                          disabled={updateKitchenStatus.isPending}
                          data-testid={`button-start-preparing-${index}`}
                        >
                          Start Preparing
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}

                {selectedTab === "preparing" && preparingOrders.map((item: any, index: number) => {
                  const order = getOrderDetails(item.orderId);
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-card rounded-xl shadow-md p-6 hover-elevate"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Badge className="bg-orange-500 text-white">Preparing</Badge>
                            <span className="text-sm text-muted-foreground">Order #{item.orderId.slice(0, 8)}</span>
                          </div>
                          <h3 className="text-lg font-semibold text-foreground mb-2">{item.dietPlan}</h3>
                          <p className="text-sm text-muted-foreground mb-1">{item.mealType} × {item.quantity}</p>
                          {order && (
                            <>
                              <p className="text-sm text-muted-foreground">{order.clientName}</p>
                              <p className="text-xs text-muted-foreground">{order.clientAddress}</p>
                            </>
                          )}
                        </div>
                        <Button
                          onClick={() => handleStatusChange(item.id, "ready")}
                          disabled={updateKitchenStatus.isPending}
                          data-testid={`button-mark-ready-${index}`}
                        >
                          Mark as Ready
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}

                {selectedTab === "ready" && readyOrders.map((item: any, index: number) => {
                  const order = getOrderDetails(item.orderId);
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-card rounded-xl shadow-md p-6 hover-elevate"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Badge className="bg-green-500 text-white">Ready</Badge>
                            <span className="text-sm text-muted-foreground">Order #{item.orderId.slice(0, 8)}</span>
                          </div>
                          <h3 className="text-lg font-semibold text-foreground mb-2">{item.dietPlan}</h3>
                          <p className="text-sm text-muted-foreground mb-1">{item.mealType} × {item.quantity}</p>
                          {order && (
                            <>
                              <p className="text-sm text-muted-foreground">{order.clientName}</p>
                              <p className="text-xs text-muted-foreground">{order.clientAddress}</p>
                            </>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 min-w-[200px]">
                          <Select
                            onValueChange={(value) => {
                              const agent = deliveryAgents.find((a: any) => a.id === value);
                              if (agent && order) {
                                assignDeliveryAgent.mutate({
                                  orderId: order.id,
                                  agentId: agent.id,
                                  agentName: agent.name,
                                });
                                handleStatusChange(item.id, "completed");
                              }
                            }}
                          >
                            <SelectTrigger data-testid={`select-agent-${index}`}>
                              <SelectValue placeholder="Assign Delivery Agent" />
                            </SelectTrigger>
                            <SelectContent>
                              {deliveryAgents.map((agent: any) => (
                                <SelectItem key={agent.id} value={agent.id}>
                                  {agent.name} - {agent.vehicleType}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {selectedTab === "completed" && completedOrders.map((item: any, index: number) => {
                  const order = getOrderDetails(item.orderId);
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-card rounded-xl shadow-md p-6"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Badge className="bg-primary text-primary-foreground">Assigned</Badge>
                            <span className="text-sm text-muted-foreground">Order #{item.orderId.slice(0, 8)}</span>
                          </div>
                          <h3 className="text-lg font-semibold text-foreground mb-2">{item.dietPlan}</h3>
                          <p className="text-sm text-muted-foreground mb-1">{item.mealType} × {item.quantity}</p>
                          {order && (
                            <>
                              <p className="text-sm text-muted-foreground">{order.clientName}</p>
                              <p className="text-xs text-muted-foreground">Assigned to: {order.deliveryAgentName}</p>
                            </>
                          )}
                        </div>
                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                      </div>
                    </motion.div>
                  );
                })}

                {selectedTab === "pending" && pendingOrders.length === 0 && (
                  <div className="text-center py-12">
                    <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No pending orders</p>
                  </div>
                )}

                {selectedTab === "preparing" && preparingOrders.length === 0 && (
                  <div className="text-center py-12">
                    <ChefHat className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No orders being prepared</p>
                  </div>
                )}

                {selectedTab === "ready" && readyOrders.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No orders ready for pickup</p>
                  </div>
                )}

                {selectedTab === "completed" && completedOrders.length === 0 && (
                  <div className="text-center py-12">
                    <CheckCircle2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No completed orders today</p>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
