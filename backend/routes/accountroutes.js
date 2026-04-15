const express = require('express');
const router = express.Router();
const { getAccounts, getAccount, createAccount } = require('../controllers/accountcontroller');
const { protect } = require('../middleware/auth');

router.use(protect); // All routes require auth

router.route('/').get(getAccounts).post(createAccount);
router.route('/:id').get(getAccount);

module.exports = router;