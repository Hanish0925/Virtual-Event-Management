const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

let users = []; 

const User = {
  create: async (username, email, password, role = 'attendee', preferences = []) => {
    try {
      if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('User with this email already exists.');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        id: users.length + 1,
        username,
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
        preferences,
      };

      users.push(newUser);
      console.log('User created:', newUser);
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw error;
    }
  },

  login: async (email, password) => {
    const user = users.find(user => user.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      console.log('User not found for login:', email);
      return null;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log('Invalid password for user:', email);
      return null;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );

    console.log('Login successful, token generated for user:', email);
    return token;
  },

  getUserByEmail: (email) => {
    const user = users.find(user => user.email.toLowerCase() === email.toLowerCase());
    console.log('User found by email:', user);
    return user;
  },

  getUserById: (id) => {
    const user = users.find(user => user.id === id);
    console.log('User found by ID:', user);
    return user;
  },

  updateUserPreferences: (email, preferences) => {
    if (!Array.isArray(preferences)) {
      throw new Error('Preferences must be an array');
    }

    const user = users.find(user => user.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      console.log('User not found for updating preferences:', email);
      return null;
    }

    user.preferences = preferences;
    console.log(`Updated preferences for ${email}:`, user.preferences);
    return user;
  },
};

module.exports = User; // Default export