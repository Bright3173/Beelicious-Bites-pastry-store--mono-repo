const express = require('express');
const {
  registerUser,
  loginUser,
  meUser,
  refreshTokenHandler,
  logoutUser,
  forgotPassword,
  resetPassword,
  updateUser,
} = require('../controllers/user.controller.js');
const protect = require('../middleware/auth.js');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refreshTokenHandler);
router.post('/logout', logoutUser);
router.get('/me', protect, meUser);
router.put('/update/:id', protect, updateUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
