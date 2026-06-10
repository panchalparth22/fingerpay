const express = require('express');
  const router = express.Router();
  const { getUsers, getUserWithTransactions } = require('../controllers/bankController');

  // GET /api/bank/users
  router.get('/', getUsers);

  // GET /api/bank/users/:id
  router.get('/:id', getUserWithTransactions);

  module.exports = router;