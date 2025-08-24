// src/meeting/meeting.service.ts
import { PrismaClient } from '@prisma/client';
import AppError from '../utils/AppError';

const prisma = new PrismaClient();

// Define types for Meeting data
interface CreateMeetingData {
  name: string;
  date: Date;
  total_savings_collected: number;
  total_loans_disbursed: number;
  group_id: number;
  cycle_id: number;
}

interface UpdateMeetingData {
  name?: string;
  date?: Date;
  total_savings_collected?: number;
  total_loans_disbursed?: number;
  group_id?: number;
  cycle_id?: number;
}

export const createMeeting = async (data: CreateMeetingData) => {
  // 1. Check if the group exists
  const group = await prisma.group.findUnique({
    where: { id: data.group_id },
  });
  if (!group) {
    throw new AppError('Group not found. Cannot create meeting for a non-existent group.', 400);
  }

  // 2. Check if the cycle exists and belongs to the specified group
  const cycle = await prisma.cycle.findUnique({
    where: { id: data.cycle_id },
  });
  if (!cycle) {
    throw new AppError('Cycle not found. Cannot create meeting for a non-existent cycle.', 400);
  }
  if (cycle.group_id !== data.group_id) {
    throw new AppError('The specified cycle does not belong to the specified group.', 400);
  }

  const meeting = await prisma.meeting.create({
    data,
    include: {
      group: {
        select: { id: true, name: true }
      },
      cycle: {
        select: { id: true, name: true, status: true }
      }
    },
  });
  return meeting;
};

export const getAllMeetings = async () => {
  const meetings = await prisma.meeting.findMany({
    include: {
      group: {
        select: { id: true, name: true }
      },
      cycle: {
        select: { id: true, name: true, status: true }
      }
    },
  });
  return meetings;
};

export const getMeetingById = async (id: number) => {
  const meeting = await prisma.meeting.findUnique({
    where: { id },
    include: {
      group: {
        select: { id: true, name: true }
      },
      cycle: {
        select: { id: true, name: true, status: true }
      },
      savings: { // Include related savings for comprehensive view
        select: { id: true, amount: true, date: true, member: { select: { first_name: true, last_name: true } } }
      },
      loans: { // Include related loans
        select: { id: true, amount: true, date: true, is_fully_repaid: true, member: { select: { first_name: true, last_name: true } } }
      },
      attendance: { // Include related attendance records
        select: { id: true, status: true, member: { select: { first_name: true, last_name: true } } }
      }
    },
  });
  if (!meeting) {
    throw new AppError('Meeting not found', 404);
  }
  return meeting;
};

export const updateMeeting = async (id: number, data: UpdateMeetingData) => {
  const meeting = await prisma.meeting.findUnique({
    where: { id },
  });
  if (!meeting) {
    throw new AppError('Meeting not found', 404);
  }

  // Check for group existence if group_id is provided
  if (data.group_id) {
    const group = await prisma.group.findUnique({
      where: { id: data.group_id },
    });
    if (!group) {
      throw new AppError('New Group not found. Cannot assign meeting to a non-existent group.', 400);
    }
  }

  // Check for cycle existence if cycle_id is provided
  if (data.cycle_id) {
    const cycle = await prisma.cycle.findUnique({
      where: { id: data.cycle_id },
    });
    if (!cycle) {
      throw new AppError('New Cycle not found. Cannot assign meeting to a non-existent cycle.', 400);
    }
    // Also check if new cycle belongs to the new (or old) group
    const targetGroupId = data.group_id || meeting.group_id;
    if (cycle.group_id !== targetGroupId) {
      throw new AppError('The specified new cycle does not belong to the target group.', 400);
    }
  }

  const updatedMeeting = await prisma.meeting.update({
    where: { id },
    data,
    include: {
      group: {
        select: { id: true, name: true }
      },
      cycle: {
        select: { id: true, name: true, status: true }
      }
    },
  });
  return updatedMeeting;
};

export const deleteMeeting = async (id: number) => {
  const meeting = await prisma.meeting.findUnique({
    where: { id },
    include: { savings: true, loans: true, attendance: true }
  });

  if (!meeting) {
    throw new AppError('Meeting not found', 404);
  }

  // Prevent deletion if there are associated savings, loans, or attendance records
  if (meeting.savings.length > 0 || meeting.loans.length > 0 || meeting.attendance.length > 0) {
    throw new AppError('Cannot delete meeting with associated savings, loans, or attendance records. Please delete them first.', 400);
  }

  await prisma.meeting.delete({
    where: { id },
  });
  return { message: 'Meeting deleted successfully' };
};