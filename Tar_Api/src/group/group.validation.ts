// src/group/group.validation.ts
import { z } from 'zod';

// Schema for creating a new Group
export const createGroupSchema = z.object({
  name: z.string().min(3, 'Group name must be at least 3 characters long.'),
  date_of_first_training: z.string().datetime('Invalid date format for date_of_first_training.').transform((str) => new Date(str)),
  location: z.string().min(3, 'Location must be at least 3 characters long.'),
  trained_by_trainer_id: z.number().int().positive('Trainer ID must be a positive integer.'),
  leader_user_id: z.number().int().positive('Leader User ID must be a positive integer.'),
});

// Schema for updating an existing Group
export const updateGroupSchema = z.object({
  name: z.string().min(3, 'Group name must be at least 3 characters long.').optional(),
  date_of_first_training: z.string().datetime('Invalid date format for date_of_first_training.').transform((str) => new Date(str)).optional(),
  location: z.string().min(3, 'Location must be at least 3 characters long.').optional(),
  trained_by_trainer_id: z.number().int().positive('Trainer ID must be a positive integer.').optional(),
  leader_user_id: z.number().int().positive('Leader User ID must be a positive integer.').optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided for update." }
);


// Schema for getting a single Group by ID (for route parameters)
export const getGroupByIdSchema = z.object({
  id: z.string().transform(Number), // Convert string ID from URL to number
});