// backend/server.js
// Basic Express server + Mongo connection starter

require('dotenv').config();                 // load .env values
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
// add near the middleware section, before routes or after app.use(cors...)


// Middleware
app.use(express.json()); // parse JSON bodies
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000', // allow requests from your frontend
  credentials: true                // allow cookies to be sent
}));

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks'); // we will create tasks routes next


// Health-check route
app.get('/', (req, res) => {
  res.json({ ok: true, msg: 'API running' });
});

// mount routes under /api
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);


// Read environment variables
const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fullstack_app';

// Connect to MongoDB and start server
// Connect to MongoDB and start server
mongoose.connect(MONGO)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message || err);
    // Start the server anyway so you can develop without DB for now
    app.listen(PORT, () => console.log(`Server running on port ${PORT} (DB not connected)`));
  });
