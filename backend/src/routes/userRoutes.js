const express = require('express');
const router = express.Router();
const { createUser } = require('../controllers/userController');

// POST /api/user/register
router.post('/register', createUser);

module.exports = router;
