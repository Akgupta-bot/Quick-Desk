const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);

// Admin only
router.get('/', userController.protect, userController.restrictTo('Admin'), userController.getAllUsers);

module.exports = router;
