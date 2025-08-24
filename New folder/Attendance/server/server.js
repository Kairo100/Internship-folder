// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

// Import your User model
const User = require('./models/User'); // <--- ADD THIS LINE: Import the User model

// Import routes
const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance');
const reportRoutes = require('./routes/reports');
const adminRoutes = require('./routes/admin');
const teacherRoutes = require('./routes/teacherRoutes'); // <--- NEW
// Import cron jobs
const { scheduleDailyAttendanceReminder , scheduleDailyAttendanceReport } = require('./utils/cronJobs');

const app = express();

// Middleware
const allowedOrigins = process.env.Frontend; // Add your frontend origins here

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        // or if the origin is in our allowed list
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // <--- THIS IS CRUCIAL: Allow sending cookies/auth headers
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
};

app.use(cors(corsOptions)); 
app.use(express.json());
app.use(morgan('dev')); // Logging HTTP requests

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
.then(() => {
    console.log('MongoDB connected');
    // <--- ADD THIS BLOCK: Call function to ensure initial admin
    ensureInitialAdminUser();
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// <--- ADD THIS FUNCTION: Function to check and create initial admin
async function ensureInitialAdminUser() {
    try {
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            console.log('No users found. Creating initial admin user...');
            await User.create({
                name: 'Super Admin',
                email: process.env.admin, 
                password: process.env.pass, 
                role: 'admin',
            });
            console.log('Initial admin user created successfully.');
            console.log('Email: admin@example.com');
            console.log('Password: adminpassword123 (PLEASE CHANGE THIS IMMEDIATELY)');
        } else {
            console.log(`${userCount} users found. No initial admin creation needed.`);
        }
    } catch (error) {
        console.error('Error ensuring initial admin user:', error);
    }
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/teacher', teacherRoutes); // <--- NEW: Dedicated prefix for teacher routes


// Basic health check route
app.get('/', (req, res) => {
    res.send('Attendance System API is running');
});

// Start cron jobs
scheduleDailyAttendanceReminder();
scheduleDailyAttendanceReport(); // Call the new scheduler
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});