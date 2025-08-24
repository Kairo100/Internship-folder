// src/attendance/attendance.service.ts
import { PrismaClient, AttendanceStatus } from '@prisma/client';
import AppError from '../utils/AppError';

const prisma = new PrismaClient();

// Define types for Attendance data
interface CreateAttendanceData {
  status: AttendanceStatus;
  date: Date;
  member_id: number;
  meeting_id: number;
}

interface UpdateAttendanceData {
  status?: AttendanceStatus;
  date?: Date;
  member_id?: number;
  meeting_id?: number;
}

export const createAttendance = async (data: CreateAttendanceData) => {
  // 1. Check if the member exists
  const member = await prisma.member.findUnique({
    where: { id: data.member_id },
  });
  if (!member) {
    throw new AppError('Member not found. Cannot record attendance for a non-existent member.', 400);
  }

  // 2. Check if the meeting exists
  const meeting = await prisma.meeting.findUnique({
    where: { id: data.meeting_id },
  });
  if (!meeting) {
    throw new AppError('Meeting not found. Cannot record attendance for a non-existent meeting.', 400);
  }

  // Optional: Check if the member belongs to the group of the meeting (stronger data integrity)
  // const memberGroup = await prisma.member.findUnique({ where: { id: data.member_id }, select: { group_id: true } });
  // if (memberGroup?.group_id !== meeting.group_id) {
  //   throw new AppError('Member does not belong to the group of this meeting.', 400);
  // }

  // Optional: Prevent duplicate attendance for the same member in the same meeting
  const existingAttendance = await prisma.attendance.findFirst({
    where: {
      member_id: data.member_id,
      meeting_id: data.meeting_id,
    },
  });
  if (existingAttendance) {
    throw new AppError('Attendance record already exists for this member in this meeting. Use PATCH to update.', 409); // 409 Conflict
  }


  const attendance = await prisma.attendance.create({
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
  return attendance;
};

export const getAllAttendance = async (meetingId?: number, memberId?: number) => {
  const where: any = {};
  if (meetingId) {
    where.meeting_id = meetingId;
  }
  if (memberId) {
    where.member_id = memberId;
  }

  const attendanceRecords = await prisma.attendance.findMany({
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
  return attendanceRecords;
};

export const getAttendanceById = async (id: number) => {
  const attendance = await prisma.attendance.findUnique({
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
  if (!attendance) {
    throw new AppError('Attendance record not found', 404);
  }
  return attendance;
};

export const updateAttendance = async (id: number, data: UpdateAttendanceData) => {
  const attendance = await prisma.attendance.findUnique({
    where: { id },
  });
  if (!attendance) {
    throw new AppError('Attendance record not found', 404);
  }

  // If member_id is being changed
  if (data.member_id && data.member_id !== attendance.member_id) {
    const newMember = await prisma.member.findUnique({
      where: { id: data.member_id },
    });
    if (!newMember) {
      throw new AppError('New Member not found.', 400);
    }
  }

  // If meeting_id is being changed
  if (data.meeting_id && data.meeting_id !== attendance.meeting_id) {
    const newMeeting = await prisma.meeting.findUnique({
      where: { id: data.meeting_id },
    });
    if (!newMeeting) {
      throw new AppError('New Meeting not found.', 400);
    }
  }

  const updatedAttendance = await prisma.attendance.update({
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
  return updatedAttendance;
};

export const deleteAttendance = async (id: number) => {
  const attendance = await prisma.attendance.findUnique({
    where: { id },
  });
  if (!attendance) {
    throw new AppError('Attendance record not found', 404);
  }

  await prisma.attendance.delete({
    where: { id },
  });
  return { message: 'Attendance record deleted successfully' };
};