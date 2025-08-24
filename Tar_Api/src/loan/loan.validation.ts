// src/loan/loan.validation.ts
import { z } from 'zod';

// Schema for creating a new Loan
export const createLoanSchema = z.object({
  amount: z.number().positive('Loan amount must be a positive number.'),
  date: z.string().datetime('Invalid date format for date.').transform((str) => new Date(str)),
  interest_rate: z.number().min(0, 'Interest rate cannot be negative.').max(100, 'Interest rate cannot exceed 100%').optional().default(0), // Assuming percentage
  due_date: z.string().datetime('Invalid date format for due_date.').transform((str) => new Date(str)),
  is_fully_repaid: z.boolean().default(false), // Default to false
  member_id: z.number().int().positive('Member ID must be a positive integer.'),
  meeting_id: z.number().int().positive('Meeting ID must be a positive integer.'),
}).refine(data => data.due_date > data.date, {
  message: "Due date must be after the loan date.",
  path: ["due_date"],
});

// Schema for updating an existing Loan
export const updateLoanSchema = z.object({
  amount: z.number().positive('Loan amount must be a positive number.').optional(),
  date: z.string().datetime('Invalid date format for date.').transform((str) => new Date(str)).optional(),
  interest_rate: z.number().min(0, 'Interest rate cannot be negative.').max(100, 'Interest rate cannot exceed 100%').optional(),
  due_date: z.string().datetime('Invalid date format for due_date.').transform((str) => new Date(str)).optional(),
  is_fully_repaid: z.boolean().optional(),
  member_id: z.number().int().positive('Member ID must be a positive integer.').optional(),
  meeting_id: z.number().int().positive('Meeting ID must be a positive integer.').optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided for update." }
).refine(data => {
    // Only validate date order if both are present
    if (data.date && data.due_date) {
        return data.due_date > data.date;
    }
    return true; // No dates provided, or only one, so no order check
}, {
    message: "Due date must be after the loan date if both are provided.",
    path: ["due_date"],
});


// Schema for getting a single Loan by ID (for route parameters)
export const getLoanByIdSchema = z.object({
  id: z.string().transform(Number), // Convert string ID from URL to number
});

// Schema for nested route parameters (e.g., /meetings/:meetingId/loans)
export const getLoanByMeetingIdSchema = z.object({
  meetingId: z.string().transform(Number),
});

export const getLoanByMemberIdSchema = z.object({
  memberId: z.string().transform(Number),
});