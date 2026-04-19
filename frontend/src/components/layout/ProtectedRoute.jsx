import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Spinner from '../ui/Spinner';

export default function ProtectedRoute({ children, requireRole }) {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireRole && role !== requireRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
