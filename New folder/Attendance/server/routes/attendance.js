// routes/attendance.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { isTeacher, isAdmin } = require('../middleware/roleMiddleware');
const { takeAttendance, getAttendanceByClass, getAttendanceByStudent } = require('../controllers/attendanceController');

// Teacher marks attendance for their class
router.post('/mark/teacher', protect, isTeacher, takeAttendance);

// Admin marks attendance (potentially for any class)
router.post('/mark/admin', protect, isAdmin, takeAttendance); 

// Get attendance records by class (for admin)
router.get('/class/:classId', protect, getAttendanceByClass);

// Get attendance records by student (for admin)
router.get('/student/:studentId', protect, getAttendanceByStudent);

module.exports = router;
