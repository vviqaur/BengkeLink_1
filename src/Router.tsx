import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import IndexPage from './pages/Index';
import CustomerDashboard from './pages/CustomerDashboard';
import WorkshopDashboard from './pages/workshop/WorkshopDashboard';
import TechnicianDashboard from './pages/technician/TechnicianDashboard';
import NotFound from './pages/NotFound';
import SignUpPage from './pages/SignUpPage';
import PromoDetailPage from './pages/PromoDetailPage';
import { UserRole } from './types/auth';

// Protected route component that checks authentication and user role
const ProtectedRoute = ({ requiredRole, redirectTo = '/', children }: { requiredRole?: UserRole, redirectTo?: string, children: React.ReactNode }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><div>Loading...</div></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If a specific role is required and user doesn't have it, redirect
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to the appropriate dashboard based on user role
    const userRole = user?.role || 'customer';
    const roleBasedRedirect = {
      'customer': '/dashboard',
      'workshop': '/workshop/dashboard',
      'technician': '/technician/dashboard'
    }[userRole];
    
    return <Navigate to={roleBasedRedirect || redirectTo} replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><div>Loading...</div></div>;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={!isAuthenticated ? <IndexPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/signup" element={!isAuthenticated ? <SignUpPage /> : <Navigate to="/dashboard" replace />} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute requiredRole="customer">
          <CustomerDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/workshop/*" element={
        <ProtectedRoute requiredRole="workshop" redirectTo="/workshop/dashboard">
          <Routes>
            <Route path="dashboard" element={<WorkshopDashboard />} />
            {/* Add other workshop routes here */}
          </Routes>
        </ProtectedRoute>
      } />
      
      <Route path="/technician/*" element={
        <ProtectedRoute requiredRole="technician" redirectTo="/technician/dashboard">
          <Routes>
            <Route path="dashboard" element={<TechnicianDashboard />} />
            {/* Add other technician routes here */}
          </Routes>
        </ProtectedRoute>
      } />
      
      <Route 
        path="/promo/:promoId"
        element={
          <ProtectedRoute>
            <PromoDetailPage />
          </ProtectedRoute>
        }
      />
      
      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const AppRouter = () => {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Router>
    )
}

export default AppRouter;
