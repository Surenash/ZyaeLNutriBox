/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';

import { LandingPage2 } from './components/LandingPage';
import { SignUp } from './components/SignUp';
import { CustomerPortal } from './portals/CustomerPortal';
import { NutritionistPortal } from './portals/NutritionistPortal';
import { KitchenPortal } from './portals/KitchenPortal';
import { DeliveryPortal } from './portals/DeliveryPortal';
import { AdminPortal } from './portals/AdminPortal';
import { Login } from './components/Login';
import { NewsPage } from './components/NewsPage';
import { ArticlePage } from './components/ArticlePage';
import { MediaPortal } from './portals/MediaPortal';

// --- AIRTIGHT SECURITY WRAPPER ---
function AuthWrapper({ allowedRoles, children }: { allowedRoles: string[], children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  const userRole = String(localStorage.getItem('role') || '').toUpperCase();

  // 1. If not logged in at all, kick to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Strict Role Check
  const hasAccess = allowedRoles.some(role => userRole.includes(role));
  
  if (!hasAccess) {
    // Kick unauthorized users back to THEIR proper dashboard
    if (userRole.includes('ADMIN') && !userRole.includes('KITCHEN')) return <Navigate to="/admin" replace />;
    if (userRole.includes('KITCHEN')) return <Navigate to="/kitchen" replace />;
    if (userRole.includes('NUTR')) return <Navigate to="/nutritionist" replace />;
    if (userRole.includes('DRIV') || userRole.includes('DELIVERY')) return <Navigate to="/delivery" replace />;
    
    return <Navigate to="/customer" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage2 />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:id" element={<ArticlePage />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Universal Login */}
        <Route path="/login" element={<Login portalName="ZyaeL Portal Access" onLogin={() => {}} />} />
        <Route path="/signin" element={<Navigate to="/login" replace />} />
        
        {/* --- SECURED PORTAL ROUTES --- */}
        <Route path="/customer/*" element={
          <AuthWrapper allowedRoles={['CUSTOMER']}>
            <CustomerPortal />
          </AuthWrapper>
        } />
        
        <Route path="/nutritionist/*" element={
          <AuthWrapper allowedRoles={['NUTRITIONIST', 'NUTR']}>
            <NutritionistPortal />
          </AuthWrapper>
        } />
        
        <Route path="/kitchen/*" element={
          <AuthWrapper allowedRoles={['KITCHEN', 'KITCHEN_ADMIN']}>
            <KitchenPortal />
          </AuthWrapper>
        } />

        <Route path="/media/*" element={
          <AuthWrapper allowedRoles={['ADMIN', 'SUPER_ADMIN', 'MEDIA']}>
            <MediaPortal />
          </AuthWrapper>
        } />
        
        <Route path="/delivery/*" element={
          <AuthWrapper allowedRoles={['DRIVER', 'DELIVERY']}>
            <DeliveryPortal />
          </AuthWrapper>
        } />
        
        <Route path="/admin/*" element={
          <AuthWrapper allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
            <AdminPortal />
          </AuthWrapper>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}