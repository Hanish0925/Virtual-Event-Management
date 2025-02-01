const Event = require('../models/events'); 
const { sendEmail } = require('../middleware/mailer');

const eventController = {
  
  createEvent: async (req, res) => {
    try {
      const { name, date, time, description } = req.body;
      const organizerId = req.user.id;

      if (!name || !date || !time || !description) {
        return res.status(400).json({ message: 'Validation Error', error: 'All fields are required' });
      }

      const event = await Event.create(name, date, time, description, organizerId);
      console.log('Event Created:', event);

      await sendEmail(req.user.email, 'Event Created Successfully', `Your event "${name}" has been successfully created on ${date} at ${time}.`);

      res.status(201).json({ message: 'Event created successfully', event });
    } catch (err) {
      console.error('Error creating event:', err.message);
      res.status(500).json({ message: 'Error creating event', error: err.message });
    }
  },

  getAllEvents: async (req, res) => {
    try {
      const events = await Event.getAll();
      res.status(200).json({ events });
    } catch (err) {
      console.error('Error fetching events:', err.message);
      res.status(500).json({ message: 'Error fetching events', error: err.message });
    }
  },

  getEventById: async (req, res) => {
    try {
      const event = await Event.getById(Number(req.params.id));
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.status(200).json({ event });
    } catch (err) {
      console.error('Error fetching event:', err.message);
      res.status(500).json({ message: 'Error fetching event', error: err.message });
    }
  },

  updateEvent: async (req, res) => {
    try {
      const event = await Event.update(Number(req.params.id), req.body.name, req.body.date, req.body.time, req.body.description);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.status(200).json({ message: 'Event updated successfully', event });
    } catch (err) {
      console.error('Error updating event:', err.message);
      res.status(500).json({ message: 'Error updating event', error: err.message });
    }
  },

  deleteEvent: async (req, res) => {
    try {
      const event = await Event.delete(Number(req.params.id));
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.status(200).json({ message: 'Event deleted successfully', event });
    } catch (err) {
      console.error('Error deleting event:', err.message);
      res.status(500).json({ message: 'Error deleting event', error: err.message });
    }
  },
  
  registerforEvent: async (req, res) => {
    const { eventId } = req.params; 
    const userId = req.user.id;

    console.log('Registering user:', userId, 'for event:', eventId); 
    
    try {
      console.log('Fetching all events for debugging:', await Event.getAll());

      const parsedEventId = parseInt(eventId, 10);
      if (isNaN(parsedEventId)) {
        return res.status(400).json({ message: 'Invalid event ID' });
      }
      const event = await Event.addParticipant(parsedEventId, userId);

      if (!event) {
        return res.status(404).json({ message: 'Event not found or User already registered' });
      }
      const emailSubject = 'Event Registration Confirmation';
      const emailText = `You have successfully registered for the event "${event.name}" on ${event.date} at ${event.time}.`;
      await sendEmail(req.user.email, emailSubject, emailText);

      res.status(200).json({ message: 'Registered for event', event });
    } catch (err) {
      console.error('Error registering for event:', err.message);
      res.status(500).json({ message: 'Error registering for event', error: err.message });
    }
  },

  unregisterforEvent: async (req, res) => {
    try {
      const eventId = Number(req.params.eventId);
      const userId = req.user.id;

      console.log('Unregistering user:', userId, 'from event:', eventId);

      const event = await Event.removeParticipant(eventId, userId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found or User not registered' });
      }

      console.log('User Unregistered:', userId, 'from event:', eventId);
      res.status(200).json({ message: 'Unregistered from event successfully', event });
    } catch (err) {
      console.error('Error unregistering for event:', err.message);
      res.status(500).json({ message: 'Error unregistering for event', error: err.message });
    }
  },
};

module.exports = eventController;
