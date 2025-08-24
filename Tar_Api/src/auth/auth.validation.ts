// // src/auth/auth.validation.ts
// import { z } from 'zod';

// // Schema for user registration (signing up a new user).
// // This is separate from `createUserSchema` in user.validation as it's for public registration.
// export const signupSchema = z.object({
//   first_name: z.string().min(2, 'First name must be at least 2 characters.'),
//   last_name: z.string().min(2, 'Last name must be at least 2 characters.'),
//   email: z.string().email('Invalid email format.'),
//   phone_number: z.string().optional(),
//   password: z.string().min(8, 'Password must be at least 8 characters.').regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
//     .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
//     .regex(/[0-9]/, 'Password must contain at least one number.')
//     .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character.'),
//   password_confirm: z.string(),
// }).refine((data) => data.password === data.password_confirm, {
//   message: 'Passwords do not match.',
//   path: ['password_confirm'],
// });

// // Schema for user login.
// export const loginSchema = z.object({
//   email: z.string().email('Invalid email format.'),
//   password: z.string().min(1, 'Password is required.'),
// });

// // Schema for forgot password request (sending reset token).
// export const forgotPasswordSchema = z.object({
//   email: z.string().email('Invalid email format.'),
// });

// // Schema for resetting password using a token.
// export const resetPasswordSchema = z.object({
//   token: z.string().min(1, 'Reset token is required.'),
//   password: z.string().min(8, 'Password must be at least 8 characters.').regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
//     .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
//     .regex(/[0-9]/, 'Password must contain at least one number.')
//     .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character.'),
//   password_confirm: z.string(),
// }).refine((data) => data.password === data.password_confirm, {
//   message: 'Passwords do not match.',
//   path: ['password_confirm'],
// });

// // Schema for authenticated users to update their password.
// export const updatePasswordSchema = z.object({
//   current_password: z.string().min(1, 'Current password is required.'),
//   new_password: z.string().min(8, 'New password must be at least 8 characters.').regex(/[a-z]/, 'New password must contain at least one lowercase letter.')
//     .regex(/[A-Z]/, 'New password must contain at least one uppercase letter.')
//     .regex(/[0-9]/, 'New password must contain at least one number.')
//     .regex(/[^a-zA-Z0-9]/, 'New password must contain at least one special character.'),
//   new_password_confirm: z.string(),
// }).refine((data) => data.new_password === data.new_password_confirm, {
//   message: 'New passwords do not match.',
//   path: ['new_password_confirm'],
// });









// src/auth/auth.validation.ts
import { z } from 'zod';

// Schema for user registration (signing up a new user).
export const signupSchema = z.object({
  // Changed from first_name/last_name to a single 'name' field
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  
  email: z.string().email('Invalid email format.'),
  // phone_number is optional, so it's fine as is if not sent by frontend
  phone_number: z.string().optional(), 

  password: z.string()
    .min(8, 'Password must be at least 8 characters.')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .regex(/[0-9]/, 'Password must contain at least one number.')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character.'),
  
  // password_confirm is required by the backend schema, so frontend must send it.
  password_confirm: z.string().min(1, 'Password confirmation is required.'), 
}).refine((data) => data.password === data.password_confirm, {
  message: 'Passwords do not match.',
  path: ['password_confirm'],
});

// Schema for user login. (No changes needed here based on the error)
export const loginSchema = z.object({
  email: z.string().email('Invalid email format.'),
  password: z.string().min(1, 'Password is required.'),
});

// Schema for forgot password request (sending reset token). (No changes needed here)
export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format.'),
});

// Schema for resetting password using a token. (No changes needed here)
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required.'),
  password: z.string().min(8, 'Password must be at least 8 characters.')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .regex(/[0-9]/, 'Password must contain at least one number.')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character.'),
  password_confirm: z.string().min(1, 'Password confirmation is required.'),
}).refine((data) => data.password === data.password_confirm, {
  message: 'Passwords do not match.',
  path: ['password_confirm'],
});

// Schema for authenticated users to update their password. (No changes needed here)
export const updatePasswordSchema = z.object({
  current_password: z.string().min(1, 'Current password is required.'),
  new_password: z.string().min(8, 'New password must be at least 8 characters.')
    .regex(/[a-z]/, 'New password must contain at least one lowercase letter.')
    .regex(/[A-Z]/, 'New password must contain at least one uppercase letter.')
    .regex(/[0-9]/, 'New password must contain at least one number.')
    .regex(/[^a-zA-Z0-9]/, 'New password must contain at least one special character.'),
  new_password_confirm: z.string().min(1, 'New password confirmation is required.'),
}).refine((data) => data.new_password === data.new_password_confirm, {
  message: 'New passwords do not match.',
  path: ['new_password_confirm'],
});
