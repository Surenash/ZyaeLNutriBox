import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("client"),
  name: text("name"),
  phone: text("phone"),
  address: text("address"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull(),
  clientName: text("client_name").notNull(),
  clientPhone: text("client_phone").notNull(),
  clientAddress: text("client_address").notNull(),
  dietPlan: text("diet_plan").notNull(),
  mealType: text("meal_type").notNull(),
  quantity: integer("quantity").notNull().default(1),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  kitchenStatus: text("kitchen_status").notNull().default("pending"),
  deliveryAgentId: varchar("delivery_agent_id"),
  deliveryAgentName: text("delivery_agent_name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  preparedAt: timestamp("prepared_at"),
  pickedUpAt: timestamp("picked_up_at"),
  deliveredAt: timestamp("delivered_at"),
  estimatedDeliveryTime: timestamp("estimated_delivery_time"),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export const deliveryTracking = pgTable("delivery_tracking", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull(),
  deliveryAgentId: varchar("delivery_agent_id").notNull(),
  currentLatitude: decimal("current_latitude", { precision: 10, scale: 7 }).notNull(),
  currentLongitude: decimal("current_longitude", { precision: 10, scale: 7 }).notNull(),
  destinationLatitude: decimal("destination_latitude", { precision: 10, scale: 7 }).notNull(),
  destinationLongitude: decimal("destination_longitude", { precision: 10, scale: 7 }).notNull(),
  status: text("status").notNull().default("assigned"),
  estimatedArrivalTime: timestamp("estimated_arrival_time"),
  actualArrivalTime: timestamp("actual_arrival_time"),
  distanceRemaining: decimal("distance_remaining", { precision: 10, scale: 2 }),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertDeliveryTrackingSchema = createInsertSchema(deliveryTracking).omit({
  id: true,
  updatedAt: true,
});

export type InsertDeliveryTracking = z.infer<typeof insertDeliveryTrackingSchema>;
export type DeliveryTracking = typeof deliveryTracking.$inferSelect;

export const kitchenQueue = pgTable("kitchen_queue", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull(),
  dietPlan: text("diet_plan").notNull(),
  mealType: text("meal_type").notNull(),
  quantity: integer("quantity").notNull(),
  priority: integer("priority").notNull().default(1),
  status: text("status").notNull().default("pending"),
  assignedChef: text("assigned_chef"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  estimatedCompletionTime: timestamp("estimated_completion_time"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertKitchenQueueSchema = createInsertSchema(kitchenQueue).omit({
  id: true,
  createdAt: true,
});

export type InsertKitchenQueue = z.infer<typeof insertKitchenQueueSchema>;
export type KitchenQueue = typeof kitchenQueue.$inferSelect;

export const deliveryAgents = pgTable("delivery_agents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  vehicleType: text("vehicle_type").notNull(),
  vehicleNumber: text("vehicle_number").notNull(),
  currentLatitude: decimal("current_latitude", { precision: 10, scale: 7 }),
  currentLongitude: decimal("current_longitude", { precision: 10, scale: 7 }),
  isAvailable: boolean("is_available").notNull().default(true),
  isOnline: boolean("is_online").notNull().default(false),
  activeOrderId: varchar("active_order_id"),
  totalDeliveries: integer("total_deliveries").notNull().default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("5.00"),
});

export const insertDeliveryAgentSchema = createInsertSchema(deliveryAgents).omit({
  id: true,
});

export type InsertDeliveryAgent = z.infer<typeof insertDeliveryAgentSchema>;
export type DeliveryAgent = typeof deliveryAgents.$inferSelect;
