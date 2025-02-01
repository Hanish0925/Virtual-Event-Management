const jwt = require('jsonwebtoken');
const User = require('../models/users'); 
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const auth = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    console.log('Authorization Header:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send('Access Denied. Please provide a valid token');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).send('Access Denied. Invalid token');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("Decoded Token:", decoded); // Debugging

        if (!decoded.email) {
            return res.status(400).send("Invalid token structure: Missing email");
        }

        const user = await User.getUserByEmail(decoded.email);
        if (!user) {
            return res.status(404).send('User not found');
        }

        req.user = user;
        console.log("User attached to request:", req.user); // Debugging
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        res.status(400).send('Invalid token');
    }
};

// Middleware to check if the user has the required role
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).send('Access Denied. You do not have the required permissions.');
    }
    next();
  };
};

module.exports = { auth, checkRole };

