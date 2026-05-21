// Type definitions for the mobile app
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'client' | 'kitchen' | 'nutritionist' | 'delivery' | 'admin';
  created_at: string;
}

export interface Order {
  id: string;
  client_id: string;
  client_name: string;
  client_phone: string;
  client_address: string;
  diet_plan: string;
  meal_type: string;
  quantity: number;
  price: number;
  status: 'pending' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered';
  kitchen_status: 'pending' | 'preparing' | 'ready';
  delivery_agent_id?: string;
  delivery_agent_name?: string;
  created_at: string;
  prepared_at?: string;
  picked_up_at?: string;
  delivered_at?: string;
  estimated_delivery_time?: string;
}

export interface MealPlan {
  id: string;
  title: string;
  description: string;
  category: string;
  originalPrice: number;
  currentPrice: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  imageUrl?: string;
  features?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Nutritionist {
  id: string;
  name: string;
  email: string;
  phone?: string;
  specialization?: string;
  bio?: string;
  imageUrl?: string;
  rating: number;
  experienceYears: number;
  totalClients: number;
  isAvailable: boolean;
  createdAt: string;
}

export interface DeliveryTracking {
  id: string;
  order_id: string;
  delivery_agent_id: string;
  current_latitude: number;
  current_longitude: number;
  destination_latitude: number;
  destination_longitude: number;
  status: 'assigned' | 'picked_up' | 'in_transit' | 'delivered';
  estimated_arrival_time?: string;
  actual_arrival_time?: string;
  distance_remaining?: number;
  updated_at: string;
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  role?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// Kitchen queue types
export interface KitchenQueue {
  id: string;
  order_id: string;
  meal_name: string;
  meal_type: string;
  diet_plan: string;
  special_instructions?: string;
  status: 'pending' | 'preparing' | 'ready';
  chef_assigned?: string;
  prep_time_minutes?: number;
  created_at: string;
  started_at?: string;
  completed_at?: string;
}

// Delivery agent types
export interface DeliveryAgent {
  id: string;
  name: string;
  phone: string;
  vehicle_type: string;
  vehicle_number?: string;
  current_latitude?: number;
  current_longitude?: number;
  is_available: boolean;
  total_deliveries: number;
  rating: number;
  created_at: string;
}

// Consultation types
export interface Consultation {
  id: string;
  client_id: string;
  nutritionist_id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
}

// Location types
export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

// Notification types
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'order_update' | 'delivery_update' | 'consultation' | 'general';
  is_read: boolean;
  created_at: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Additional types from backend schemas
export interface Subscription {
  id: string;
  userId: string;
  mealPlanId: string;
  startDate: string;
  endDate?: string;
  status: string;
  pricePaid: number;
  paymentMethod?: string;
  createdAt: string;
}

export interface Client {
  id: string;
  userId: string;
  nutritionistId?: string;
  weightStart?: number;
  weightCurrent?: number;
  weightGoal?: number;
  height?: number;
  age?: number;
  gender?: string;
  healthConditions?: string;
  dietaryPreferences?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Session {
  id: string;
  clientId: string;
  nutritionistId: string;
  sessionDate: string;
  durationMinutes: number;
  notes?: string;
  status: string;
  meetingLink?: string;
  createdAt: string;
  completedAt?: string;
}

export interface ProgressLog {
  id: string;
  clientId: string;
  logDate: string;
  weight?: number;
  caloriesConsumed?: number;
  proteinIntake?: number;
  waterIntakeLiters?: number;
  mealCompletionPercent?: number;
  notes?: string;
  createdAt: string;
}
