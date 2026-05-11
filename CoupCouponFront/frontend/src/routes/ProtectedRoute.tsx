import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppStore';

interface ProtectedRouteProps {
  /** The component/element to render if access is granted */
  children: React.ReactNode;
  /** Required user role(s) to access this route */
  allowedRoles: string[];
  /** If true, verify the :id param matches the logged-in user's ID */
  checkOwnership?: boolean;
}

/**
 * Route guard that checks:
 * 1. Is the user authenticated? → redirect to /login if not
 * 2. Does the user have the required role? → redirect to /unauthorized if not
 * 3. (optional) Does the route :id param match the logged-in user? → redirect to /unauthorized if not
 */
export function ProtectedRoute({
  children,
  allowedRoles,
  checkOwnership = false,
}: ProtectedRouteProps): JSX.Element {
  const { isLoggedIn, userType, id: userId } = useAppSelector(state => state.auth);
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  // 1. Not authenticated → redirect to login (preserve intended destination)
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Wrong role → unauthorized
  if (!allowedRoles.includes(userType)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. Ownership check — the :id in the URL must match the logged-in user's ID
  if (checkOwnership && id && Number(id) !== userId) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
