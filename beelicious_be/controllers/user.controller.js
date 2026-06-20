const User = require('../models/user.model.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendEmail } = require('../utils/sendEmail.js');
const crypto = require('crypto');

// Register
const registerUser = async (req, res) => {
  const { username, email, phoneNumber, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please enter a valid field' });
  }

  const userExist = await User.findOne({ email });
  if (userExist) {
    return res.status(409).json({ message: 'User already exists' });
  }
  try {
    // encrypted password
    const hashedPwd = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      phoneNumber,
      password: hashedPwd,
    });

    const token = generateAccessToken(user);

    res.status(201).json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      accessToken: token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter a valid field' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }

    const match = await bcrypt.compare(password, user.password);

    if (match) {
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      user.refreshToken = refreshToken;

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      await user.save();

      res.status(200).json({
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        accessToken,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout User

const logoutUser = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (token) {
    await User.findOneAndUpdate({ refreshToken: token }, { refreshToken: null });
  }

  res.clearCookie('refreshToken');

  res.json({ message: 'Logged out successfully' });
};

// Get User by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select(
      '-password -refreshToken -resetPasswordOTP -resetPasswordExpire -otpAttempts',
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update User

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ messsage: 'User not found' });
    }
    res.status(200).json({ message: 'Profile updated successfully!', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// forgot-password

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Generate 5-digit OTP
  const otp = Math.floor(10000 + Math.random() * 90000).toString();

  // Hash OTP
  const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');

  user.resetPasswordOTP = hashedOTP;

  user.resetPasswordExpire = Date.now() + 5 * 60 * 1000; // 5 mins
  user.otpAttempts = 0;

  await user.save();

  // Send email
  const message = `
    <h2>Password Reset Code</h2>
    <p>Hello ${user.username}, Your OTP is:</p>
    <h1>${otp}</h1>
    <p>This code expires in 5 minutes</p>
  `;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Password Reset OTP',
      html: message,
    });

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (err) {
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(500).json({ message: err.message || 'Email failed' });
  }
};

// Forgot Password OTP

const resetPassword = async (req, res) => {
  const { email, otp, password } = req.body;

  console.log('Body: ', req.body);
  if (!email || !otp || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const user = await User.findOne({ email });
  console.log('user:', user);
  console.log('6th user.resetPasswordOTP: ', user.resetPasswordOTP);
  if (!user) {
    return res.status(404).json({ message: 'If the email exists, an OTP has been sent' });
  }

  // Brute-force protection
  if (user.otpAttempts >= 5) {
    return res.status(429).json({ message: 'Too many attempts' });
  }

  // Hash OTP
  const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');
  console.log('Hashed otp: ', hashedOTP);
  console.log('user.resetPasswordOTP: ', user.resetPasswordOTP);
  const isValid = user.resetPasswordOTP === hashedOTP && user.resetPasswordExpire > Date.now();

  if (!isValid) {
    user.otpAttempts += 1;
    await user.save();

    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  // Update password
  user.password = await bcrypt.hash(password, 10);

  // Clear OTP data
  user.resetPasswordOTP = undefined;
  user.resetPasswordExpire = undefined;
  user.otpAttempts = 0;

  await user.save();

  res.status(200).json({ message: 'Password reset successful' });
};

// Owner
const meUser = async (req, res) => {
  res.status(200).json(req.user);
};

const refreshTokenHandler = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: 'No refresh token' });
  }

  const user = await User.findOne({ refreshToken: token });
  if (!user) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err) => {
    if (err) {
      return res.status(403).json({ message: 'Token has expired.' });
    }

    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
  });
};

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '15m',
    },
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
};

module.exports = {
  registerUser,
  loginUser,
  meUser,
  refreshTokenHandler,
  logoutUser,
  forgotPassword,
  resetPassword,
  updateUser,
  getUserById,
};
