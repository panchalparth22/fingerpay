const express = require('express');
const router = express.Router();
const { createUser } = require('../controllers/userController');

// POST /api/users
router.post('/', createUser);

module.exports = router;
