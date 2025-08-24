// utils/cronJobs.js
const cron = require('node-cron');
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const Class = require('../models/Class');
const Student = require('../models/Student'); // Make sure Student model is imported
const { sendAttendanceReminder, sendSequentialAbsenceAlert, sendEmailWithReport } = require('./emailService');
const mongoose = require('mongoose');

/**
 * Send daily reminders to teachers to submit attendance for the day
 */
const scheduleDailyAttendanceReminder = () => {
    // Run every day at 7:00 AM
    cron.schedule('0 7 * * *', async () => {
        try {
            const today = new Date();
            const classes = await Class.find({}).populate('teacher');

            for (const cls of classes) {
                // Find teacher of the class
                const teacher = await User.findOne({ _id: cls.teacher, role: 'teacher' });

                if (teacher) {
                    await sendAttendanceReminder(teacher.email, cls.name, today);
                }
            }
            console.log('Daily attendance reminders sent');
        } catch (error) {
            console.error('Error in daily attendance reminders:', error);
        }
    });
};

/**
 * Schedule daily attendance report and "no attendance" alerts for administrators.
 * This runs after the typical attendance submission time (e.g., 8:00 AM).
 */
const scheduleDailyAttendanceReport = () => {
    // Run every day at 8:00 AM (adjust time as needed, e.g., '0 8 * * *' for 8:00 AM)
    cron.schedule('0 8 * * *', async () => {
        try {
            console.log('Running daily attendance report check...');
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Start of today
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1); // Start of tomorrow

            const adminEmail = process.env.ADMIN_REPORT_EMAIL || 'admin@example.com'; // Admin email from .env or default

            const classes = await Class.find({});

            for (const cls of classes) {
                const className = cls.name;
                const classId = cls._id;

                // Check if any attendance records exist for this class for today
                const attendanceTaken = await Attendance.findOne({
                    class: classId,
                    attendanceDate: { $gte: today, $lt: tomorrow }
                });

                if (attendanceTaken) {
                    // Attendance HAS been taken, generate and send the report
                    const students = await Student.find({ class: classId });
                    const attendanceRecords = await Attendance.find({
                        class: classId,
                        attendanceDate: { $gte: today, $lt: tomorrow }
                    }).populate('student', 'name rollNumber');

                    let htmlContent = `
                        <p>Dear Administrator,</p>
                        <p>Attendance for Class: <strong>${className}</strong> on <strong>${today.toLocaleDateString()}</strong> has been recorded.</p>
                        <h3>Today's Attendance Sheet:</h3>
                        <table border="1" style="width:100%; border-collapse: collapse;">
                            <thead>
                                <tr>
                                    <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Roll No.</th>
                                    <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Student Name</th>
                                    <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                    `;

                    // Map students to their attendance status for today
                    const attendanceMap = new Map();
                    attendanceRecords.forEach(record => {
                        attendanceMap.set(record.student._id.toString(), record.status);
                    });

                    students.forEach(student => {
                        const status = attendanceMap.get(student._id.toString()) || 'Not Marked'; // Default if no record
                        htmlContent += `
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd;">${student.rollNumber || 'N/A'}</td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${student.name}</td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${status}</td>
                            </tr>
                        `;
                    });

                    htmlContent += `
                            </tbody>
                        </table>
                        <p>Regards,<br/>Your School System</p>
                    `;

                    const subject = `Daily Attendance Report for Class ${className} - ${today.toLocaleDateString()}`;
                    await sendEmailWithReport(adminEmail, subject, htmlContent);
                    console.log(`Daily attendance report sent for Class ${className}.`);

                } else {
                    // Attendance has NOT been taken for this class today
                    const subject = `Urgent: No Attendance Recorded for Class ${className} - ${today.toLocaleDateString()}`;
                    const htmlContent = `
                        <p>Dear Administrator,</p>
                        <p>This is an urgent notification: Attendance has **NOT** been recorded for Class <strong>${className}</strong> for today, <strong>${today.toLocaleDateString()}</strong>.</p>
                        <p>Please follow up to ensure attendance is submitted.</p>
                        <p>Regards,<br/>Your School System</p>
                    `;
                    await sendEmailWithReport(adminEmail, subject, htmlContent);
                    console.log(`"No attendance recorded" alert sent for Class ${className}.`);
                }
            }
            console.log('Daily attendance report check completed.');
        } catch (error) {
            console.error('Error in daily attendance report check:', error);
        }
    });
};


/**
 * Check students with 3 or more consecutive absences and send alerts
 *
 * @param {mongoose.Types.ObjectId} classId
 * @param {Date} attendanceDate
 */
const checkSequentialAbsentsAndNotify = async (classId, currentAttendanceDate) => {
    try {
        console.log(`[Sequential Absence Check] Starting for class: ${classId} on date: ${currentAttendanceDate}`);

        // Get all students in the specific class
        const studentsInClass = await Student.find({ class: classId }).select('_id name email'); // Get student email for notification

        // Find the teacher for this class
        const targetClass = await Class.findById(classId).populate('teacher', 'email'); // Populate teacher's email
        if (!targetClass) {
            console.warn(`[Sequential Absence Check] Class with ID ${classId} not found. Skipping.`);
            return;
        }

        const teacherEmail = targetClass.teacher ? targetClass.teacher.email : null;
        const adminEmail = process.env.ADMIN_REPORT_EMAIL || 'admin@example.com'; // Fallback admin email

        for (const student of studentsInClass) {
            let consecutiveAbsences = 0;
            // Start checking from the day before the current attendance date
            let currentDate = moment(currentAttendanceDate).utc().startOf('day').subtract(1, 'days'); // Go back one day

            for (let i = 0; i < 3; i++) { // Check up to 3 days back
                const checkDate = currentDate.toDate(); // This is the UTC start of the day we're checking

                // Find attendance record for this specific class and date
                const attendanceForDate = await Attendance.findOne({
                    class: classId,
                    date: checkDate // Match the exact UTC start of the day
                });

                if (attendanceForDate) {
                    // Check if this student was marked absent on this specific date
                    const studentRecord = attendanceForDate.records.find(
                        r => r.student.toString() === student._id.toString() && r.status === 'absent'
                    );

                    if (studentRecord) {
                        consecutiveAbsences++;
                        console.log(`[Sequential Absence Check] Student ${student.name} was absent on ${checkDate.toISOString().split('T')[0]}. Consecutive: ${consecutiveAbsences}`);
                    } else {
                        // Not absent on this day, break the streak
                        break;
                    }
                } else {
                    // No attendance record for this class on this date, break the streak (or treat as present, depending on school policy)
                    // For now, we'll break the streak as we can't confirm absence.
                    break;
                }

                currentDate.subtract(1, 'days'); // Move to the previous day
            }

            if (consecutiveAbsences >= 3) {
                console.log(`[Sequential Absence Check] Student ${student.name} (ID: ${student._id}) has ${consecutiveAbsences} consecutive absences!`);
                const recipientEmail = teacherEmail || adminEmail; // Prefer teacher, fallback to admin

                if (recipientEmail) {
                    await sendSequentialAbsenceAlert(recipientEmail, student.name, consecutiveAbsences);
                    console.log(`[Sequential Absence Check] Sequential absence alert sent for ${student.name} to ${recipientEmail}`);
                } else {
                    console.warn(`[Sequential Absence Check] No recipient email found for alert for student ${student.name}.`);
                }
            } else {
                 console.log(`[Sequential Absence Check] Student ${student.name} has ${consecutiveAbsences} consecutive absences (not enough for alert).`);
            }
        }
        console.log(`[Sequential Absence Check] Completed for class: ${classId}`);
    } catch (error) {
        console.error('[Sequential Absence Check] Error in checking sequential absences:', error);
    }
};


module.exports = {
    scheduleDailyAttendanceReminder,
    scheduleDailyAttendanceReport,
    checkSequentialAbsentsAndNotify,
};




// const checkSequentialAbsentsAndNotify = async (classId, attendanceDate) => {
//     try {
//         // Get all students in the class
//         const students = await mongoose.model('Student').find({ class: classId });

//         for (const student of students) {
//             // Find the last 3 attendance records before attendanceDate
//             const records = await Attendance.find({
//                 student: student._id,
//                 attendanceDate: { $lt: attendanceDate },
//             })
//                 .sort({ attendanceDate: -1 })
//                 .limit(3);

//             // Check if all last 3 records are 'absent'
//             if (records.length === 3 && records.every(r => r.status === 'absent')) {
//                 // Get teacher or admin emails to send alert
//                 // For simplicity, send to all teachers of the class
//                 const teacher = await mongoose.model('User').findOne({ class: classId, role: 'teacher' }); // This needs correction if a teacher isn't directly linked to a class in User model

//                 if (teacher) {
//                     await sendSequentialAbsenceAlert(teacher.email, student.name, 3);
//                 } else {
//                     // Fallback to admin if no teacher found for the class
//                     const adminEmail = process.env.ADMIN_REPORT_EMAIL || 'admin@example.com';
//                     await sendSequentialAbsenceAlert(adminEmail, student.name, 3);
//                 }
//             }
//         }
//     } catch (error) {
//         console.error('Error in checking sequential absences:', error);
//     }
// };


// module.exports = {
//     scheduleDailyAttendanceReminder,
//     scheduleDailyAttendanceReport, // Export the new function
//     checkSequentialAbsentsAndNotify,
// };