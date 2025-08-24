// routes/admin.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {  isTeacher } = require('../middleware/roleMiddleware');
const { getTeacherDashboardStats,markAttendanceByTeacher,
    getStudentsForTeacherClass, getTeacherAssignedClasses, getAttendanceForClassByTeacher} = require('../controllers/adminController');


// RECOMMENDED: Single Dashboard Stats Route

router.get('/dashboard',protect, isTeacher, getTeacherDashboardStats);

router.get('/students/:classId', protect, getStudentsForTeacherClass); // The one you use for fetching students
router.get('/my-classes', protect, getTeacherAssignedClasses); // The one you use for fetching classes
router.get('/my-classes/:classId/selectedDate', protect, getAttendanceForClassByTeacher); // The one you use for fetching existing attendance

module.exports = router;










