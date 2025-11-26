const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { sequelize } = require('./models');

// Import routes
const authRoutes = require('./routes/auth');
const sectionRoutes = require('./routes/sections');
const studentRoutes = require('./routes/students');
const taskRoutes = require('./routes/tasks');
const progressRoutes = require('./routes/progress');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/progress', progressRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Sectra Backend API');
});

// Sync database and start server
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Failed to sync database:', error);
  });
