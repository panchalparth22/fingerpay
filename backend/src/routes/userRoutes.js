const express = require('express');
const router = express.Router();
const { createUser, loginUser } = require('../controllers/userController');

// POST /api/user/register
router.post('/register', createUser);
// POST /api/user/login
router.post('/login', loginUser);

module.exports = router;
