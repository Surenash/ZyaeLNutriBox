// WebSocket client for real-time updates
export class DeliveryWebSocket {
  private ws: WebSocket | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  constructor(private url: string) {
    this.connect();
  }

  private connect() {
    if (this.ws?.readyState === WebSocket.OPEN || this.ws?.readyState === WebSocket.CONNECTING) return;

    try {
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = () => {
        if (import.meta.env.DEV) console.log('[WebSocket] Connected');
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = null;
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.emit(data.type, data);
        } catch (error) {
          if (import.meta.env.DEV) console.error('[WebSocket] Parse error:', error);
        }
      };

      this.ws.onerror = (error) => {
        // Silently handle errors in production to avoid console flood
        if (import.meta.env.DEV) console.error('[WebSocket] Error:', error);
      };

      this.ws.onclose = () => {
        if (import.meta.env.DEV) console.log('[WebSocket] Disconnected');
        // Reconnect after 5 seconds instead of 3, and only if not already connecting
        if (!this.reconnectTimeout) {
          this.reconnectTimeout = setTimeout(() => this.connect(), 5000);
        }
      };
    } catch (error) {
      if (import.meta.env.DEV) console.error('[WebSocket] Connection error:', error);
    }
  }

  send(type: string, data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, ...data }));
    }
  }

  on(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    
    // Return cleanup function
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  private emit(event: string, data: any) {
    this.listeners.get(event)?.forEach(callback => callback(data));
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    if (this.ws) {
      this.ws.close();
    }
  }
}

// Singleton instance - construct URL dynamically
function getWebSocketUrl() {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl && apiUrl.startsWith('http')) {
    // If VITE_API_URL is set, derive WS URL from it
    const wsProtocol = apiUrl.startsWith('https') ? 'wss:' : 'ws:';
    const host = apiUrl.replace(/^https?:\/\//, '');
    return `${wsProtocol}//${host}/ws`;
  }
  
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.host;
  const url = `${protocol}//${host}/ws`;
  if (import.meta.env.DEV) console.log('[WebSocket] Connecting to:', url);
  return url;
}

export const deliveryWS = new DeliveryWebSocket(getWebSocketUrl());
