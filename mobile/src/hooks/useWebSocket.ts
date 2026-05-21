import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface WebSocketConfig {
  url: string;
  options?: {
    autoConnect?: boolean;
    reconnection?: boolean;
    reconnectionAttempts?: number;
    reconnectionDelay?: number;
  };
}

interface WebSocketHook {
  socket: Socket | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connect: () => void;
  disconnect: () => void;
  emit: (event: string, data?: any) => void;
  on: (event: string, callback: (data: any) => void) => void;
  off: (event: string, callback?: (data: any) => void) => void;
}

export function useWebSocket(config: WebSocketConfig): WebSocketHook {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const connect = () => {
    if (socketRef.current?.connected) return;

    setIsConnecting(true);
    setError(null);

    try {
      const newSocket = io(config.url, {
        autoConnect: config.options?.autoConnect ?? true,
        reconnection: config.options?.reconnection ?? true,
        reconnectionAttempts: config.options?.reconnectionAttempts ?? 5,
        reconnectionDelay: config.options?.reconnectionDelay ?? 1000,
      });

      newSocket.on('connect', () => {
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
        console.log('WebSocket connected');
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
        setIsConnecting(false);
        console.log('WebSocket disconnected');
      });

      newSocket.on('connect_error', (err) => {
        setIsConnected(false);
        setIsConnecting(false);
        setError(err.message);
        console.error('WebSocket connection error:', err);
      });

      newSocket.on('reconnect', () => {
        setIsConnected(true);
        setError(null);
        console.log('WebSocket reconnected');
      });

      newSocket.on('reconnect_error', (err) => {
        setError(err.message);
        console.error('WebSocket reconnection error:', err);
      });

      socketRef.current = newSocket;
      setSocket(newSocket);
    } catch (err) {
      setIsConnecting(false);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
      setIsConnected(false);
      setIsConnecting(false);
    }
  };

  const emit = (event: string, data?: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn('WebSocket not connected, cannot emit event:', event);
    }
  };

  const on = (event: string, callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  const off = (event: string, callback?: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  };

  useEffect(() => {
    if (config.options?.autoConnect !== false) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [config.url]);

  return {
    socket,
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    emit,
    on,
    off,
  };
}