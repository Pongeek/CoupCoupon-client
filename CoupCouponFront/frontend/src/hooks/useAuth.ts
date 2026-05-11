import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAppDispatch, useAppSelector } from './useAppStore';
import { login, logout, updateToken } from '../store/authSlice';
import { resetStore } from '../store';
import { authService } from '../api/authService';
import type { AuthState, Credentials, Customer } from '../types';

interface JwtPayload {
  id: number;
  userType: string;
  name: string;
  sub: string; // email
  iat: number;
  exp: number;
}

/**
 * Custom hook that centralizes all auth logic:
 * - Login / logout
 * - Token expiration checking
 * - Auto-logout on token expiry
 * - Unified localStorage (removed sessionStorage)
 */
export function useAuth() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const auth = useAppSelector(state => state.auth);

  /**
   * Check if a JWT is expired (or will expire within 30 seconds).
   */
  const isTokenExpired = useCallback((token: string): boolean => {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      // 30-second buffer before actual expiry
      return decoded.exp * 1000 < Date.now() + 30_000;
    } catch {
      return true;
    }
  }, []);

  /**
   * Perform login — calls the API, stores tokens, dispatches to Redux.
   */
  const performLogin = useCallback(async (credentials: Credentials) => {
    const response = await authService.login(credentials);

    const authState: AuthState = {
      id: response.userId,
      email: credentials.email,
      name: response.name,
      userType: response.userType,
      token: response.accessToken,
      isLoggedIn: true,
    };

    dispatch(login(authState));

    // Store refresh token separately (not in Redux — it's long-lived)
    if (response.refreshToken) {
      localStorage.setItem('refreshToken', response.refreshToken);
    }

    // Navigate to role-based dashboard
    switch (response.userType) {
      case 'ADMIN':
        navigate(`/admin/${response.userId}`);
        break;
      case 'COMPANY':
        navigate(`/company/${response.userId}`);
        break;
      case 'CUSTOMER':
        navigate(`/customer/${response.userId}`);
        break;
      default:
        navigate('/');
    }

    return authState;
  }, [dispatch, navigate]);

  /**
   * Perform registration — calls the API, then auto-logs in.
   */
  const performRegister = useCallback(async (
    customer: Omit<Customer, 'id' | 'coupons'>,
    password: string
  ) => {
    await authService.register({ ...customer, password });
    // Auto-login after successful registration
    return performLogin({ email: customer.email, password });
  }, [performLogin]);

  /**
   * Perform logout — clears all state and storage.
   */
  const performLogout = useCallback(() => {
    resetStore();
    // Also clear any legacy sessionStorage
    sessionStorage.removeItem('jwt');
    navigate('/login');
  }, [navigate]);

  /**
   * Check token validity on mount and set up periodic checks.
   * Auto-logout if the access token has expired and refresh fails.
   */
  useEffect(() => {
    if (!auth.isLoggedIn || !auth.token) return;

    const checkAndRefresh = async () => {
      if (isTokenExpired(auth.token)) {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            const { accessToken, refreshToken: newRefreshToken } =
              await authService.refreshToken(refreshToken);
            dispatch(updateToken(accessToken));
            localStorage.setItem('refreshToken', newRefreshToken);
          } catch {
            // Refresh failed → log out
            performLogout();
          }
        } else {
          performLogout();
        }
      }
    };

    // Check immediately on mount
    checkAndRefresh();

    // Check every 60 seconds
    const interval = setInterval(checkAndRefresh, 60_000);
    return () => clearInterval(interval);
  }, [auth.isLoggedIn, auth.token, dispatch, isTokenExpired, performLogout]);

  return {
    ...auth,
    isTokenExpired,
    performLogin,
    performRegister,
    performLogout,
  };
}
