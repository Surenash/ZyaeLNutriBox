import { useEffect } from "react";
import { deliveryWS } from "@/lib/websocket";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface RealtimeEvent {
  type: string;
  data?: any;
  [key: string]: any;
}

interface RealtimeOptions {
  events: string[];
  onEvent?: (event: RealtimeEvent) => void;
  showToast?: boolean;
  invalidateQueries?: string[][];
}

export function useRealtime(options: RealtimeOptions) {
  const { toast } = useToast();
  const { events, onEvent, showToast = false, invalidateQueries = [] } = options;

  useEffect(() => {
    const unsubscribers = events.map((eventType) => {
      return deliveryWS.on(eventType, async (event: RealtimeEvent) => {
        console.log(`[Realtime] Received ${eventType}:`, event);

        // Call custom event handler if provided
        if (onEvent) {
          onEvent(event);
        }

        // Invalidate specified queries
        for (const queryKey of invalidateQueries) {
          await queryClient.invalidateQueries({ queryKey });
        }

        // Show toast notification if enabled
        if (showToast) {
          const toastMessages: { [key: string]: { title: string; description: string } } = {
            meal_plan_created: {
              title: "New Meal Plan",
              description: "A new meal plan has been added",
            },
            meal_plan_updated: {
              title: "Meal Plan Updated",
              description: "A meal plan has been modified",
            },
            meal_plan_deleted: {
              title: "Meal Plan Removed",
              description: "A meal plan has been deleted",
            },
            client_created: {
              title: "New Client",
              description: "A new client has joined",
            },
            client_updated: {
              title: "Client Updated",
              description: "Client information has been updated",
            },
            session_created: {
              title: "New Session",
              description: "A new consultation session has been scheduled",
            },
            session_updated: {
              title: "Session Updated",
              description: "Session details have been modified",
            },
            progress_log_created: {
              title: "Progress Update",
              description: "New progress has been logged",
            },
            order_created: {
              title: "New Order",
              description: "A new order has been placed",
            },
            order_updated: {
              title: "Order Updated",
              description: "Order status has changed",
            },
            kitchen_queue_updated: {
              title: "Kitchen Update",
              description: "Meal preparation status updated",
            },
            location_update: {
              title: "Delivery Update",
              description: "Delivery location updated",
            },
          };

          const message = toastMessages[eventType];
          if (message) {
            toast({
              title: message.title,
              description: message.description,
            });
          }
        }
      });
    });

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [events, onEvent, showToast, invalidateQueries, toast]);
}
