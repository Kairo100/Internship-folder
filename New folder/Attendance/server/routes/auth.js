// routes/auth.js
const express = require('express');
const router = express.Router();
const { login, registerAdmin, registerTeacher, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.get('/me', getMe);
router.post('/register/admin', registerAdmin);
router.post('/register/teacher', registerTeacher);
router.post('/login', login);

module.exports = router;
