const User = require('../models/users'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const userController = {
  Signup: async (req, res) => {
    try {
      const { username, email, password, preferences = [], role = 'attendee' } = req.body;
      if (!['organizer', 'attendee'].includes(role)) {
        return res.status(400).json({ message: 'Validation Error', error: 'Invalid role' });
      }

      const newUser = await User.create(username, email, password, role, preferences);
      console.log('User Created:', newUser);

      res.status(201).json({
        message: 'User created successfully',
        user: { username, email, role, preferences },
      });
    } catch (err) {
      console.error('Error creating user:', err.message);
      res.status(500).json({ message: 'Error creating user', error: err.message });
    }
  },

 
  Login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Validation Error', error: 'Email and password are required' });
      }

      const user = await User.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'Validation Error', error: 'User not found' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Validation Error', error: 'Invalid password' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      console.log('User Logged In:', user.email);
      res.status(200).json({ token });
    } catch (err) {
      console.error('Error logging in:', err.message);
      res.status(500).json({ message: 'Error logging in', error: err.message });
    }
  },


  GetUserPreferences: async (req, res) => {
    try {
      console.log('🔍 Request User:', req.user);

      const user = await User.getUserByEmail(req.user.email);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ preferences: user.preferences });
    } catch (err) {
      console.error('Error fetching user preferences:', err.message);
      res.status(500).json({ message: 'Error fetching user preferences', error: err.message });
    }
  },

 
  updateUserPreferences: async (req, res) => {
    try {
      const { preferences } = req.body;

      if (!Array.isArray(preferences) || preferences.length === 0) {
        return res.status(400).json({ message: 'Validation Error', error: 'Preferences must be a non-empty array' });
      }

      console.log('Authenticated User:', req.user);

      const user = await User.updateUserPreferences(req.user.email, preferences);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      console.log(`Updated preferences for ${user.email}:`, user.preferences);
      res.status(200).json({
        message: 'Preferences updated successfully',
        preferences: user.preferences,
      });
    } catch (err) {
      console.error('Error updating user preferences:', err.message);
      res.status(500).json({ message: 'Error updating user preferences', error: err.message });
    }
  },
};

module.exports = userController;