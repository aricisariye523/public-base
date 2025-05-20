const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { PrismaClient } = require('@prisma/client');

const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const borrowRoutes = require('./routes/borrowRoutes');

const app = express();
const prisma = new PrismaClient();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100 // IP başına limit
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(limiter);

// Routes
app.use('/auth', authRoutes);
app.use('/books', bookRoutes);
app.use('/borrow', borrowRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Bir şeyler yanlış gitti!' });
});

module.exports = app; 