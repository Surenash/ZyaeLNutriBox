export interface Order {
  id: string;
  customerName: string;
  mealPlan: string;
  items: string[];
  status: 'pending' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered';
  deliveryTime?: string;
  address?: string;
  coordinates?: { lat: number; lng: number };
}

export interface Appointment {
  id: string;
  customerName: string;
  date: string;
  time: string;
  zoomLink?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface MealPlan {
  id: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  price: number;
  active: boolean;
}

export interface MacroGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}
