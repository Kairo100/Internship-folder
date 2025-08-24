// routes/reports.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');
const { generateClassReport, generateStudentReport , generateStudentSummaryByClass, generateAbsentStudentsReport, downloadReport } = require('../controllers/reportController');

// Download attendance report per class
router.get('/class/:classId', protect, isAdmin, generateClassReport);

// Download attendance report per student
router.get('/student/:studentId', protect, isAdmin, generateStudentReport);


router.get('/student-summary-by-class/:classId', protect, isAdmin, generateStudentSummaryByClass);

// New route for absent students report
router.get('/absent-students', protect, isAdmin, generateAbsentStudentsReport); // <<< Add this new route


// New route for downloading reports (matches frontend's /admin/reports/download/:reportType)
router.get('/download/:reportType', protect, isAdmin, downloadReport); // <<< Add this new route


module.exports = router;
