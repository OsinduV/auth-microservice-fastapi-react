import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

/**
 * Wraps routes that require an authenticated session.
 * Shows a minimal spinner while the auth state is being restored from localStorage,
 * then redirects to /login if the user is not authenticated.
 */
const ProtectedRoute = () => {
  const { isAuthenticated, isInitialising } = useAuthContext();

  if (isInitialising) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
