import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1]; // Extract token
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY); // Verify token

            // Find user by ID from token and exclude password field
            req.user = await User.findById(decodedToken.id).select("-password");
            next(); // Proceed to the next middleware if token is valid
        } catch (error) {
            // Handle specific error for expired token
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    message: 'Session expired. Please log in again.',
                });
            } else {
                // Handle all other token errors
                return res.status(401).json({
                    message: 'Not authorized. Invalid token.',
                });
            }
        }
    } else {
        // If no token is provided
        res.status(401).json({
            message: 'Not authorized. No token provided.',
        });
    }
};