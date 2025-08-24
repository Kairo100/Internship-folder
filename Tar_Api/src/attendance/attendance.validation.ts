// src/attendance/attendance.validation.ts
import { z, ZodIssue } from 'zod'; // Removed ZodErrorMapContext, as it's not directly exported in some Zod versions
import { AttendanceStatus } from '@prisma/client'; // Import the enum from Prisma client

// Schema for creating a new Attendance record
export const createAttendanceSchema = z.object({
  status: z.nativeEnum(AttendanceStatus)
    .refine(val => Object.values(AttendanceStatus).includes(val as AttendanceStatus), {
      message: `Invalid status. Must be one of: ${Object.values(AttendanceStatus).join(', ')}`,
    }),
  date: z.string().datetime('Invalid date format for date.').transform((str) => new Date(str)),
  member_id: z.number().int().positive('Member ID must be a positive integer.'),
  meeting_id: z.number().int().positive('Meeting ID must be a positive integer.'),
});

// Schema for updating an existing Attendance record
export const updateAttendanceSchema = z.object({
  status: z.nativeEnum(AttendanceStatus)
    .refine(val => Object.values(AttendanceStatus).includes(val as AttendanceStatus), {
      message: `Invalid status. Must be one of: ${Object.values(AttendanceStatus).join(', ')}`,
    })
    .optional(),
  date: z.string().datetime('Invalid date format for date.').transform((str) => new Date(str)).optional(),
  member_id: z.number().int().positive('Member ID must be a positive integer.').optional(),
  meeting_id: z.number().int().positive('Meeting ID must be a positive integer.').optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided for update." }
);

// Schema for getting a single Attendance record by ID (for route parameters)
export const getAttendanceByIdSchema = z.object({
  id: z.string().transform(Number), // Convert string ID from URL to number
});

// Schema for nested route parameters (e.g., /meetings/:meetingId/attendance)
export const getAttendanceByMeetingIdSchema = z.object({
  meetingId: z.string().transform(Number),
});

export const getAttendanceByMemberIdSchema = z.object({
  memberId: z.string().transform(Number),
});