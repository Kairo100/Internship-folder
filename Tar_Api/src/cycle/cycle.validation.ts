// src/cycle/cycle.validation.ts
import { z } from 'zod';

// Schema for creating a new Cycle
export const createCycleSchema = z.object({
  name: z.string().min(3, 'Cycle name must be at least 3 characters long.'),
  status: z.string().min(3, 'Status must be at least 3 characters long.'), // Consider making this an enum if status types are fixed
  start_date: z.string().datetime('Invalid date format for start_date.').transform((str) => new Date(str)),
  end_date: z.string().datetime('Invalid date format for end_date.').transform((str) => new Date(str)),
  group_id: z.number().int().positive('Group ID must be a positive integer.'),
}).refine(data => data.end_date > data.start_date, {
  message: "End date must be after start date.",
  path: ["end_date"],
});

// Schema for updating an existing Cycle
export const updateCycleSchema = z.object({
  name: z.string().min(3, 'Cycle name must be at least 3 characters long.').optional(),
  status: z.string().min(3, 'Status must be at least 3 characters long.').optional(),
  start_date: z.string().datetime('Invalid date format for start_date.').transform((str) => new Date(str)).optional(),
  end_date: z.string().datetime('Invalid date format for end_date.').transform((str) => new Date(str)).optional(),
  group_id: z.number().int().positive('Group ID must be a positive integer.').optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided for update." }
).refine(data => {
    // Only validate date order if both are present
    if (data.start_date && data.end_date) {
        return data.end_date > data.start_date;
    }
    return true; // No dates provided, or only one, so no order check
}, {
    message: "End date must be after start date if both are provided.",
    path: ["end_date"],
});


// Schema for getting a single Cycle by ID (for route parameters)
export const getCycleByIdSchema = z.object({
  id: z.string().transform(Number), // Convert string ID from URL to number
});