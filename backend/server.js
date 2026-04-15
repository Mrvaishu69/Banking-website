const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Welcome Route
app.get('/', (req, res) => {
  res.json({ 
    message: '🏦 Welcome to Great Vaishu Bank API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      accounts: '/api/accounts',
      transactions: '/api/transactions'
    }
  });
});

// Routes
app.use('/api/auth', require('./routes/authroutes'));
app.use('/api/accounts', require('./routes/accountroutes'));
app.use('/api/transactions', require('./routes/transactionroutes'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Internal Server Error', 
    error: err.message 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🏦 Great Vaishu Bank server running on port ${PORT}`);
});