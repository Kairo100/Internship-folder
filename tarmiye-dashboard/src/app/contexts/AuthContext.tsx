// // 'use client';

// // import React, { createContext, useContext } from 'react';

// // interface LoginData {
// //   email: string;
// //   password: string;
// //   rememberMe?: boolean;
// // }

// // interface SignupData {
// //   name: string;
// //   email: string;
// //   password: string;
// // }

// // export interface AuthContextType {
// //   login: (data: LoginData) => Promise<void>;
// //   signup: (data: SignupData) => Promise<void>;
// // }

// // export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // export const useAuth = (): AuthContextType => {
// //   const context = useContext(AuthContext);
// //   if (!context) {
// //     throw new Error('useAuth must be used within an AuthProvider');
// //   }
// //   return context;
// // };

// 'use client'

// import React, { createContext, useContext } from 'react'

// interface LoginData {
//   email: string
//   password: string
//   rememberMe?: boolean
// }

// interface SignupData {
//   name: string
//   email: string
//   password: string
// }

// export interface AuthContextType {
//   user: any
//   token: string | null
//   isAuthenticated: boolean
//   loading: boolean
//   login: (token: string, user: any) => void
//   logout: () => void
// }

// export const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext)
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider')
//   }
//   return context
// }















// src/app/contexts/AuthContext.ts

import React, { createContext, useContext } from 'react';
import { LoginResponse, User } from '@/types/auth'; // Assuming LoginResponse is from your types/auth

export interface LoginData {
  email: string;
  password: string;
//   rememberMe?: boolean;
}

 export interface SignupData {
  name: string;
  email: string;
  password: string;
  password_confirm: string; // Add this line
}
// export interface AuthContextType {
//   user: any;
//   token: string | null;
//   isAuthenticated: boolean;
//   loading: boolean;
//   login: (token: string, user: any) => void;
//   logout: () => void;
//   // Add signup function to AuthContextType
//   signup: (userData: SignupData) => Promise<LoginResponse>; // Expects the return type of your API signup
// }
export interface AuthContextType {
  user: any;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  // EXISTING LOGIN: This is for updating state *after* a successful API call
  updateAuthState: (token: string, user: any) => void; // Renamed for clarity
  logout: () => void;
  signup: (userData: SignupData) => Promise<LoginResponse>;

  // >>> NEW LOGIN FUNCTION FOR INITIATING API CALL <<<
  login: (credentials: LoginData) => Promise<LoginResponse>; // This will perform the API call
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};