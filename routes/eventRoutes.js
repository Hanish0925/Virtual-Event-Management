const express = require('express');
const eventController = require('../controllers/eventController');
const { auth, checkRole } = require('../middleware/auth');
const router = express.Router();

// accessible to oly organizer
router.post('/', auth, checkRole('organizer'), eventController.createEvent);
router.get('/', auth, eventController.getAllEvents); // Accessible to all authenticated users
router.get('/:id', auth, eventController.getEventById); // Accessible to all authenticated users
router.put('/:id', auth, checkRole('organizer'), eventController.updateEvent);
router.delete('/:id', auth, checkRole('organizer'), eventController.deleteEvent);

// fixed attendee routes 
router.post('/:eventId/register', auth, checkRole('attendee'), eventController.registerforEvent);
router.post('/:eventId/unregister', auth, checkRole('attendee'), eventController.unregisterforEvent);

module.exports = router;
