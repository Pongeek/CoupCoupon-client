import client from './client';
import type { Credentials, LoginResponse, Customer } from '../types';

export const authService = {
  login(credentials: Credentials): Promise<LoginResponse> {
    return client.post<LoginResponse>('/auth/login', credentials).then((r) => r.data);
  },

  register(customer: Omit<Customer, 'id' | 'coupons'>): Promise<void> {
    return client.post('/auth/register', customer).then(() => undefined);
  },

  refreshToken(
    token: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return client
      .post<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
        refreshToken: token,
      })
      .then((r) => r.data);
  },

  checkEmail(email: string): Promise<boolean> {
    return client
      .get<boolean>(`/auth/check-email/${encodeURIComponent(email)}`)
      .then((r) => r.data);
  },
};
