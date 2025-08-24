// // src/api/auth.ts
// import api from './apiConfig';
// import { LoginResponse, User } from '@/types/auth';

// // Function to handle user login
// export const login = async (email: string, password: string): Promise<LoginResponse> => {
//   try {

//     console.log("Login request:", { email, password }); // log input
//     const response = await api.post('/auth/login', { email, password });

//     console.log("Login response:", response.data); // log success response
//     return response.data; // Expects { user: User, token: string }
//   } catch (error: any) {
//     //   console.error("Login error details:", error.response?.data || error.message);
//     // throw new Error(error.response?.data?.message || 'Login failed');
//   const errorMessage = error.response?.data?.message || error.message || 'Login failed';
//     // console.error("Login error details (from backend):", error.response?.data || error.message);
//     // throw new Error(errorMessage);

//     // console.error("Login API Error:", errorMessage); // This will log "Login API Error: Incorrect password."
//   throw new Error(errorMessage);
//   }
// };

// // Function to handle user signup/registration
// export const signup = async (userData: any): Promise<LoginResponse> => {
//   try {
//       // console.log("Signup request:", userData); // log input  
//     const response = await api.post('/auth/signup', userData);

//     // console.log("Signup response:", response.data); // log success response
//     return response.data; // Expects { user: User, token: string }
//   } catch (error: any) {
//     console.error("Signup error details:", error.response?.data || error.message);
//     throw new Error(error.response?.data?.message || 'Signup failed');
//   }
// };

// // Function to request password reset (send email)
// export const requestPasswordReset = async (email: string): Promise<{ message: string }> => {
//   try {
//     const response = await api.post('/auth/forgotPassword', { email });
//     return response.data;
//   } catch (error: any) {
//     throw new Error(error.response?.data?.message || 'Password reset request failed');
//   }
// };

// // Function to reset password with token
// export const resetPassword = async (token: string, password: string, passwordConfirm: string): Promise<{ message: string }> => {
//   try {
//     const response = await api.patch(`/auth/resetPassword/${token}`, { password, passwordConfirm });
//     return response.data;
//   } catch (error: any) {
//     throw new Error(error.response?.data?.message || 'Password reset failed');
//   }
// };

// // Function to update current authenticated user's password
// // export const updateCurrentUserPassword = async (currentPassword: string, newPassword: string, newPasswordConfirm: string): Promise<{ message: string }> => {
// //   try {
// //     const response = await api.patch('/auth/update-my-password', {
// //       currentPassword,
// //       newPassword,
// //       newPasswordConfirm,
// //     });
// //     return response.data;
// //   } catch (error: any) {
// //     throw new Error(error.response?.data?.message || 'Password update failed');
// //   }
// // };










// // src/api/auth.ts
// import api from './apiConfig';
// import { LoginResponse } from '@/types/auth';

// const getFriendlyErrorMessage = (error: any, defaultMessage: string) => {
//   // Detect if response contains HTML (common with 404/500 pages)
//   if (typeof error.response?.data === 'string' && error.response.data.includes('<!DOCTYPE')) {
//     return 'Server error occurred.';
//   }

//   return error.response?.data?.message || error.message || defaultMessage;
// };

// // Login
// export const login = async (email: string, password: string): Promise<LoginResponse> => {
//   try {
//     const response = await api.post('/auth/login', { email, password });
//     return response.data;
//   } catch (error: any) {
//     throw new Error(getFriendlyErrorMessage(error, 'Login failed'));
//   }
// };

// // Signup
// export const signup = async (userData: any): Promise<LoginResponse> => {
//   try {
//     const response = await api.post('/auth/signup', userData);
//     return response.data;
//   } catch (error: any) {
//     throw new Error(getFriendlyErrorMessage(error, 'Signup failed'));
//   }
// };

// // Password Reset Request
// export const requestPasswordReset = async (email: string) => {
//   try {
//     const response = await api.post('/auth/forgotPassword', { email });
//     return response.data;
//   } catch (error: any) {
//     throw new Error(getFriendlyErrorMessage(error, 'Password reset request failed'));
//   }
// };

// // Reset Password
// export const resetPassword = async (token: string, password: string, passwordConfirm: string) => {
//   try {
//     const response = await api.patch(`/auth/resetPassword/${token}`, { password, passwordConfirm });
//     return response.data;
//   } catch (error: any) {
//     throw new Error(getFriendlyErrorMessage(error, 'Password reset failed'));
//   }
// };






// // src/api/auth.ts
// import api from './apiConfig';
// import { LoginResponse } from '@/types/auth';

// // Map known backend error messages or status codes to friendly messages
// const getFriendlyErrorMessage = (error: any, defaultMessage: string) => {
//   // If response is HTML instead of JSON (common for 404/500)
//   if (typeof error.response?.data === 'string' && error.response.data.includes('<!DOCTYPE')) {
//     return 'Server error occurred. Please check your API connection.';
//   }

//   const status = error.response?.status;
//   const message = error.response?.data?.message?.toLowerCase() || '';

//   // Handle specific messages from backend or guess from status
//   if (status === 400 || status === 401) {
//     if (message.includes('password')) {
//       return 'Incorrect password. Please try again.';
//     }
//     if (message.includes('email') && message.includes('not found')) {
//       return 'This email address is not registered.';
//     }
//     if (message.includes('invalid') && message.includes('email')) {
//       return 'Invalid email format. Please check and try again.';
//     }
//     return 'Invalid credentials. Please check your details and try again.';
//   }

//   if (status === 404) {
//     return 'Requested resource not found.';
//   }

//   if (status === 409 || message.includes('already exists')) {
//     return 'An account with this email already exists. Please log in instead.';
//   }

//   if (status === 500) {
//     return 'Internal server error. Please try again later.';
//   }

//   if (error.message && error.message.includes('Network Error')) {
//     return 'Cannot connect to the server. Please check your internet connection.';
//   }

//   return error.response?.data?.message || defaultMessage;
// };

// // ---------------- LOGIN ----------------
// export const login = async (email: string, password: string): Promise<LoginResponse> => {
//   try {
//     const response = await api.post('/auth/login', { email, password });
//     return response.data;
//   } catch (error: any) {
//     throw new Error(getFriendlyErrorMessage(error, 'Login failed'));
//   }
// };

// // ---------------- SIGNUP ----------------
// export const signup = async (userData: any): Promise<LoginResponse> => {
//   try {
//     const response = await api.post('/auth/signup', userData);
//     return response.data;
//   } catch (error: any) {
//     throw new Error(getFriendlyErrorMessage(error, 'Signup failed'));
//   }
// };

// // ---------------- PASSWORD RESET REQUEST ----------------
// export const requestPasswordReset = async (email: string) => {
//   try {
//     const response = await api.post('/auth/forgotPassword', { email });
//     return response.data;
//   } catch (error: any) {
//     throw new Error(getFriendlyErrorMessage(error, 'Password reset request failed'));
//   }
// };

// // ---------------- RESET PASSWORD ----------------
// export const resetPassword = async (token: string, password: string, passwordConfirm: string) => {
//   try {
//     const response = await api.patch(`/auth/resetPassword/${token}`, { password, passwordConfirm });
//     return response.data;
//   } catch (error: any) {
//     throw new Error(getFriendlyErrorMessage(error, 'Password reset failed'));
//   }
// };




















// // src/api/auth.ts

// import api from './apiConfig';
// import { LoginResponse } from '@/types/auth'; // Assuming you have this type defined

// /**
//  * Maps known backend error messages or status codes to friendly, user-facing messages.
//  * This function helps abstract the technical details of an error from the user.
//  * * @param error - The error object received from an API call (e.g., from an Axios catch block).
//  * @param defaultMessage - A fallback message if a specific friendly message cannot be determined.
//  * @returns A user-friendly error message string.
//  */
// const getFriendlyErrorMessage = (error: any, defaultMessage: string): string => {
//   // If the response is not a valid JSON object (e.g., HTML from a server 404/500 page)
//   if (typeof error.response?.data === 'string' && error.response.data.includes('<!DOCTYPE')) {
//     return 'Server error occurred. Please check your API connection.';
//   }

//   const status = error.response?.status;
//   const message = error.response?.data?.message?.toLowerCase() || '';

//   // Handle specific messages from the backend or guess from status codes
//   if (status === 400 || status === 401) {
//     if (message.includes('password')) {
//       return 'Incorrect password. Please try again.';
//     }
//     if (message.includes('email') && message.includes('not found')) {
//       return 'This email address is not registered.';
//     }
//     if (message.includes('invalid') && message.includes('email')) {
//       return 'Invalid email format. Please check and try again.';
//     }
//     // A generic message for 400/401 errors if no specific pattern is found
//     return 'Invalid credentials. Please check your details and try again.';
//   }

//   if (status === 404) {
//     return 'Requested resource not found.';
//   }

//   if (status === 409 || message.includes('already exists')) {
//     return 'An account with this email already exists. Please log in instead.';
//   }

//   if (status === 500) {
//     return 'Internal server error. Please try again later.';
//   }

//   // Handle network-related errors (e.g., server is down, no internet connection)
//   if (error.message && error.message.includes('Network Error')) {
//     return 'Cannot connect to the server. Please check your internet connection.';
//   }

//   // Fallback to the backend message or the provided default message
//   return error.response?.data?.message || defaultMessage;
// };

// // ---------------- LOGIN ----------------
// /**
//  * Handles the login API call.
//  * @param email The user's email.
//  * @param password The user's password.
//  * @returns A promise that resolves with the login response data.
//  * @throws An Error object with a friendly message on failure.
//  */
// export const login = async (email: string, password: string): Promise<LoginResponse> => {
//   try {
//     const response = await api.post('/auth/login', { email, password });
//     return response.data;
//   } catch (error: any) {
//     // Catch the error, generate a friendly message, and re-throw it as a new Error object.
//     const friendlyMessage = getFriendlyErrorMessage(error, 'Login failed');
//     throw new Error(friendlyMessage);
//   }
// };

// // ---------------- SIGNUP ----------------
// /**
//  * Handles the signup API call.
//  * @param userData The user's signup data.
//  * @returns A promise that resolves with the signup response data.
//  * @throws An Error object with a friendly message on failure.
//  */
// export const signup = async (userData: any): Promise<LoginResponse> => {
//   try {
//     const response = await api.post('/auth/signup', userData);
//     return response.data;
//   } catch (error: any) {
//     // Catch the error, generate a friendly message, and re-throw it.
//     const friendlyMessage = getFriendlyErrorMessage(error, 'Signup failed');
//     throw new Error(friendlyMessage);
//   }
// };

// // ---------------- PASSWORD RESET REQUEST ----------------
// /**
//  * Handles the password reset request API call.
//  * @param email The email to send the reset link to.
//  * @returns A promise that resolves on success.
//  * @throws An Error object with a friendly message on failure.
//  */
// export const requestPasswordReset = async (email: string) => {
//   try {
//     const response = await api.post('/auth/forgotPassword', { email });
//     return response.data;
//   } catch (error: any) {
//     const friendlyMessage = getFriendlyErrorMessage(error, 'Password reset request failed');
//     throw new Error(friendlyMessage);
//   }
// };

// // ---------------- RESET PASSWORD ----------------
// /**
//  * Handles the password reset API call.
//  * @param token The reset token.
//  * @param password The new password.
//  * @param passwordConfirm The new password confirmation.
//  * @returns A promise that resolves on success.
//  * @throws An Error object with a friendly message on failure.
//  */
// export const resetPassword = async (token: string, password: string, passwordConfirm: string) => {
//   try {
//     const response = await api.patch(`/auth/resetPassword/${token}`, { password, passwordConfirm });
//     return response.data;
//   } catch (error: any) {
//     const friendlyMessage = getFriendlyErrorMessage(error, 'Password reset failed');
//     throw new Error(friendlyMessage);
//   }
// };

// // Exporting the utility function in case it's needed elsewhere
// export { getFriendlyErrorMessage };

// src/api/auth.ts

// import api from './apiConfig';
// import { LoginResponse } from '@/types/auth';

// /**
//  * Maps known backend error messages or status codes to friendly, user-facing messages.
//  * @param error - The error object received from an API call.
//  * @param defaultMessage - A fallback message.
//  * @returns A user-friendly error message string.
//  */
// const getFriendlyErrorMessage = (error: any, defaultMessage: string): string => {
//   const status = error.response?.status;
//   const message = error.response?.data?.message?.toLowerCase() || '';

//   // Prioritize status codes that are well-known to the front end
//   if (status === 401) {
//     // This is the specific case for login/token errors.
//     // We handle this before checking if the response is HTML.
//     return 'Invalid credentials. Please check your details and try again.';
//   }

//   // If the response is HTML instead of JSON (common for 404/500)
//   if (typeof error.response?.data === 'string' && error.response.data.includes('<!DOCTYPE')) {
//     return 'Server error occurred. Please check your API connection.';
//   }

//   // Handle other specific messages from the backend or guess from status
//   if (status === 400) {
//     if (message.includes('password')) {
//       return 'Incorrect password. Please try again.';
//     }
//     if (message.includes('email') && message.includes('not found')) {
//       return 'This email address is not registered.';
//     }
//     if (message.includes('invalid') && message.includes('email')) {
//       return 'Invalid email format. Please check and try again.';
//     }
//     return 'Invalid request. Please check your details and try again.';
//   }

//   if (status === 404) {
//     return 'Requested resource not found.';
//   }

//   if (status === 409 || message.includes('already exists')) {
//     return 'An account with this email already exists. Please log in instead.';
//   }

//   if (status === 500) {
//     return 'Internal server error. Please try again later.';
//   }

//   if (error.message && error.message.includes('Network Error')) {
//     return 'Cannot connect to the server. Please check your internet connection.';
//   }

//   return error.response?.data?.message || defaultMessage;
// };

// // All other functions (login, signup, etc.) remain the same.

// // ---------------- LOGIN ----------------
// export const login = async (email: string, password: string): Promise<LoginResponse> => {
//   try {
//     const response = await api.post('/auth/login', { email, password });
//     return response.data;
//   } catch (error: any) {
//     const friendlyMessage = getFriendlyErrorMessage(error, 'Login failed');
//     throw new Error(friendlyMessage);
//   }
// };


// // ---------------- SIGNUP ----------------
// /**
//  * Handles the signup API call.
//  * @param userData The user's signup data.
//  * @returns A promise that resolves with the signup response data.
//  * @throws An Error object with a friendly message on failure.
//  */
// export const signup = async (userData: any): Promise<LoginResponse> => {
//   try {
//     const response = await api.post('/auth/signup', userData);
//     return response.data;
//   } catch (error: any) {
//     // Catch the error, generate a friendly message, and re-throw it.
//     const friendlyMessage = getFriendlyErrorMessage(error, 'Signup failed');
//     throw new Error(friendlyMessage);
//   }
// };

// // ---------------- PASSWORD RESET REQUEST ----------------
// /**
//  * Handles the password reset request API call.
//  * @param email The email to send the reset link to.
//  * @returns A promise that resolves on success.
//  * @throws An Error object with a friendly message on failure.
//  */
// export const requestPasswordReset = async (email: string) => {
//   try {
//     const response = await api.post('/auth/forgotPassword', { email });
//     return response.data;
//   } catch (error: any) {
//     const friendlyMessage = getFriendlyErrorMessage(error, 'Password reset request failed');
//     throw new Error(friendlyMessage);
//   }
// };

// // ---------------- RESET PASSWORD ----------------
// /**
//  * Handles the password reset API call.
//  * @param token The reset token.
//  * @param password The new password.
//  * @param passwordConfirm The new password confirmation.
//  * @returns A promise that resolves on success.
//  * @throws An Error object with a friendly message on failure.
//  */
// export const resetPassword = async (token: string, password: string, passwordConfirm: string) => {
//   try {
//     const response = await api.patch(`/auth/resetPassword/${token}`, { password, passwordConfirm });
//     return response.data;
//   } catch (error: any) {
//     const friendlyMessage = getFriendlyErrorMessage(error, 'Password reset failed');
//     throw new Error(friendlyMessage);
//   }
// };

// export { getFriendlyErrorMessage };

















// src/api/auth.ts
import api from './apiConfig';
import { LoginResponse } from '@/types/auth';

const getFriendlyErrorMessage = (error: any, defaultMessage: string): string => {
  const status = error.response?.status;
  const message = error.response?.data?.message?.toLowerCase() || '';

  if (status === 401) {
    return 'Invalid credentials. Please check your details and try again.';
  }

  if (typeof error.response?.data === 'string' && error.response.data.includes('<!DOCTYPE')) {
    return 'Server error occurred. Please check your API connection.';
  }

  if (status === 400) {
    if (message.includes('password')) {
      return 'Incorrect password. Please try again.';
    }
    if (message.includes('email') && message.includes('not found')) {
      return 'This email address is not registered.';
    }
    if (message.includes('invalid') && message.includes('email')) {
      return 'Invalid email format. Please check and try again.';
    }
    return 'Invalid request. Please check your details and try again.';
  }

  if (status === 404) {
    return 'Requested resource not found.';
  }

  if (status === 409 || message.includes('already exists')) {
    return 'An account with this email already exists. Please log in instead.';
  }

  if (status === 500) {
    return 'Internal server error. Please try again later.';
  }

  if (error.message && error.message.includes('Network Error')) {
    return 'Cannot connect to the server. Please check your internet connection.';
  }

  return error.response?.data?.message || defaultMessage;
};

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error: any) {
    const friendlyMessage = getFriendlyErrorMessage(error, 'Login failed');
    throw new Error(friendlyMessage);
  }
};

export const signup = async (userData: any): Promise<LoginResponse> => {
  try {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  } catch (error: any) {
    const friendlyMessage = getFriendlyErrorMessage(error, 'Signup failed');
    throw new Error(friendlyMessage);
  }
};

export const requestPasswordReset = async (email: string) => {
  try {
    const response = await api.post('/auth/forgotPassword', { email });
    return response.data;
  } catch (error: any) {
    const friendlyMessage = getFriendlyErrorMessage(error, 'Password reset request failed');
    throw new Error(friendlyMessage);
  }
};

export const resetPassword = async (token: string, password: string, passwordConfirm: string) => {
  try {
    const response = await api.patch(`/auth/resetPassword/${token}`, { password, passwordConfirm });
    return response.data;
  } catch (error: any) {
    const friendlyMessage = getFriendlyErrorMessage(error, 'Password reset failed');
    throw new Error(friendlyMessage);
  }
};

export { getFriendlyErrorMessage };