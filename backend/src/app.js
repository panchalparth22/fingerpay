const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const bankRoutes = require('./routes/bankRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes with /api prefix
app.use('/api/user', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/bank', bankRoutes);

// Error handling middleware (should be last)
app.use(errorHandler);

module.exports = app;
