const Account = require('../models/account');

// @desc    Get all accounts for logged-in user
// @route   GET /api/accounts
exports.getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ user: req.user._id });
    
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    res.json({
      success: true,
      data: {
        accounts,
        totalBalance,
        totalAccounts: accounts.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single account details
// @route   GET /api/accounts/:id
exports.getAccount = async (req, res) => {
  try {
    const account = await Account.findOne({ _id: req.params.id, user: req.user._id });

    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    res.json({ success: true, data: account });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new account
// @route   POST /api/accounts
exports.createAccount = async (req, res) => {
  try {
    const { accountType } = req.body;
    const accountNumber = Account.generateAccountNumber();

    const account = await Account.create({
      user: req.user._id,
      accountNumber,
      accountType: accountType || 'savings',
      balance: 0
    });

    res.status(201).json({
      success: true,
      message: 'New account created successfully!',
      data: account
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};