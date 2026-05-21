import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AuthProvider } from '../src/hooks/useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../src/lib/queryClient';

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            animationDuration: 300,
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen 
            name="(auth)" 
            options={{ 
              headerShown: false,
              animation: 'slide_from_bottom',
              animationDuration: 400,
            }} 
          />
          <Stack.Screen 
            name="(tabs)" 
            options={{ 
              headerShown: false,
              animation: 'fade',
              animationDuration: 500,
            }} 
          />
          <Stack.Screen 
            name="(kitchen)" 
            options={{ 
              headerShown: false,
              animation: 'slide_from_right',
              animationDuration: 300,
            }} 
          />
          <Stack.Screen 
            name="(nutritionist)" 
            options={{ 
              headerShown: false,
              animation: 'slide_from_right',
              animationDuration: 300,
            }} 
          />
          <Stack.Screen 
            name="(delivery)" 
            options={{ 
              headerShown: false,
              animation: 'slide_from_right',
              animationDuration: 300,
            }} 
          />
          <Stack.Screen 
            name="(admin)" 
            options={{ 
              headerShown: false,
              animation: 'slide_from_right',
              animationDuration: 300,
            }} 
          />
        </Stack>
      </AuthProvider>
    </QueryClientProvider>
  );
}