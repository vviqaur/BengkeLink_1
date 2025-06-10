import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import LoadingScreen from '@/components/LoadingScreen';
import AuthWrapper from '@/components/AuthWrapper';

const Index = () => {
  const [showLoading, setShowLoading] = useState(true);
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 1000); // Reduced loading time for better UX

    return () => clearTimeout(timer);
  }, []);

  // Show loading screen on first visit
  if (showLoading) {
    return <LoadingScreen />;
  }

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show auth forms if not authenticated
  if (!isAuthenticated || !user) {
    return <AuthWrapper />;
  }

  // Redirect to appropriate dashboard based on user role
  switch (user.role) {
    case 'customer':
      return <Navigate to="/dashboard" replace />;
    case 'technician':
      return <Navigate to="/technician/dashboard" replace />;
    case 'workshop':
      return <Navigate to="/workshop/dashboard" replace />;
    default:
      return <AuthWrapper />;
  }
};

export default Index;
