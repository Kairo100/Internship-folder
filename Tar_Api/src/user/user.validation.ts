// src/user/user.validation.ts
import { z } from 'zod';
// import { Role } from '@/prisma/client'; // Assuming Role enum from Prisma
import { Role } from '@prisma/client';


// Schema for creating a new user (typically by Admin)
export const createUserSchema = z
  .object({
    first_name: z.string().min(2, 'First name must be at least 2 characters.'),
    last_name: z.string().min(2, 'Last name must be at least 2 characters.'),
    email: z.string().email('Invalid email format.'),
    phone_number: z.string().optional(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters.')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
      .regex(/[0-9]/, 'Password must contain at least one number.')
      .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character.'),
    password_confirm: z.string(),
    role: z.nativeEnum(Role).optional().default(Role.Member),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: 'Passwords do not match.',
    path: ['password_confirm'],
  });


// Schema for updating a user (e.g., by Admin)
// export const updateUserSchema = z
//   .object({
//     first_name: z.string().min(2, 'First name must be at least 2 characters.').optional(),
//     last_name: z.string().min(2, 'Last name must be at least 2 characters.').optional(),
//     email: z.string().email('Invalid email format.').optional(),
//     phone_number: z.string().optional(),
//     role: z
//       .string()
//       .refine((val) => Object.values(Role).includes(val as Role), {
//         message: `Invalid role. Must be one of: ${Object.values(Role).join(', ')}`,
//       })
//       .optional(),
//   })
//   .refine(
//     (data) => Object.keys(data).length > 0,
//     { message: 'At least one field must be provided for update.' }
//   );
export const updateUserSchema = z
  .object({
    first_name: z.string().min(2, 'First name must be at least 2 characters.').optional(),
    last_name: z.string().min(2, 'Last name must be at least 2 characters.').optional(),
    email: z.string().email('Invalid email format.').optional(),
    phone_number: z.string().optional(),
    role: z
      .string()
      .refine((val) => Object.values(Role).includes(val as Role), {
        message: `Invalid role. Must be one of: ${Object.values(Role).join(', ')}`,
      })
      .transform((val) => val as Role) // <-- convert string to Role enum
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one field must be provided for update.' }
  );
// Schema for a user updating their own profile (excluding sensitive fields like role, password)
export const updateMeSchema = z
  .object({
    first_name: z.string().min(2, 'First name must be at least 2 characters.').optional(),
    last_name: z.string().min(2, 'Last name must be at least 2 characters.').optional(),
    email: z.string().email('Invalid email format.').optional(),
    phone_number: z.string().optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one field must be provided for update.' }
  );

// Schema for getting a single user by ID (for route parameters)
export const getUserByIdSchema = z.object({
  id: z.string().transform(Number), // Convert string ID from URL to number
});