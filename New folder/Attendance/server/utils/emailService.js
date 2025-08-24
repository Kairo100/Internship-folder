// utils/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,       // e.g., smtp.gmail.com
  port: process.env.EMAIL_PORT,       // usually 465 (SSL) or 587 (TLS)
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for others
  auth: {
    user: process.env.EMAIL_USER,     // your email
    pass: process.env.EMAIL_PASS,     // your email password or app-specific password
  },
});

const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: `"Attendance System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to} with subject: ${subject}`);
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
};

const sendAttendanceReminder = async (to, className, date) => {
  const subject = `Reminder: Take attendance for class ${className} on ${date.toDateString()}`;
  const text = `Dear Teacher,\n\nPlease remember to submit the attendance for your class ${className} for date ${date.toDateString()}.\n\nThanks,\nAttendance System`;
  await sendEmail(to, subject, text);
};

const sendSequentialAbsenceAlert = async (to, studentName, daysAbsent) => {
  const subject = `Alert: ${studentName} absent for ${daysAbsent} consecutive days`;
  const text = `Dear Teacher/Admin,\n\nStudent ${studentName} has been absent for ${daysAbsent} consecutive days. Please follow up.\n\nRegards,\nAttendance System`;
  await sendEmail(to, subject, text);
};

const sendEmailWithReport = async (to, subject, htmlContent) => {
  await sendEmail(to, subject, null, htmlContent);
};


// NEW FUNCTION: Send email with attachments.................gonna be back
const sendEmailWithAttachment = async (to, subject, text, attachments) => {
    try {
        const mailOptions = {
            from: `"Attendance System" <${process.env.ADMIN_REPORT_EMAI}>`,
            to,
            subject,
            text,
            attachments: attachments // Array of attachment objects
        };
        await transporter.sendMail(mailOptions);
        console.log(`Email with attachment sent to ${to} with subject: ${subject}`);
    } catch (error) {
        console.error('Email with attachment send error:', error);
        throw error;
    }
};

module.exports = {
  sendEmail,
  sendAttendanceReminder,
  sendSequentialAbsenceAlert,
  sendEmailWithAttachment, // Export the new function
};