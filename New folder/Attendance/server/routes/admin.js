// routes/admin.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { isAdmin, isTeacher } = require('../middleware/roleMiddleware');
const { createClass, deleteClass, getAllClasses, getTeachers, getAllStudents,
     removeTeacher, sendReportEmail , getStudentsByClass, createTeacher,
      getTeacherById,updateTeacher, getClassById, updateClass, createStudent,
       getStudentById, updateStudent, deleteStudent, getDashboardStats,
    } = require('../controllers/adminController');

// Class management

router.post('/classes', protect, isAdmin, createClass);
router.delete('/classes/:id', protect, isAdmin, deleteClass);
router.get('/classes', protect, isAdmin, getAllClasses);
router.get('/classes/:id', protect, isAdmin, getClassById); 
router.put('/classes/:id', protect, isAdmin, updateClass);  
 

// Teacher management
// Teacher management
router.post('/teachers', protect, isAdmin, createTeacher); // Changed from /teachers/add for RESTfulness
router.get('/teachers', protect, isAdmin, getTeachers);
router.get('/teachers/:id', protect, isAdmin, getTeacherById); // NEW: Get single teacher
router.put('/teachers/:id', protect, isAdmin, updateTeacher); // NEW: Update teacher
router.delete('/teachers/:id', protect, isAdmin, removeTeacher);





// Student listing


router.post('/students', createStudent); // NEW
router.get('/students', getAllStudents);
router.get('/students/:id', getStudentById); // NEW
router.put('/students/:id',updateStudent); // NEW
router.delete('/students/:id', deleteStudent); // NEW

// Send report via email
router.post('/reports/email', protect, isAdmin, sendReportEmail);


// Get students by class id
router.get('/classes/:id/students', protect, isAdmin, getStudentsByClass);




// RECOMMENDED: Single Dashboard Stats Route
router.get('/dashboard',protect, isAdmin, getDashboardStats);


// admin
module.exports = router;










