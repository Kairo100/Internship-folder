// controllers/attendanceController.js
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const User = require('../models/User');
const Class = require('../models/Class');
const mongoose = require('mongoose');

const { checkSequentialAbsentsAndNotify } = require('../utils/cronJobs');

exports.takeAttendance = async (req, res) => {
    try {
        const { classId, date, records } = req.body;
        const userId = req.user.id; // The ID of the currently logged-in user (teacher or admin)
        const userRole = req.user.role; // The role of the currently logged-in user

        // Basic validation
        if (!classId || !date || !records || !Array.isArray(records) || records.length === 0) {
            return res.status(400).json({ message: 'Class ID, date, and student records are required.' });
        }

        const targetClass = await Class.findById(classId);
        if (!targetClass) {
            return res.status(404).json({ message: 'Class not found.' });
        }

        // --- MODIFIED AUTHORIZATION LOGIC ---
        // Allow if user is an Admin OR if user is a Teacher assigned to this class
        if (userRole === 'teacher') {
            // If it's a teacher, ensure they are assigned to this specific class
            if (!targetClass.teacher || targetClass.teacher.toString() !== userId) {
                return res.status(403).json({ message: 'Not authorized: Teachers can only mark attendance for their assigned class.' });
            }
        } else if (userRole === 'admin') {
            // Admins are always authorized to mark attendance for any class
            // No additional class assignment check needed for admins
        } else {
            // If the user is neither a teacher nor an admin, deny access
            return res.status(403).json({ message: 'Not authorized: Only teachers or administrators can mark attendance.' });
        }
        // --- END OF MODIFIED AUTHORIZATION LOGIC ---

        // --- CORRECTED DATE HANDLING FOR takeAttendance ---
        const attendanceDate = new Date(date);
        // Normalize to start of the day in UTC, NOT local time of the server
        attendanceDate.setUTCHours(0, 0, 0, 0); // This is the crucial change for consistency

        let attendanceEntry = await Attendance.findOne({ class: classId, date: attendanceDate });

        if (attendanceEntry) {
            attendanceEntry.records = records;
            attendanceEntry.takenBy = userId; // Record who took/updated it
            await attendanceEntry.save();
            res.status(200).json({ message: 'Attendance updated successfully.', attendance: attendanceEntry });
        } else {
            const newAttendance = new Attendance({
                class: classId,
                date: attendanceDate, // Save the UTC-normalized date
                records,
                takenBy: userId, // Record who took it
            });
            await newAttendance.save();
            res.status(201).json({ message: 'Attendance marked successfully.', attendance: newAttendance });
        }

        // Check for sequential absents AFTER attendance is marked/updated
        await checkSequentialAbsentsAndNotify(classId, attendanceDate);

    } catch (error) {
        console.error('Error taking attendance:', error);
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Attendance for this class and date has already been marked.' });
        }
        res.status(500).json({ message: 'Server error while marking attendance.', details: error.message });
    }
};



/**
 * @desc    Get attendance records for a specific class for a given date (or all dates)
 * @route   GET /api/attendance/class/:classId?date=YYYY-MM-DD&month=MM&year=YYYY&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 * @access  Private (Admin, Teacher)
 */
exports.getAttendanceByClass = async (req, res) => {
    try {
        const { classId } = req.params;
        const { date, month, year, startDate, endDate } = req.query; // Optional date query parameters

        let query = { class: classId };

        if (date) {
            // For a single specific date (e.g., from an attendance marking page)
            const specificDate = new Date(date);
            specificDate.setUTCHours(0, 0, 0, 0); // Start of the day in UTC
            const nextDay = new Date(specificDate);
            nextDay.setUTCDate(nextDay.getUTCDate() + 1); // Move to the next day in UTC

            query.date = { $gte: specificDate, $lt: nextDay };
        } else if (month && year) {
            // For monthly reports
            // month is 1-indexed from frontend
            const startOfMonth = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, 1)); // UTC start of the month
            const endOfMonth = new Date(Date.UTC(parseInt(year), parseInt(month), 0, 23, 59, 59, 999)); // UTC end of the month (last millisecond of the month)

            query.date = { $gte: startOfMonth, $lte: endOfMonth };
        } else if (startDate && endDate) {
            // For custom date range reports
            const queryStartDate = new Date(startDate);
            queryStartDate.setUTCHours(0, 0, 0, 0); // Start of the day in UTC

            const queryEndDate = new Date(endDate);
            queryEndDate.setUTCHours(23, 59, 59, 999); // End of the day in UTC

            query.date = { $gte: queryStartDate, $lte: queryEndDate };
        }

        // Populate student names and roll numbers within the records array
        const attendanceRecords = await Attendance.find(query)
            .populate({
                path: 'records.student',
                select: 'name rollNumber'
            })
            .sort({ date: -1 }); // Sort by most recent first

        // Also fetch all students for the class to show who hasn't been marked
        const allStudentsInClass = await Student.find({ class: classId }).select('name rollNumber');

        res.json({ attendanceRecords, allStudentsInClass });

    } catch (error) {
        console.error('Error fetching attendance by class:', error);
        res.status(500).json({ message: 'Server error.', details: error.message });
    }
};



/**
 * @desc    Get attendance records for a specific student across all classes
 * @route   GET /api/attendance/student/:studentId
 * @access  Private (Admin, Teacher if fetching own student, Student if fetching own records)
 */
exports.getAttendanceByStudent = async (req, res) => {
    try {
        const { studentId } = req.params;

        // Ensure studentId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ message: 'Invalid student ID.' });
        }

        const attendanceRecords = await Attendance.find({ 'records.student': studentId })
            .populate('class', 'name') // Populate class name
            .populate({
                path: 'records.student',
                match: { _id: studentId }, // Only populate the matching student in the record
                select: 'name rollNumber'
            })
            .sort({ date: -1 });

        // Filter out records where the specific student wasn't found (due to `match`)
        const filteredRecords = attendanceRecords.map(entry => {
            const studentRecord = entry.records.find(r => r.student && r.student._id.toString() === studentId);
            return {
                _id: entry._id,
                class: entry.class,
                date: entry.date,
                status: studentRecord ? studentRecord.status : 'N/A', // Status for this student
                takenBy: entry.takenBy,
                createdAt: entry.createdAt,
                updatedAt: entry.updatedAt,
            };
        });

        res.json(filteredRecords);
    } catch (error) {
        console.error('Error fetching attendance by student:', error);
        res.status(500).json({ message: 'Server error.', details: error.message });
    }
};

