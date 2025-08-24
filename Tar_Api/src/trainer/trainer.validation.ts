// src/trainer/trainer.validation.ts
import { z } from 'zod';

// Schema for creating a new trainer
export const createTrainerSchema = z.object({
  name: z.string().min(3, 'Trainer name must be at least 3 characters long.'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters long.'),
  address: z.string().min(5, 'Address must be at least 5 characters long.'),
});

// Schema for updating an existing trainer
export const updateTrainerSchema = z.object({
  name: z.string().min(3, 'Trainer name must be at least 3 characters long.').optional(),
  phone: z.string().min(10, 'Phone number must be at least 10 characters long.').optional(),
  address: z.string().min(5, 'Address must be at least 5 characters long.').optional(),
});

// Schema for getting a single trainer by ID (for route parameters)
export const getTrainerByIdSchema = z.object({
  id: z.string().transform(Number), // Convert string ID from URL to number
});