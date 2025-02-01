let Events = []; // In-memory database for events

const Event = {
  create: async (name, date, time, description, organizerId) => {
    try {
      const newEvent = {
        id: Events.length + 1,
        name,
        date,
        time,
        description,
        organizerId,
        participants: [],
      };

      Events.push(newEvent);
      console.log('Event Created:', newEvent);
      console.log('All Events:', Events);

      return Promise.resolve(newEvent);
    } catch (error) {
      console.error('Error creating event:', error.message);
      return Promise.reject(error);
    }
  },

  getAll: async () => {
    console.log('Fetching all events');
    return Promise.resolve(Events);
  },

  getById: async (id) => {
    const event = Events.find(event => event.id === id);
    console.log('Event Found:', event);
    return Promise.resolve(event || null);
  },

  update: async (id, name, date, time, description) => {
    const event = Events.find(event => event.id === id);
    if (!event) {
      console.log('Event not found:', id);
      return Promise.resolve(null);
    }

    event.name = name || event.name;
    event.date = date || event.date;
    event.time = time || event.time;
    event.description = description || event.description;

    console.log('Event Updated:', event);
    return Promise.resolve(event);
  },

  delete: async (id) => {
    const index = Events.findIndex(event => event.id === id);
    if (index === -1) {
      console.log('Event not found for deletion:', id);
      return Promise.resolve(null);
    }

    const deletedEvent = Events.splice(index, 1)[0];
    console.log('Event Deleted:', deletedEvent);
    console.log('Remaining Events:', Events);

    return Promise.resolve(deletedEvent);
  },

  addParticipant: (eventId, userId) => {
    eventId = Number(eventId); 
    userId = Number(userId); 
  
    console.log('Adding participant:', userId, 'to event:', eventId); 
    console.log('All events:', Events); 
  
    const event = Events.find(event => event.id === eventId);
    if (!event) {
      console.log('Event not found:', eventId); 
      return null;
    }
  
    if (!event.participants) {
      console.log('Initializing participants array for event:', event.id); 
      event.participants = [];
    }
  
    if (event.participants.includes(userId)) {
      console.log('User already registered:', userId); 
      return null;
    }
  
    event.participants.push(userId);
    console.log('User registered successfully:', userId); 
    console.log('Updated event:', event); 
    return event;
  },

  removeParticipant: async (eventId, userId) => {
    const event = Events.find(event => event.id === eventId);
    if (!event) {
      console.log('Event not found for unregistration:', eventId);
      return Promise.resolve(null);
    }

    event.participants = event.participants.filter(id => id !== userId);
    console.log('User Unregistered:', userId);
    return Promise.resolve(event);
  },
};

module.exports = Event;
