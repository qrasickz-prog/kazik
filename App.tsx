import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { AppLayout } from './components/Layout';
import { Transfers } from './pages/Transfers';
import { Casino } from './pages/Casino';
import { AdminDashboard } from './pages/Admin';
import { CardsPage } from './pages/Cards';
import { WorkPage } from './pages/Work';
import { ProfilePage } from './pages/Profile';
import { LandingPage } from './pages/Landing';
import { PrivacyPage, TermsPage, SupportPage } from './pages/Static';
import { NotificationContainer } from './components/UI';

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  if (!isLoading && user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <>
      <NotificationContainer />
      <Routes>
        <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><AuthPage /></PublicRoute>} />
        
        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="cards" element={<CardsPage />} />
          <Route path="transfers" element={<Transfers />} />
          <Route path="work" element={<WorkPage />} />
          <Route path="casino" element={<Casino />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="support" element={<SupportPage />} />
        </Route>
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
};

export default App;