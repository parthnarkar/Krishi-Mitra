const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const router = express.Router();

// POST /api/auth/register to register a user
router.post('/register', registerUser);

// POST /api/auth/login to login a user
router.post('/login', loginUser);

module.exports = router;
