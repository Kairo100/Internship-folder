// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Make sure to import your User model here

const protect = async (req, res, next) => {
    let token;

    // 1. Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (e.g., "Bearer YOUR_TOKEN")
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // console.log('Decoded JWT payload:', decoded); // For debugging: see what's in the token

            // 3. Find the user by ID from the token payload and attach to req.user
            //    This is where the 'role' field is fetched from the database
            req.user = await User.findById(decoded.id).select('-password'); // Exclude password from req.user

            // console.log('User found in protect middleware:', req.user); // For debugging: see the full user object

            if (!req.user) {
                // If user doesn't exist for the ID in the token
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next(); // Proceed to the next middleware/controller
        } catch (error) {
            // Token is invalid, expired, or other JWT error
            console.error('Authentication error (protect middleware):', error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // If no token is provided
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };