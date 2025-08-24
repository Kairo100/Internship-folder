// src/saving/saving.validation.ts
import { z } from 'zod';

// Schema for creating a new Saving
export const createSavingSchema = z.object({
  amount: z.number().positive('Amount must be a positive number.'),
  date: z.string().datetime('Invalid date format for date.').transform((str) => new Date(str)),
  member_id: z.number().int().positive('Member ID must be a positive integer.'),
  meeting_id: z.number().int().positive('Meeting ID must be a positive integer.'),
});

// Schema for updating an existing Saving
export const updateSavingSchema = z.object({
  amount: z.number().positive('Amount must be a positive number.').optional(),
  date: z.string().datetime('Invalid date format for date.').transform((str) => new Date(str)).optional(),
  member_id: z.number().int().positive('Member ID must be a positive integer.').optional(),
  meeting_id: z.number().int().positive('Meeting ID must be a positive integer.').optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided for update." }
);

// Schema for getting a single Saving by ID (for route parameters)
export const getSavingByIdSchema = z.object({
  id: z.string().transform(Number), // Convert string ID from URL to number
});

// Schema for nested route parameters (e.g., /meetings/:meetingId/savings)
export const getSavingByMeetingIdSchema = z.object({
  meetingId: z.string().transform(Number),
});

export const getSavingByMemberIdSchema = z.object({
  memberId: z.string().transform(Number),
});