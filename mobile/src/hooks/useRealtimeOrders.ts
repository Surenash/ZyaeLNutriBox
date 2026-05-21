import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useWebSocket } from './useWebSocket';
import { useAuth } from './useAuth';

interface OrderUpdate {
  orderId: string;
  status: string;
  timestamp: string;
  message?: string;
}

interface KitchenUpdate {
  orderId: string;
  kitchenStatus: string;
  estimatedTime?: number;
  timestamp: string;
}

interface DeliveryUpdate {
  orderId: string;
  deliveryStatus: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  estimatedDelivery?: string;
  timestamp: string;
}

export function useRealtimeOrders() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<OrderUpdate[]>([]);

  const { socket, isConnected, emit, on, off } = useWebSocket({
    url: 'ws://localhost:8000', // Update with your WebSocket URL
    options: {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    },
  });

  // Join user-specific room for real-time updates
  useEffect(() => {
    if (isConnected && user) {
      emit('join_room', { userId: user.id, role: user.role });
    }
  }, [isConnected, user, emit]);

  // Listen for order updates
  useEffect(() => {
    const handleOrderUpdate = (data: OrderUpdate) => {
      console.log('Order update received:', data);
      
      // Add to notifications
      setNotifications(prev => [data, ...prev.slice(0, 9)]); // Keep last 10 notifications
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['kitchen-orders'] });
      queryClient.invalidateQueries({ queryKey: ['delivery-orders'] });
      
      // Show toast notification (implement toast system)
      // showToast(`Order ${data.orderId} status: ${data.status}`);
    };

    const handleKitchenUpdate = (data: KitchenUpdate) => {
      console.log('Kitchen update received:', data);
      queryClient.invalidateQueries({ queryKey: ['kitchen-orders'] });
    };

    const handleDeliveryUpdate = (data: DeliveryUpdate) => {
      console.log('Delivery update received:', data);
      queryClient.invalidateQueries({ queryKey: ['delivery-orders'] });
    };

    if (socket) {
      on('order_update', handleOrderUpdate);
      on('kitchen_update', handleKitchenUpdate);
      on('delivery_update', handleDeliveryUpdate);
    }

    return () => {
      if (socket) {
        off('order_update', handleOrderUpdate);
        off('kitchen_update', handleKitchenUpdate);
        off('delivery_update', handleDeliveryUpdate);
      }
    };
  }, [socket, on, off, queryClient]);

  // Emit order status update
  const updateOrderStatus = (orderId: string, status: string, data?: any) => {
    emit('update_order_status', {
      orderId,
      status,
      data,
      timestamp: new Date().toISOString(),
    });
  };

  // Emit kitchen status update
  const updateKitchenStatus = (orderId: string, status: string, estimatedTime?: number) => {
    emit('update_kitchen_status', {
      orderId,
      status,
      estimatedTime,
      timestamp: new Date().toISOString(),
    });
  };

  // Emit delivery status update
  const updateDeliveryStatus = (orderId: string, status: string, location?: { latitude: number; longitude: number }) => {
    emit('update_delivery_status', {
      orderId,
      status,
      location,
      timestamp: new Date().toISOString(),
    });
  };

  // Clear notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  return {
    isConnected,
    notifications,
    updateOrderStatus,
    updateKitchenStatus,
    updateDeliveryStatus,
    clearNotifications,
  };
}
