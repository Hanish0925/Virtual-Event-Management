const express = require('express');
const userController = require('../controllers/userController');
const { auth , checkRole } = require('../middleware/auth');
const router = express.Router();

// Public routes
router.post('/signup', userController.Signup);
router.post('/login', userController.Login);

// Protected routes
router.get('/preferences', auth, checkRole(['attendee', 'organizer']), userController.GetUserPreferences); // Both attendees and organizers can get preferences
router.put('/preferences', auth, checkRole('organizer'), userController.updateUserPreferences); // Only organizers can update preferences

module.exports = router;