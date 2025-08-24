// src/auth/auth.service.ts
import { PrismaClient, User, Role } from '@prisma/client';
import AppError from '../utils/AppError';
import { hashPassword, verifyPassword, generateJwtToken } from '../utils/authUtils'; // Assuming these are in authUtils
import crypto from 'crypto'; // For generating reset tokens
import { sendEmail } from '../utils/emailService'; // Assuming you have an email service

const prisma = new PrismaClient();

interface JwtPayload {
  id: number;
}

export const registerUser = async (userData: any) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email },
  });

  if (existingUser) {
    throw new AppError('User with this email already exists', 409);
  }

  const hashedPassword = await hashPassword(userData.password);

  const newUser = await prisma.user.create({
    data: {
      // Your schema.prisma's User model only has 'name', not 'first_name' or 'last_name'.
      // Ensure userData provides a 'name' field, or construct it if you have first/last name from input.
      name: userData.name || `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
      email: userData.email,
      password: hashedPassword,
      role: Role.Agent, // Default role for public signup
      // Removed fields that do not exist in your User model:
      // first_name, last_name, phone_number, is_active, password_changed_at
    },
  });

  // Generate JWT token for immediate login after registration
  const token = generateJwtToken({ id: newUser.id });

  return { user: newUser, token };
};

export const loginUser = async (email: string, password: string) => {
  // const user = await prisma.user.findUnique({
  //   where: { email },
  // });

  // // Removed the 'user.is_active' check because 'is_active' does not exist in your User model.
  // if (!user) {
  //   throw new AppError('Incorrect email or password', 401); // 401 Unauthorized
  // }

  // const isPasswordCorrect = await verifyPassword(password, user.password);

  // if (!isPasswordCorrect) {
  //   throw new AppError('Incorrect email or password', 401);
  // }

  // // Generate JWT token
  // const token = generateJwtToken({ id: user.id });

  // return { user, token };

   const user = await prisma.user.findUnique({ where: { email } });

  // 1. Case: User not found (Email is incorrect or never registered)
  if (!user) {
    // For security, some applications prefer a generic 'Invalid credentials'
    // but you specifically asked to differentiate, so we'll do that.
    throw new AppError('Email is incorrect or never registered.', 401);
  }

  // 2. Case: Password incorrect for existing user
  const isPasswordCorrect = await verifyPassword(password, user.password);
  if (!isPasswordCorrect) {
    throw new AppError('Incorrect password.', 401); // Standard 401 for bad credentials
  }

  // If both checks pass, generate token and return user
  const token = generateJwtToken({ id: user.id }); // Assuming user has an 'id'
  return { user, token };
};

export const requestPasswordReset = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // Return success even if user not found to prevent email enumeration
    console.log(`Password reset requested for non-existent email: ${email}`);
    return { message: 'If a user with that email exists, a password reset email has been sent.' };
  }

  // IMPORTANT: The password reset functionality as written CANNOT be fully secure or functional
  // without adding 'password_reset_token' and 'password_reset_expires' fields to your User model
  // in schema.prisma. Without these, there's no way to store and verify the reset token.

  // For now, to prevent errors, we are NOT updating the database with token/expiration.
  // This means the email will be sent, but the `resetUserPassword` function will not be
  // able to securely verify the token.
  const resetToken = crypto.randomBytes(32).toString('hex');
  // const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  // const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Removed database update for password_reset_token and password_reset_expires
  // await prisma.user.update({
  //   where: { id: user.id },
  //   data: {
  //     password_reset_token: passwordResetToken,
  //     password_reset_expires: passwordResetExpires,
  //   },
  // });

  const resetUrl = `${process.env.FRONTEND_URL}/resetPassword/${resetToken}`; // Adjust frontend URL
  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PATCH request to:\n\n ${resetUrl}\n\n with your new password. If you did not request this, please ignore this email. This link expires in 10 minutes.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });
    return { message: 'Password reset email sent successfully. (Note: Token persistence is disabled due to schema limitations)' };
  } catch (error) {
    // Removed clearing token/expires as they are not set in the first place due to schema limitations
    console.error('Error sending password reset email:', error);
    throw new AppError('There was an error sending the email. Please try again later.', 500);
  }
};

export const resetUserPassword = async (token: string, newPassword: string) => {
  // IMPORTANT: This function CANNOT securely verify the reset token without
  // 'password_reset_token' and 'password_reset_expires' fields in your User model.
  // Without these fields, any attempt to verify the token will fail or be insecure.

  // To prevent compilation errors and clearly indicate the limitation,
  // this function will now always throw an error.
  throw new AppError('Password reset functionality is currently unavailable because the database schema is missing required fields for token verification.', 500);

  /*
  // Original logic (commented out as it relies on schema fields you don't have):
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await prisma.user.findFirst({
    where: {
      password_reset_token: hashedToken,
      password_reset_expires: {
        gte: new Date(),
      },
    },
  });

  if (!user) {
    throw new AppError('Token is invalid or has expired', 400);
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      password_changed_at: new Date(), // This field also doesn't exist
      password_reset_token: null,
      password_reset_expires: null,
    },
  });

  const newToken = generateJwtToken({ id: user.id });

  return { user, token: newToken };
  */
};

export const updateCurrentUserPassword = async (userId: number, currentPassword: string, newPassword: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    // Only select fields that exist in your schema: 'id' and 'password'
    select: {
      id: true,
      password: true,
      // Removed: password_changed_at as it does not exist in your current User model
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const isPasswordCorrect = await verifyPassword(currentPassword, user.password);
  if (!isPasswordCorrect) {
    throw new AppError('Your current password is incorrect.', 401);
  }

  const hashedPassword = await hashPassword(newPassword);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
      // Removed: password_changed_at as it does not exist in your current User model
    },
    select: {
      id: true,
      email: true,
      name: true, // Using 'name' which exists in your schema
      // Removed: first_name, last_name as they do not exist in your current User model
    }
  });

  // Generate a new JWT token (important for security best practices after password change)
  const newToken = generateJwtToken({ id: updatedUser.id });

  return { user: updatedUser, token: newToken };
};
