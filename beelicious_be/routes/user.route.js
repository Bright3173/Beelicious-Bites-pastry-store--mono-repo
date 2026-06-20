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
  getUserById,
} = require('../controllers/user.controller.js');
const protect = require('../middleware/auth.js');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refreshTokenHandler);
router.post('/logout', logoutUser);
router.get('/auth/me', protect, meUser);
router.put('/update/:id', protect, updateUser);
router.post('/reset-password', resetPassword);
router.get('/:id', getUserById);
router.post('/forgot-password', forgotPassword);

module.exports = router;
