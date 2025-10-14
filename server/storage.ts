import { 
  type User, 
  type InsertUser,
  type Order,
  type InsertOrder,
  type KitchenQueue,
  type InsertKitchenQueue,
  type DeliveryAgent,
  type InsertDeliveryAgent,
  type DeliveryTracking,
  type InsertDeliveryTracking
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Orders
  getAllOrders(): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, updates: Partial<Order>): Promise<Order>;
  
  // Kitchen Queue
  getKitchenQueue(): Promise<KitchenQueue[]>;
  updateKitchenQueue(id: string, updates: Partial<KitchenQueue>): Promise<KitchenQueue>;
  
  // Delivery Agents
  getAllDeliveryAgents(): Promise<DeliveryAgent[]>;
  getAvailableDeliveryAgents(): Promise<DeliveryAgent[]>;
  updateDeliveryAgent(id: string, updates: Partial<DeliveryAgent>): Promise<DeliveryAgent>;
  
  // Delivery Tracking
  getDeliveryTracking(orderId: string): Promise<DeliveryTracking | undefined>;
  createDeliveryTracking(tracking: InsertDeliveryTracking): Promise<DeliveryTracking>;
  updateDeliveryTracking(id: string, updates: Partial<DeliveryTracking>): Promise<DeliveryTracking>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private orders: Map<string, Order>;
  private kitchenQueue: Map<string, KitchenQueue>;
  private deliveryAgents: Map<string, DeliveryAgent>;
  private deliveryTracking: Map<string, DeliveryTracking>;

  constructor() {
    this.users = new Map();
    this.orders = new Map();
    this.kitchenQueue = new Map();
    this.deliveryAgents = new Map();
    this.deliveryTracking = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample delivery agents
    const agent1: DeliveryAgent = {
      id: "agent-1",
      name: "Raj Kumar",
      phone: "+91 98765 43210",
      vehicleType: "Bike",
      vehicleNumber: "KA 01 AB 1234",
      currentLatitude: "12.9716",
      currentLongitude: "77.5946",
      isAvailable: true,
      isOnline: true,
      activeOrderId: null,
      totalDeliveries: 245,
      rating: "4.8",
    };
    
    const agent2: DeliveryAgent = {
      id: "agent-2",
      name: "Priya Singh",
      phone: "+91 98765 43211",
      vehicleType: "Scooter",
      vehicleNumber: "KA 02 CD 5678",
      currentLatitude: "12.9352",
      currentLongitude: "77.6245",
      isAvailable: true,
      isOnline: true,
      activeOrderId: null,
      totalDeliveries: 189,
      rating: "4.9",
    };
    
    this.deliveryAgents.set(agent1.id, agent1);
    this.deliveryAgents.set(agent2.id, agent2);

    // Sample orders
    const order1: Order = {
      id: "order-1",
      clientId: "client-1",
      clientName: "Priya Menon",
      clientPhone: "+91 98765 43210",
      clientAddress: "Flat 204, Green Park Apartments, Koramangala 5th Block, Bengaluru - 560095",
      dietPlan: "Weight Loss Plan",
      mealType: "Breakfast",
      quantity: 1,
      price: "250.00",
      status: "pending",
      kitchenStatus: "pending",
      deliveryAgentId: null,
      deliveryAgentName: null,
      createdAt: new Date(),
      preparedAt: null,
      pickedUpAt: null,
      deliveredAt: null,
      estimatedDeliveryTime: null,
    };

    const order2: Order = {
      id: "order-2",
      clientId: "client-2",
      clientName: "Rohan Sharma",
      clientPhone: "+91 98765 43211",
      clientAddress: "House No. 12, Brigade Road, MG Road, Bengaluru - 560001",
      dietPlan: "Muscle Gain Plan",
      mealType: "Lunch",
      quantity: 1,
      price: "350.00",
      status: "pending",
      kitchenStatus: "pending",
      deliveryAgentId: null,
      deliveryAgentName: null,
      createdAt: new Date(),
      preparedAt: null,
      pickedUpAt: null,
      deliveredAt: null,
      estimatedDeliveryTime: null,
    };

    this.orders.set(order1.id, order1);
    this.orders.set(order2.id, order2);

    // Kitchen queue items
    const queue1: KitchenQueue = {
      id: "queue-1",
      orderId: order1.id,
      dietPlan: order1.dietPlan,
      mealType: order1.mealType,
      quantity: order1.quantity,
      priority: 1,
      status: "pending",
      assignedChef: null,
      startedAt: null,
      completedAt: null,
      estimatedCompletionTime: null,
      createdAt: new Date(),
    };

    const queue2: KitchenQueue = {
      id: "queue-2",
      orderId: order2.id,
      dietPlan: order2.dietPlan,
      mealType: order2.mealType,
      quantity: order2.quantity,
      priority: 1,
      status: "pending",
      assignedChef: null,
      startedAt: null,
      completedAt: null,
      estimatedCompletionTime: null,
      createdAt: new Date(),
    };

    this.kitchenQueue.set(queue1.id, queue1);
    this.kitchenQueue.set(queue2.id, queue2);
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      name: insertUser.name || null,
      phone: insertUser.phone || null,
      address: insertUser.address || null,
      role: insertUser.role || "client"
    };
    this.users.set(id, user);
    return user;
  }

  // Orders
  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = { 
      ...insertOrder, 
      id,
      quantity: insertOrder.quantity || 1,
      status: insertOrder.status || "pending",
      kitchenStatus: insertOrder.kitchenStatus || "pending",
      deliveryAgentId: insertOrder.deliveryAgentId || null,
      deliveryAgentName: insertOrder.deliveryAgentName || null,
      createdAt: new Date(),
      preparedAt: null,
      pickedUpAt: null,
      deliveredAt: null,
      estimatedDeliveryTime: null,
    };
    this.orders.set(id, order);
    
    // Also add to kitchen queue
    const kitchenItem: KitchenQueue = {
      id: randomUUID(),
      orderId: id,
      dietPlan: insertOrder.dietPlan,
      mealType: insertOrder.mealType,
      quantity: insertOrder.quantity || 1,
      priority: 1,
      status: "pending",
      assignedChef: null,
      startedAt: null,
      completedAt: null,
      estimatedCompletionTime: null,
      createdAt: new Date(),
    };
    this.kitchenQueue.set(kitchenItem.id, kitchenItem);
    
    return order;
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
    const order = this.orders.get(id);
    if (!order) throw new Error("Order not found");
    
    const updatedOrder = { ...order, ...updates };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Kitchen Queue
  async getKitchenQueue(): Promise<KitchenQueue[]> {
    return Array.from(this.kitchenQueue.values());
  }

  async updateKitchenQueue(id: string, updates: Partial<KitchenQueue>): Promise<KitchenQueue> {
    const item = this.kitchenQueue.get(id);
    if (!item) throw new Error("Kitchen queue item not found");
    
    const updatedItem = { ...item, ...updates };
    this.kitchenQueue.set(id, updatedItem);
    return updatedItem;
  }

  // Delivery Agents
  async getAllDeliveryAgents(): Promise<DeliveryAgent[]> {
    return Array.from(this.deliveryAgents.values());
  }

  async getAvailableDeliveryAgents(): Promise<DeliveryAgent[]> {
    return Array.from(this.deliveryAgents.values()).filter(
      (agent) => agent.isAvailable && agent.isOnline
    );
  }

  async updateDeliveryAgent(id: string, updates: Partial<DeliveryAgent>): Promise<DeliveryAgent> {
    const agent = this.deliveryAgents.get(id);
    if (!agent) throw new Error("Delivery agent not found");
    
    const updatedAgent = { ...agent, ...updates };
    this.deliveryAgents.set(id, updatedAgent);
    return updatedAgent;
  }

  // Delivery Tracking
  async getDeliveryTracking(orderId: string): Promise<DeliveryTracking | undefined> {
    return Array.from(this.deliveryTracking.values()).find(
      (tracking) => tracking.orderId === orderId
    );
  }

  async createDeliveryTracking(insertTracking: InsertDeliveryTracking): Promise<DeliveryTracking> {
    const id = randomUUID();
    const tracking: DeliveryTracking = { 
      ...insertTracking, 
      id,
      status: insertTracking.status || "assigned",
      estimatedArrivalTime: insertTracking.estimatedArrivalTime || null,
      actualArrivalTime: insertTracking.actualArrivalTime || null,
      distanceRemaining: insertTracking.distanceRemaining || null,
      updatedAt: new Date(),
    };
    this.deliveryTracking.set(id, tracking);
    return tracking;
  }

  async updateDeliveryTracking(id: string, updates: Partial<DeliveryTracking>): Promise<DeliveryTracking> {
    const tracking = this.deliveryTracking.get(id);
    if (!tracking) throw new Error("Delivery tracking not found");
    
    const updatedTracking = { ...tracking, ...updates, updatedAt: new Date() };
    this.deliveryTracking.set(id, updatedTracking);
    return updatedTracking;
  }
}

export const storage = new MemStorage();
