const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  googleLogin,
  refreshToken,
  getProfile,
  logout,
  forgotPassword,
  resetPassword
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('fullName')
    .isLength({ min: 2, max: 100 })
    .trim()
    .withMessage('Full name must be between 2 and 100 characters'),
  body('spiritualName')
    .optional()
    .isLength({ max: 100 })
    .trim()
    .withMessage('Spiritual name must not exceed 100 characters'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('introduction')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Introduction must not exceed 1000 characters')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const forgotPasswordValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
];

const resetPasswordValidation = [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

const refreshTokenValidation = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required')
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/google', googleLogin);
router.post('/refresh-token', refreshTokenValidation, refreshToken);
router.get('/profile', protect, getProfile);
router.post('/logout', protect, logout);
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);
router.put('/reset-password/:resettoken', resetPasswordValidation, resetPassword);

module.exports = router;
