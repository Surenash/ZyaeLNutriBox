import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // WebSocket server for real-time location updates
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });
  
  const clients = new Map<string, any>();
  
  wss.on("connection", (ws, req) => {
    const clientId = req.url?.split("?clientId=")[1] || Math.random().toString();
    clients.set(clientId, ws);
    
    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        // Broadcast location updates to all clients
        if (data.type === "location_update") {
          clients.forEach((client, id) => {
            if (client.readyState === 1 && id !== clientId) {
              client.send(JSON.stringify(data));
            }
          });
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    });
    
    ws.on("close", () => {
      clients.delete(clientId);
    });
  });

  // Orders API
  app.get("/api/orders", async (req, res) => {
    const orders = await storage.getAllOrders();
    res.json(orders);
  });

  app.get("/api/orders/:id", async (req, res) => {
    const order = await storage.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  });

  app.post("/api/orders", async (req, res) => {
    const order = await storage.createOrder(req.body);
    res.json(order);
  });

  app.patch("/api/orders/:id", async (req, res) => {
    const order = await storage.updateOrder(req.params.id, req.body);
    res.json(order);
  });

  // Kitchen Queue API
  app.get("/api/kitchen/queue", async (req, res) => {
    const queue = await storage.getKitchenQueue();
    res.json(queue);
  });

  app.patch("/api/kitchen/queue/:id", async (req, res) => {
    const item = await storage.updateKitchenQueue(req.params.id, req.body);
    res.json(item);
  });

  // Delivery Agents API
  app.get("/api/delivery-agents", async (req, res) => {
    const agents = await storage.getAllDeliveryAgents();
    res.json(agents);
  });

  app.get("/api/delivery-agents/available", async (req, res) => {
    const agents = await storage.getAvailableDeliveryAgents();
    res.json(agents);
  });

  app.patch("/api/delivery-agents/:id", async (req, res) => {
    const agent = await storage.updateDeliveryAgent(req.params.id, req.body);
    res.json(agent);
  });

  // Delivery Tracking API
  app.get("/api/delivery-tracking/:orderId", async (req, res) => {
    const tracking = await storage.getDeliveryTracking(req.params.orderId);
    res.json(tracking);
  });

  app.post("/api/delivery-tracking", async (req, res) => {
    const tracking = await storage.createDeliveryTracking(req.body);
    
    // Broadcast to WebSocket clients
    clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({
          type: "tracking_update",
          data: tracking
        }));
      }
    });
    
    res.json(tracking);
  });

  app.patch("/api/delivery-tracking/:id", async (req, res) => {
    const tracking = await storage.updateDeliveryTracking(req.params.id, req.body);
    
    // Broadcast to WebSocket clients
    clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({
          type: "tracking_update",
          data: tracking
        }));
      }
    });
    
    res.json(tracking);
  });

  return httpServer;
}
