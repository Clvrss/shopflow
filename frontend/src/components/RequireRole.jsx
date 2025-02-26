import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RequireRole({ roles = [], children }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles.length && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}
