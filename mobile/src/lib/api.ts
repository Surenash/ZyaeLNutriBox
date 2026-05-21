// Simple API client without external dependencies
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:8000' 
  : 'https://your-production-api.com';

export const api = {
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  },

  // Auth endpoints
  login: (email: string, password: string) =>
    api.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  register: (userData: any) =>
    api.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  // Orders endpoints
  getOrders: () => api.request('/api/orders'),
  createOrder: (orderData: any) =>
    api.request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),

  // Meal plans endpoints
  getMealPlans: () => api.request('/api/meal-plans'),
  getMealPlanById: (id: string) => api.request(`/api/meal-plans/${id}`),

  // Nutritionists endpoints
  getNutritionists: () => api.request('/api/nutritionists'),
  bookConsultation: (nutritionistId: string, data: any) =>
    api.request(`/api/nutritionists/${nutritionistId}/book`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export default api;