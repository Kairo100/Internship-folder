// src/user/user.service.ts
import { PrismaClient, User, Role } from '@prisma/client';
import AppError from '../utils/AppError';
import { hashPassword } from '../utils/authUtils';

const prisma = new PrismaClient();

// Define types for user data, reflecting your current schema
export interface CreateUserData { // Added 'export'
  name: string; // Changed from first_name, last_name
  email: string;
  password: string;
  role?: Role;
}

export interface UpdateUserData { // Added 'export'
  name?: string; // Changed from first_name, last_name
  email?: string;
  role?: Role;
}

export const createUser = async (data: CreateUserData) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new AppError('User with this email already exists', 409); // 409 Conflict
  }

  const hashedPassword = await hashPassword(data.password);

  const newUser = await prisma.user.create({
    data: {
      name: data.name, // Using 'name' field
      email: data.email,
      password: hashedPassword,
      role: data.role || Role.Member, // Default to Member if not provided
      // Removed: password_changed_at as it does not exist in your User model
    },
    select: {
      id: true,
      name: true, // Using 'name' field
      email: true,
      role: true,
      // Removed: phone_number, is_active as they do not exist in your User model
      created_at: true,
      updated_at: true,
    },
  });
  return newUser;
};

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true, // Using 'name' field
      email: true,
      role: true,
      // Removed: phone_number, is_active as they do not exist in your User model
      created_at: true,
      updated_at: true,
    },
  });
  return users;
};

export const getUserById = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true, // Using 'name' field
      email: true,
      role: true,
      // Removed: phone_number, is_active as they do not exist in your User model
      created_at: true,
      updated_at: true,
    },
  });
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};

export const updateUser = async (id: number, data: UpdateUserData) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // If email is being updated, check for uniqueness
  if (data.email && data.email !== user.email) {
    const existingUserWithNewEmail = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUserWithNewEmail) {
      throw new AppError('Email already in use by another user.', 409);
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      name: data.name, // Ensure 'name' is updated if provided
      email: data.email,
      role: data.role,
    },
    select: {
      id: true,
      name: true, // Using 'name' field
      email: true,
      role: true,
      // Removed: phone_number, is_active as they do not exist in your User model
      created_at: true,
      updated_at: true,
    },
  });
  return updatedUser;
};
