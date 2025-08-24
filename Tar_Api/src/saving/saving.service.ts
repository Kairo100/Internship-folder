// src/saving/saving.service.ts
import { PrismaClient } from '@prisma/client';
import AppError from '../utils/AppError';

const prisma = new PrismaClient();

// Define types for Saving data
interface CreateSavingData {
  amount: number;
  date: Date;
  member_id: number;
  meeting_id: number;
}

interface UpdateSavingData {
  amount?: number;
  date?: Date;
  member_id?: number;
  meeting_id?: number;
}

export const createSaving = async (data: CreateSavingData) => {
  // 1. Check if the member exists
  const member = await prisma.member.findUnique({
    where: { id: data.member_id },
  });
  if (!member) {
    throw new AppError('Member not found. Cannot record saving for a non-existent member.', 400);
  }

  // 2. Check if the meeting exists
  const meeting = await prisma.meeting.findUnique({
    where: { id: data.meeting_id },
  });
  if (!meeting) {
    throw new AppError('Meeting not found. Cannot record saving for a non-existent meeting.', 400);
  }

  // Optional: Check if the member belongs to the group of the meeting (stronger data integrity)
  // const memberGroup = await prisma.member.findUnique({ where: { id: data.member_id }, select: { group_id: true } });
  // if (memberGroup?.group_id !== meeting.group_id) {
  //   throw new AppError('Member does not belong to the group of this meeting.', 400);
  // }


  const saving = await prisma.saving.create({
    data,
    include: {
      member: {
        select: { id: true, first_name: true, last_name: true }
      },
      meeting: {
        select: { id: true, name: true, date: true }
      }
    },
  });
  return saving;
};

export const getAllSavings = async (meetingId?: number, memberId?: number) => {
  const where: any = {};
  if (meetingId) {
    where.meeting_id = meetingId;
  }
  if (memberId) {
    where.member_id = memberId;
  }

  const savings = await prisma.saving.findMany({
    where,
    include: {
      member: {
        select: { id: true, first_name: true, last_name: true, group_id: true }
      },
      meeting: {
        select: { id: true, name: true, date: true, group_id: true }
      }
    },
  });
  return savings;
};

export const getSavingById = async (id: number) => {
  const saving = await prisma.saving.findUnique({
    where: { id },
    include: {
      member: {
        select: { id: true, first_name: true, last_name: true }
      },
      meeting: {
        select: { id: true, name: true, date: true }
      }
    },
  });
  if (!saving) {
    throw new AppError('Saving record not found', 404);
  }
  return saving;
};

export const updateSaving = async (id: number, data: UpdateSavingData) => {
  const saving = await prisma.saving.findUnique({
    where: { id },
  });
  if (!saving) {
    throw new AppError('Saving record not found', 404);
  }

  // Check for member existence if member_id is provided
  if (data.member_id) {
    const member = await prisma.member.findUnique({
      where: { id: data.member_id },
    });
    if (!member) {
      throw new AppError('New Member not found.', 400);
    }
  }

  // Check for meeting existence if meeting_id is provided
  if (data.meeting_id) {
    const meeting = await prisma.meeting.findUnique({
      where: { id: data.meeting_id },
    });
    if (!meeting) {
      throw new AppError('New Meeting not found.', 400);
    }
  }

  const updatedSaving = await prisma.saving.update({
    where: { id },
    data,
    include: {
      member: {
        select: { id: true, first_name: true, last_name: true }
      },
      meeting: {
        select: { id: true, name: true, date: true }
      }
    },
  });
  return updatedSaving;
};

export const deleteSaving = async (id: number) => {
  const saving = await prisma.saving.findUnique({
    where: { id },
  });
  if (!saving) {
    throw new AppError('Saving record not found', 404);
  }

  await prisma.saving.delete({
    where: { id },
  });
  return { message: 'Saving record deleted successfully' };
};