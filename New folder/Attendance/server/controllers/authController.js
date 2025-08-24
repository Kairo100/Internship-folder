// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs'); // You might not need bcrypt directly here after this change
const jwt = require('jsonwebtoken');

// Helper to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// exports.login = async (req, res) => {
//     const { email, password } = req.body;
//     console.log('Login attempt for email:', email); // Added for debugging
//     try {
//         const user = await User.findOne({ email });
//         console.log('User found:', user ? user.email : 'None'); // Added for debugging
//         if (!user) {
//             console.log('User not found.'); // Added for debugging
//             return res.status(400).json({ message: 'Invalid credentials' });
//         }

//         // Use the instance method for comparison (good practice, though bcrypt.compare directly is fine too)
//         const isMatch = await user.matchPassword(password); // Using the method defined in User.js
//         console.log('Password match result:', isMatch); // Added for debugging

//         if (!isMatch) {
//             console.log('Password mismatch.'); // Added for debugging
//             return res.status(400).json({ message: 'Invalid credentials' });
//         }

//         const token = generateToken(user._id);
//         res.json({ token, user: { id: user._id, name: user.name, role: user.role, email: user.email } });
//     } catch (err) {
//         console.error("Login error:", err); // Log the actual error
//         res.status(500).json({ message: 'Server error' });
//     }
// };



exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        // Case 1: User not found (email does not exist)
        if (!user) {
            return res.status(400).json({ message: 'Wrong email or password.' });
            // For security, it's generally better not to disclose whether the email exists or not.
            // A generic "Wrong email or password" is more secure than "Email not found".
        }

        // Case 2: User found, but password does not match
        const isMatch = await user.matchPassword(password); // Using the method defined in User.js
        if (!isMatch) {
            return res.status(400).json({ message: 'Wrong email or password.' });
            // Same security principle: avoid saying "Wrong password" specifically if the email exists.
            // This prevents attackers from enumerating valid emails.
        }

        const token = generateToken(user._id);
        res.json({ token, user: { id: user._id, name: user.name, role: user.role, email: user.email } });
    } catch (err) {
        console.error("Login error:", err); // Log the actual error for debugging
        res.status(500).json({ message: 'Server error during login.' });
    }
};
exports.registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'Email already registered' });

        // DO NOT HASH PASSWORD HERE. The pre('save') hook in the model will handle it.
        user = new User({ name, email, password, role: 'admin' }); // Pass plaintext password
        await user.save(); // The pre('save') hook will hash it here

        const token = generateToken(user._id);
        res.status(201).json({ token, user: { id: user._id, name: user.name, role: user.role, email: user.email } });
    } catch (err) {
        console.error("Registration error (Admin):", err); // Log the actual error
        res.status(500).json({ message: 'Server error' });
    }
};

exports.registerTeacher = async (req, res) => {
    // Only admin calls this route
    const { name, email, password, classId } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'Email already registered' });

        // DO NOT HASH PASSWORD HERE. The pre('save') hook in the model will handle it.
        user = new User({ name, email, password, role: 'teacher', assignedClass: classId }); // Pass plaintext password
        await user.save(); // The pre('save') hook will hash it here

        res.status(201).json({ message: 'Teacher created successfully', userId: user._id });
    } catch (err) {
        console.error("Registration error (Teacher):", err); // Log the actual error
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getMe = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    res.status(200).json(req.user);
};