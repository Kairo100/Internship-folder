// src/meeting/meeting.validation.ts
import { z } from 'zod';

// Schema for creating a new Meeting
export const createMeetingSchema = z.object({
  name: z.string().min(3, 'Meeting name must be at least 3 characters long.'),
  date: z.string().datetime('Invalid date format for date.').transform((str) => new Date(str)),
  total_savings_collected: z.number().min(0, 'Total savings must be a non-negative number.'),
  total_loans_disbursed: z.number().min(0, 'Total loans must be a non-negative number.'),
  group_id: z.number().int().positive('Group ID must be a positive integer.'),
  cycle_id: z.number().int().positive('Cycle ID must be a positive integer.'),
});

// Schema for updating an existing Meeting
export const updateMeetingSchema = z.object({
  name: z.string().min(3, 'Meeting name must be at least 3 characters long.').optional(),
  date: z.string().datetime('Invalid date format for date.').transform((str) => new Date(str)).optional(),
  total_savings_collected: z.number().min(0, 'Total savings must be a non-negative number.').optional(),
  total_loans_disbursed: z.number().min(0, 'Total loans must be a non-negative number.').optional(),
  group_id: z.number().int().positive('Group ID must be a positive integer.').optional(),
  cycle_id: z.number().int().positive('Cycle ID must be a positive integer.').optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided for update." }
);

// Schema for getting a single Meeting by ID (for route parameters)
export const getMeetingByIdSchema = z.object({
  id: z.string().transform(Number), // Convert string ID from URL to number
});