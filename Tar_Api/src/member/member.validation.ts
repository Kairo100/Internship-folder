// src/member/member.validation.ts
import { z } from 'zod';

// Schema for creating a new Member
export const createMemberSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters long.'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters long.'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters long.'),
  gender: z.enum(['Male', 'Female', 'Other'], { message: 'Gender must be Male, Female, or Other.' }), // Assuming specific genders
  date_of_birth: z.string().datetime('Invalid date format for date_of_birth.').transform((str) => new Date(str)),
  position: z.string().min(2, 'Position must be at least 2 characters long.'),
  password: z.string().min(6, 'Password must be at least 6 characters long.'), // This should be hashed before saving
  group_id: z.number().int().positive('Group ID must be a positive integer.'),
  created_by_user_id: z.number().int().positive('Created By User ID must be a positive integer.'),
});

// Schema for updating an existing Member
export const updateMemberSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters long.').optional(),
  last_name: z.string().min(2, 'Last name must be at least 2 characters long.').optional(),
  phone: z.string().min(10, 'Phone number must be at least 10 characters long.').optional(),
  gender: z.enum(['Male', 'Female', 'Other'], { message: 'Gender must be Male, Female, or Other.' }).optional(),
  date_of_birth: z.string().datetime('Invalid date format for date_of_birth.').transform((str) => new Date(str)).optional(),
  position: z.string().min(2, 'Position must be at least 2 characters long.').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters long.').optional(), // This should be hashed if provided
  group_id: z.number().int().positive('Group ID must be a positive integer.').optional(),
  created_by_user_id: z.number().int().positive('Created By User ID must be a positive integer.').optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided for update." }
);

// Schema for getting a single Member by ID (for route parameters)
export const getMemberByIdSchema = z.object({
  id: z.string().transform(Number), // Convert string ID from URL to number
});