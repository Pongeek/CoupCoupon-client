// ──────────────────────────────────────────────
// Enums
// ──────────────────────────────────────────────

export enum Category {
  FOOD = "FOOD",
  SPA = "SPA",
  RESTAURANT = "RESTAURANT",
  VACATION = "VACATION",
  CONCERTS = "CONCERTS",
  ELECTRICITY = "ELECTRICITY",
}

export enum UserType {
  ADMIN = "ADMIN",
  COMPANY = "COMPANY",
  CUSTOMER = "CUSTOMER",
}

// ──────────────────────────────────────────────
// Domain Models
// ──────────────────────────────────────────────

export interface Coupon {
  id: number;
  companyID: number;
  category: Category | string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  amount: number;
  price: number;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Company {
  id: number;
  name: string;
  email: string;
  password?: string;
  coupons: Coupon[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  coupons: Coupon[];
  createdAt?: string;
  updatedAt?: string;
}

// ──────────────────────────────────────────────
// Auth
// ──────────────────────────────────────────────

export interface Credentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userType: string;
  userId: number;
  name: string;
}

export interface AuthState {
  id: number;
  email: string;
  name: string;
  userType: string;
  token: string;
  isLoggedIn: boolean;
}

// ──────────────────────────────────────────────
// API
// ──────────────────────────────────────────────

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  fieldErrors?: Record<string, string>;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
