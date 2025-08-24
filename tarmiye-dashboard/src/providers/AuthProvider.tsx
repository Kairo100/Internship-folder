// 'use client';

// import React, { createContext, useState, useEffect, useContext } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import { AuthContextType, User } from '@/types/auth'; // Adjust path as needed
// import {
//   getAuthToken,
//   setAuthToken,
//   removeAuthToken,
//   getUserData,
//   setUserData,
//   isTokenExpired,
// } from '@/lib/auth'; // Adjust path as needed
// import Spinner from '@/app/components/spinner'; // Adjust path

// // Create context
// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
//   const [loading, setLoading] = useState<boolean>(true);

//   const router = useRouter();
//   const pathname = usePathname();

//   /** Handle Login */
//   const login = (newToken: string, newUser: User) => {
//     setAuthToken(newToken);
//     setUserData(newUser);
//     setToken(newToken);
//     setUser(newUser);
//     setIsAuthenticated(true);
//     router.replace('/dashboard'); // redirect to dashboard
//   };

//   /** Handle Logout */
//   const logout = () => {
//     removeAuthToken();
//     setToken(null);
//     setUser(null);
//     setIsAuthenticated(false);
//     router.replace('/auth/login'); // redirect to login
//   };

//   /** Check auth on mount and when route changes */
//   useEffect(() => {
//     const checkAuth = () => {
//       const storedToken = getAuthToken();
//       const storedUser = getUserData();

//       if (storedToken && storedUser && !isTokenExpired(storedToken)) {
//         setToken(storedToken);
//         setUser(storedUser);
//         setIsAuthenticated(true);

//         // Redirect authenticated user away from auth pages
//         if (pathname.startsWith('/auth')) {
//           router.replace('/dashboard');
//         }
//       } else {
//         // Expired or no token
//         removeAuthToken();
//         setToken(null);
//         setUser(null);
//         setIsAuthenticated(false);

//         // Redirect unauthenticated user from protected routes
//         if (pathname.startsWith('/dashboard')) {
//           router.replace('/auth/login');
//         }
//       }

//       setLoading(false);
//     };

//     checkAuth();

//     // Re-check when focus returns (handle expired sessions)
//     window.addEventListener('focus', checkAuth);
//     return () => window.removeEventListener('focus', checkAuth);
//   }, [pathname, router]);

//   if (loading) {
//     return <Spinner />; // show spinner while checking auth
//   }

//   return (
//     <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Hook to use auth context
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };













// 'use client'

// import React, { useState, useEffect } from 'react'
// import { useRouter, usePathname } from 'next/navigation'
// import { AuthContext } from '@/app/contexts/AuthContext'
// import {
//   getAuthToken,
//   setAuthToken,
//   removeAuthToken,
//   getUserData,
//   setUserData,
//   isTokenExpired
// } from '@/lib/auth'
// import Spinner from '@/app/components/spinner'

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<any>(null)
//   const [token, setToken] = useState<string | null>(null)
//   const [isAuthenticated, setIsAuthenticated] = useState(false)
//   const [loading, setLoading] = useState(true)

//   const router = useRouter()
//   const pathname = usePathname()

//   const login = (newToken: string, newUser: any) => {
//     setAuthToken(newToken)
//     setUserData(newUser)
//     setToken(newToken)
//     setUser(newUser)
//     setIsAuthenticated(true)
//     router.replace('/dashboard')
//   }

//   const logout = () => {
//     removeAuthToken()
//     setToken(null)
//     setUser(null)
//     setIsAuthenticated(false)
//     router.replace('/auth/login')
//   }

//   useEffect(() => {
//     const checkAuth = () => {
//       const storedToken = getAuthToken()
//       const storedUser = getUserData()

//       if (storedToken && storedUser && !isTokenExpired(storedToken)) {
//         setToken(storedToken)
//         setUser(storedUser)
//         setIsAuthenticated(true)

//         if (pathname.startsWith('/auth')) router.replace('/dashboard')
//       } else {
//         removeAuthToken()
//         setToken(null)
//         setUser(null)
//         setIsAuthenticated(false)

//         if (pathname.startsWith('/dashboard')) router.replace('/auth/login')
//       }

//       setLoading(false)
//     }

//     checkAuth()

//     window.addEventListener('focus', checkAuth)
//     return () => window.removeEventListener('focus', checkAuth)
//   }, [pathname, router])

//   if (loading) return <Spinner />

//   return (
//     <AuthContext.Provider
//       value={{ user, token, isAuthenticated, loading, login, logout }}
//     >
//       {children}
//     </AuthContext.Provider>
//   )
// }



























// // src/providers/AuthProvider.tsx

// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import { AuthContext } from '@/app/contexts/AuthContext';
// import {
//   getAuthToken,
//   setAuthToken,
//   removeAuthToken,
//   getUserData,
//   setUserData,
//   isTokenExpired,
// } from '@/lib/auth';
// import Spinner from '@/app/components/spinner';
// import { login as apiLogin, signup as apiSignup } from '@/api/auth'; // Import your API functions
// import { LoginResponse, User } from '@/types/auth'; // Assuming you have these types

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null); // Use User type
//   const [token, setToken] = useState<string | null>(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const router = useRouter();
//   const pathname = usePathname();

//   const login = (newToken: string, newUser: User) => { // Use User type
//     setAuthToken(newToken);
//     setUserData(newUser);
//     setToken(newToken);
//     setUser(newUser);
//     setIsAuthenticated(true);
//     router.replace('/dashboard');
//   };

//   const logout = () => {
//     removeAuthToken();
//     setToken(null);
//     setUser(null);
//     setIsAuthenticated(false);
//     router.replace('/auth/login');
//   };

//   // Implement the signup function here
//   const signup = async (userData: any): Promise<LoginResponse> => {
//     try {
//       const response = await apiSignup(userData); // Call your API signup function
//       // If signup is successful, automatically log the user in
//       if (response.user && response.token) {
//         login(response.token, response.user);
//       }
//       return response;
//     } catch (error) {
//       console.error("AuthContext Signup error:", error);
//       throw error; // Re-throw the error for the component to handle
//     }
//   };

//   useEffect(() => {
//     const checkAuth = () => {
//       const storedToken = getAuthToken();
//       const storedUser = getUserData();

//       if (storedToken && storedUser && !isTokenExpired(storedToken)) {
//         setToken(storedToken);
//         setUser(storedUser);
//         setIsAuthenticated(true);

//         if (pathname.startsWith('/auth')) router.replace('/dashboard');
//       } else {
//         removeAuthToken();
//         setToken(null);
//         setUser(null);
//         setIsAuthenticated(false);

//         if (pathname.startsWith('/dashboard')) router.replace('/auth/login');
//       }

//       setLoading(false);
//     };

//     checkAuth();

//     window.addEventListener('focus', checkAuth);
//     return () => window.removeEventListener('focus', checkAuth);
//   }, [pathname, router]);

//   if (loading) return <Spinner />;

//   return (
//     <AuthContext.Provider
//       value={{ user, token, isAuthenticated, loading, login, logout, signup }} // Provide signup here
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };
















// // src/providers/AuthProvider.tsx

// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import { AuthContext } from '@/app/contexts/AuthContext';
// import {
//   getAuthToken,
//   setAuthToken,
//   removeAuthToken,
//   getUserData,
//   setUserData,
//   isTokenExpired,
// } from '@/lib/auth';
// import Spinner from '@/app/components/spinner';
// import { login as apiPerformLogin, signup as apiPerformSignup } from '@/api/auth'; // Renamed apiLogin for clarity
// import { LoginResponse, User } from '@/types/auth';
// import type { LoginData, SignupData } from '@/app/contexts/AuthContext'; // Import LoginData/SignupData types


// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const router = useRouter();
//   const pathname = usePathname();

//   // Function to update local authentication state (formerly named 'login')
//   const updateAuthState = (newToken: string, newUser: User) => {
//     setAuthToken(newToken);
//     setUserData(newUser);
//     setToken(newToken);
//     setUser(newUser);
//     setIsAuthenticated(true);
//     router.replace('/dashboard');
//   };

//   const logout = () => {
//     removeAuthToken();
//     setToken(null);
//     setUser(null);
//     setIsAuthenticated(false);
//     router.replace('/auth/login');
//   };

//   // >>> NEW LOGIN FUNCTION TO INITIATE THE API CALL <<<
//   const login = async (credentials: LoginData): Promise<LoginResponse> => {
//     console.log("[AuthProvider] Initiating API login for:", credentials.email); // Added log
//     setLoading(true); // Indicate loading for API call
//     try {
//       const response = await apiPerformLogin(credentials.email, credentials.password); // Call your actual API utility
//       console.log("[AuthProvider] API login response:", response); // Added log

//       if (response.user && response.token) {
//         updateAuthState(response.token, response.user); // Update state with the successful response
//       }
//       return response; // Return the full response for LoginPage to handle (optional)
//     } catch (error) {
//       console.error("[AuthProvider] API login failed:", error); // Log the error
//       throw error; // Re-throw for LoginPage to catch
//     } finally {
//       setLoading(false); // End loading regardless of success/failure
//     }
//   };

//   // The signup function seems mostly correct for its purpose
//   const signup = async (userData: SignupData): Promise<LoginResponse> => {
//     try {
//       const response = await apiPerformSignup(userData); // Call your API signup function
//       if (response.user && response.token) {
//         updateAuthState(response.token, response.user); // Update state after successful signup
//       }
//       return response;
//     } catch (error) {
//       console.error("AuthContext Signup error:", error);
//       throw error;
//     }
//   };

//   useEffect(() => {
//     const checkAuth = () => {
//       const storedToken = getAuthToken();
//       const storedUser = getUserData();

//       if (storedToken && storedUser && !isTokenExpired(storedToken)) {
//         setToken(storedToken);
//         setUser(storedUser);
//         setIsAuthenticated(true);

//         if (pathname.startsWith('/auth')) router.replace('/dashboard');
//       } else {
//         removeAuthToken();
//         setToken(null);
//         setUser(null);
//         setIsAuthenticated(false);

//         if (pathname.startsWith('/dashboard')) router.replace('/auth/login');
//       }

//       setLoading(false);
//     };

//     checkAuth();

//     window.addEventListener('focus', checkAuth);
//     return () => window.removeEventListener('focus', checkAuth);
//   }, [pathname, router]);

//   if (loading) return <Spinner />;

//   return (
//     <AuthContext.Provider
//       value={{ user, token, isAuthenticated, loading, login, logout, signup, updateAuthState }} // Provide all functions
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };
















// // src/providers/AuthProvider.tsx

// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import { AuthContext } from '@/app/contexts/AuthContext';
// import {
//   getAuthToken,
//   setAuthToken,
//   removeAuthToken,
//   getUserData,
//   setUserData,
//   isTokenExpired,
// } from '@/lib/auth';
// import Spinner from '@/app/components/spinner';
// import { login as apiPerformLogin, signup as apiPerformSignup } from '@/api/auth';
// import { LoginResponse, User } from '@/types/auth';
// import type { LoginData, SignupData } from '@/app/contexts/AuthContext';


// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const router = useRouter();
//   const pathname = usePathname();

//   const updateAuthState = (newToken: string, newUser: User) => {
//     setAuthToken(newToken);
//     setUserData(newUser);
//     setToken(newToken);
//     setUser(newUser);
//     setIsAuthenticated(true);
//     router.replace('/dashboard');
//   };

//   const logout = () => {
//     removeAuthToken();
//     setToken(null);
//     setUser(null);
//     setIsAuthenticated(false);
//     router.replace('/auth/login');
//   };

//   // Correct Login Function
//   const login = async (credentials: LoginData): Promise<LoginResponse> => {
//     setLoading(true);
//     try {
//       const response = await apiPerformLogin(credentials.email, credentials.password);
//       if (response.user && response.token) {
//         updateAuthState(response.token, response.user);
//       }
//       return response;
//     } catch (error: any) {
//       // The error is already a friendly one from src/api/auth.ts.
//       // We just need to re-throw it so the component can catch it.
//       console.error("[AuthProvider] API login failed:", error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Correct Signup Function
//   const signup = async (userData: SignupData): Promise<LoginResponse> => {
//     setLoading(true);
//     try {
//       const response = await apiPerformSignup(userData);
//       if (response.user && response.token) {
//         updateAuthState(response.token, response.user);
//       }
//       return response;
//     } catch (error: any) {
//       // Re-throw the friendly error from src/api/auth.ts
//       console.error("[AuthProvider] API signup failed:", error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const checkAuth = () => {
//       const storedToken = getAuthToken();
//       const storedUser = getUserData();

//       if (storedToken && storedUser && !isTokenExpired(storedToken)) {
//         setToken(storedToken);
//         setUser(storedUser);
//         setIsAuthenticated(true);

//         if (pathname.startsWith('/auth')) router.replace('/dashboard');
//       } else {
//         removeAuthToken();
//         setToken(null);
//         setUser(null);
//         setIsAuthenticated(false);

//         if (pathname.startsWith('/dashboard')) router.replace('/auth/login');
//       }

//       setLoading(false);
//     };

//     checkAuth();

//     window.addEventListener('focus', checkAuth);
//     return () => window.removeEventListener('focus', checkAuth);
//   }, [pathname, router]);

//   if (loading) return <Spinner />;

//   return (
//     <AuthContext.Provider
//       value={{ user, token, isAuthenticated, loading, login, logout, signup, updateAuthState }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };
















// // src/providers/AuthProvider.tsx
// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import { AuthContext } from '@/app/contexts/AuthContext';
// import {
//   getAuthToken,
//   setAuthToken,
//   removeAuthToken,
//   getUserData,
//   setUserData,
//   isTokenExpired,
// } from '@/lib/auth';
// import Spinner from '@/app/components/spinner';
// import { login as apiPerformLogin, signup as apiPerformSignup } from '@/api/auth';
// import { LoginResponse, User } from '@/types/auth';
// import type { LoginData, SignupData } from '@/app/contexts/AuthContext';


// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const router = useRouter();
//   const pathname = usePathname();

//   const updateAuthState = (newToken: string, newUser: User) => {
//     setAuthToken(newToken);
//     setUserData(newUser);
//     setToken(newToken);
//     setUser(newUser);
//     setIsAuthenticated(true);
//     router.replace('/dashboard');
//   };

//   const logout = () => {
//     removeAuthToken();
//     setToken(null);
//     setUser(null);
//     setIsAuthenticated(false);
//     router.replace('/auth/login');
//   };

//   const login = async (credentials: LoginData): Promise<LoginResponse> => {
//     setLoading(true);
//     try {
//       const response = await apiPerformLogin(credentials.email, credentials.password);
//       if (response.user && response.token) {
//         updateAuthState(response.token, response.user);
//       }
//       return response;
//     } catch (error: any) {
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const signup = async (userData: SignupData): Promise<LoginResponse> => {
//     setLoading(true);
//     try {
//       const response = await apiPerformSignup(userData);
//       if (response.user && response.token) {
//         updateAuthState(response.token, response.user);
//       }
//       return response;
//     } catch (error: any) {
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const checkAuth = () => {
//       const storedToken = getAuthToken();
//       const storedUser = getUserData();

//       if (storedToken && storedUser && !isTokenExpired(storedToken)) {
//         setToken(storedToken);
//         setUser(storedUser);
//         setIsAuthenticated(true);

//         if (pathname.startsWith('/auth')) router.replace('/dashboard');
//       } else {
//         removeAuthToken();
//         setToken(null);
//         setUser(null);
//         setIsAuthenticated(false);

//         if (pathname.startsWith('/dashboard')) router.replace('/auth/login');
//       }

//       setLoading(false);
//     };

//     checkAuth();

//     window.addEventListener('focus', checkAuth);
//     return () => window.removeEventListener('focus', checkAuth);
//   }, [pathname, router]);

//   if (loading) return <Spinner />;

//   return (
//     <AuthContext.Provider
//       value={{ user, token, isAuthenticated, loading, login, logout, signup, updateAuthState }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };















// src/providers/AuthProvider.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthContext } from '@/app/contexts/AuthContext';
import {
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  getUserData,
  setUserData,
  isTokenExpired,
} from '@/lib/auth';
import Spinner from '@/app/components/spinner';
import { login as apiPerformLogin, signup as apiPerformSignup } from '@/api/auth';
import { LoginResponse, User } from '@/types/auth';
import type { LoginData, SignupData } from '@/app/contexts/AuthContext';


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  const updateAuthState = (newToken: string, newUser: User) => {
    setAuthToken(newToken);
    setUserData(newUser);
    setToken(newToken);
    setUser(newUser);
    setIsAuthenticated(true);
    // Remove this redirect, as the useEffect below handles it.
    // This prevents a redundant redirect that could cause issues.
  };

  const logout = () => {
    removeAuthToken();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    router.replace('/auth/login');
  };

  const login = async (credentials: LoginData): Promise<LoginResponse> => {
    setLoading(true);
    try {
      const response = await apiPerformLogin(credentials.email, credentials.password);
      if (response.user && response.token) {
        updateAuthState(response.token, response.user);
      }
      return response;
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: SignupData): Promise<LoginResponse> => {
    setLoading(true);
    try {
      const response = await apiPerformSignup(userData);
      if (response.user && response.token) {
        updateAuthState(response.token, response.user);
      }
      return response;
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      const storedToken = getAuthToken();
      const storedUser = getUserData();

      if (storedToken && storedUser && !isTokenExpired(storedToken)) {
        setToken(storedToken);
        setUser(storedUser);
        setIsAuthenticated(true);

        // Only redirect from auth pages to dashboard if already authenticated
        if (pathname.startsWith('/auth')) {
          router.replace('/dashboard');
        }
      } else {
        removeAuthToken();
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);

        // Redirect to login only if trying to access a protected page
        if (pathname.startsWith('/dashboard')) {
          router.replace('/auth/login');
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  // The window focus listener should be outside the main useEffect to avoid re-adding it
  useEffect(() => {
    const handleFocus = () => {
      // Re-run the auth check on tab focus, without triggering the component's effect loop
      const storedToken = getAuthToken();
      const storedUser = getUserData();
      if (storedToken && storedUser && !isTokenExpired(storedToken)) {
        setIsAuthenticated(true);
      } else {
        removeAuthToken();
        setIsAuthenticated(false);
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);


  if (loading) return <Spinner />;

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, loading, login, logout, signup, updateAuthState }}
    >
      {children}
    </AuthContext.Provider>
  );
};