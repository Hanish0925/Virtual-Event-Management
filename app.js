require('dotenv').config();
const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');

app.use(express.json());

app.use('/users', userRoutes);

app.use('/events', eventRoutes);

app.listen(process.env.PORT || 3000, (err) => {
  if (err) {
    return console.log('Error starting server');
  }
  console.log(`Server is running on ${process.env.PORT || 3000}`);
});