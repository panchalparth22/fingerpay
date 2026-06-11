const express = require('express');
const router = express.Router();
const { createUser, loginUser } = require('../controllers/userController');
const {protect} = require("../middleware/authMiddleware");
const {saveCardDetails} = require("../controllers/cardController");

// POST /api/user/register
router.post('/register', createUser);
// POST /api/user/login
router.post('/login', loginUser);

router.post("/me/card", protect, saveCardDetails);


module.exports = router;
