import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppStore';

interface RedirectAuthenticatedProps {
  children: React.ReactNode;
}

/**
 * Wrapper for public-only routes (login, register).
 * If the user is already logged in, redirects to their role-specific dashboard.
 */
export function RedirectAuthenticated({ children }: RedirectAuthenticatedProps): JSX.Element {
  const { isLoggedIn, userType, id } = useAppSelector(state => state.auth);

  if (isLoggedIn) {
    switch (userType) {
      case 'ADMIN':
        return <Navigate to={`/admin/${id}`} replace />;
      case 'COMPANY':
        return <Navigate to={`/company/${id}`} replace />;
      case 'CUSTOMER':
        return <Navigate to={`/customer/${id}`} replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
