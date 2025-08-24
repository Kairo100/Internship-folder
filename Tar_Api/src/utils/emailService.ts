// src/utils/emailService.ts
import nodemailer from 'nodemailer';
import AppError from './AppError';

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

export const sendEmail = async (options: EmailOptions) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587', 10), // Use parse to ensure number type
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // For development, if you're using a self-signed cert or local mail server (e.g., Mailtrap)
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === 'production', // Reject unauthorized for production
    },
  } as nodemailer.TransportOptions); // Cast to TransportOptions to satisfy TypeScript

  // 2) Define the email options
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'Your App <no-reply@yourapp.com>',
    to: options.email,
    subject: options.subject,
    html: options.message, // Use HTML for richer content
    text: options.message.replace(/<[^>]*>?/gm, ''), // Plain text fallback
  };

  // 3) Actually send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${options.email}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new AppError('Failed to send email. Please check server logs.', 500);
  }
};