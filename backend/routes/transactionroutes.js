const express = require('express');
const router = express.Router();
const { deposit, withdraw, transfer, getTransactionHistory } = require('../controllers/transactioncontroller');
const { protect } = require('../middleware/auth');

router.use(protect); // All routes require auth

router.post('/deposit', deposit);
router.post('/withdraw', withdraw);
router.post('/transfer', transfer);
router.get('/history', getTransactionHistory);

module.exports = router;