/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Home } from './components/Home';
import { LandingPage } from './components/LandingPage';
import { LandingPage2 } from './components/LandingPage2';
import { SignUp } from './components/SignUp';
import { ManagementPortal } from './components/ManagementPortal';
import { ManagementPortalOriginal } from './components/ManagementPortalM2';
import { CustomerPortal } from './portals/CustomerPortal';
import { NutritionistPortal } from './portals/NutritionistPortal';
import { KitchenPortal } from './portals/KitchenPortal';
import { DeliveryPortal } from './portals/DeliveryPortal';
import { AdminPortal } from './portals/AdminPortal';
import { Login } from './components/Login';

function AuthWrapper({ portalName, children }: { portalName: string, children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <Login portalName={portalName} onLogin={() => setIsAuthenticated(true)} />;
  }

  return children;
}

import { NewsPage } from './components/NewsPage';
import { ArticlePage } from './components/ArticlePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage2 />} />
        <Route path="/Landingpage-original" element={<LandingPage />} />
        <Route path="/home-alternative" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/management" element={<ManagementPortal />} />
        <Route path="/M2" element={<ManagementPortalOriginal />} />
        
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:id" element={<ArticlePage />} />
        <Route path="/customer/*" element={
          <AuthWrapper portalName="Customer Portal">
            <CustomerPortal />
          </AuthWrapper>
        } />
        
        <Route path="/nutritionist/*" element={
          <AuthWrapper portalName="Nutritionist Portal">
            <NutritionistPortal />
          </AuthWrapper>
        } />
        
        <Route path="/kitchen/*" element={
          <AuthWrapper portalName="Kitchen KDS">
            <KitchenPortal />
          </AuthWrapper>
        } />
        
        <Route path="/delivery/*" element={
          <AuthWrapper portalName="Driver Portal">
            <DeliveryPortal />
          </AuthWrapper>
        } />
        
        <Route path="/admin/*" element={
          <AuthWrapper portalName="Admin Platform">
            <AdminPortal />
          </AuthWrapper>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
