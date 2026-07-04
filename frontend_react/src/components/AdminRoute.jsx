import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

/**
 * Protege rutas exclusivas para ADMIN.
 * - Sin sesión       → /login
 * - Con sesión pero sin rol ADMIN → /dashboard
 */
const AdminRoute = ({ children }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  if (!authService.isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default AdminRoute;
