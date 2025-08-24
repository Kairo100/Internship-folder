// src/lib/auth.ts
import { AuthPayload, User } from '@/types/auth';
import { jwtDecode } from 'jwt-decode'; 

const TOKEN_KEY = 'jwt';
const USER_KEY = 'user';

export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

export const decodeAuthToken = (token: string): AuthPayload | null => {
  try {
    return jwtDecode<AuthPayload>(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const setUserData = (user: User) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};
export const getUserData = (): User | null => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem(USER_KEY);

    // Check for null, empty string, or "undefined"
    if (!userData || userData === 'undefined') {
      return null;
    }

    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Failed to parse user data from localStorage:', error);
      return null;
    }
  }
  return null;
};

// export const getUserData = (): User | null => {
//   if (typeof window !== 'undefined') {
//     const userData = localStorage.getItem(USER_KEY);
//     return userData ? JSON.parse(userData) : null;
//   }
//   return null;
// };

// Function to check if token is expired
export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  const decoded = decodeAuthToken(token);
  if (!decoded || !decoded.exp) return true;
  const currentTime = Date.now() / 1000; // in seconds
  return decoded.exp < currentTime;
};
