// src/types/auth.ts

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Agent' | 'Leader' | 'Member';
  // Add other user properties from your backend User model
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean; // For initial auth check
  login: (token: string, user: User) => void;
  logout: () => void;
}

// For JWT decoding (if you use jwt-decode)
export interface AuthPayload {
  id: number;
  iat: number;
  exp: number;
}
