const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config/env');

// Routes
const healthRoutes = require('./interfaces/http/routes/healthRoutes');
const movieRoutes = require('./interfaces/http/routes/movieRoutes');
const showtimeRoutes = require('./interfaces/http/routes/showtimeRoutes');
const seatRoutes = require('./interfaces/http/routes/seatRoutes');
const snackRoutes = require('./interfaces/http/routes/snackRoutes');
const bookingRoutes = require('./interfaces/http/routes/bookingRoutes');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true
}));

// Request parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (config.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/showtimes', showtimeRoutes);
app.use('/api/seats', seatRoutes);
app.use('/api/snacks', snackRoutes);
app.use('/api/bookings', bookingRoutes);

// Global 404 handler (Express 5.x compatible)
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: config.NODE_ENV === 'production' ? 'Internal server error' : err.message 
  });
});

module.exports = app;