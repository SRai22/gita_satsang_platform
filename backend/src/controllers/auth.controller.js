const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

// Generate tokens
const generateTokens = (user) => {
  const token = user.getSignedJwtToken();
  const refreshToken = user.getRefreshToken();
  return { token, refreshToken };
};

// User registration
const register = async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: errors.array().reduce((acc, error) => {
            acc[error.path] = error.msg;
            return acc;
          }, {})
        }
      });
    }

    const { email, password, fullName, spiritualName, phone, introduction } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'USER_EXISTS',
          message: 'User with this email already exists'
        }
      });
    }

    // Create user
    const user = await User.create({
      email,
      passwordHash: password,
      fullName,
      spiritualName,
      phone,
      introduction,
      isApproved: false // Requires admin approval
    });

    logger.info(`New user registered: ${email}`);

    res.status(201).json({
      success: true,
      message: 'Registration submitted for approval. You will be notified once approved.',
      userId: user._id
    });

  } catch (error) {
    next(error);
  }
};

// User login
const login = async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: errors.array().reduce((acc, error) => {
            acc[error.path] = error.msg;
            return acc;
          }, {})
        }
      });
    }

    const { email, password } = req.body;

    // Check if user exists and select password
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'USER_INACTIVE',
          message: 'Your account has been deactivated'
        }
      });
    }

    // Generate tokens
    const { token, refreshToken } = generateTokens(user);

    // Update last active
    await user.updateLastActive();

    // Remove sensitive data
    user.passwordHash = undefined;

    logger.info(`User logged in: ${email}`);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        spiritualName: user.spiritualName,
        role: user.role,
        isApproved: user.isApproved,
        avatar: user.avatar,
        joinedAt: user.createdAt
      },
      token,
      refreshToken
    });

  } catch (error) {
    next(error);
  }
};

// Google OAuth login
const googleLogin = async (req, res, next) => {
  try {
    const { googleToken, userData } = req.body;

    // In a real implementation, you would verify the Google token
    // For now, we'll assume the token is valid and userData is provided

    let user = await User.findOne({ 
      $or: [
        { googleId: userData.googleId },
        { email: userData.email }
      ]
    });

    if (user) {
      // Update Google ID if not set
      if (!user.googleId && userData.googleId) {
        user.googleId = userData.googleId;
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        email: userData.email,
        fullName: userData.fullName,
        avatar: userData.avatar,
        googleId: userData.googleId,
        isEmailVerified: true,
        isApproved: false // Still requires approval
      });
    }

    // Generate tokens
    const { token, refreshToken } = generateTokens(user);

    // Update last active
    await user.updateLastActive();

    logger.info(`User logged in with Google: ${user.email}`);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        spiritualName: user.spiritualName,
        role: user.role,
        isApproved: user.isApproved,
        avatar: user.avatar,
        joinedAt: user.createdAt
      },
      token,
      refreshToken
    });

  } catch (error) {
    next(error);
  }
};

// Refresh token
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'REFRESH_TOKEN_REQUIRED',
          message: 'Refresh token is required'
        }
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_REFRESH_TOKEN',
          message: 'Invalid refresh token'
        }
      });
    }

    // Get user
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found or inactive'
        }
      });
    }

    // Generate new tokens
    const tokens = generateTokens(user);

    res.status(200).json({
      success: true,
      ...tokens
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_REFRESH_TOKEN',
          message: 'Invalid or expired refresh token'
        }
      });
    }
    next(error);
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// Logout (client-side token removal)
const logout = async (req, res) => {
  try {
    // In a more sophisticated implementation, you might:
    // 1. Blacklist the token
    // 2. Remove device tokens for push notifications
    // 3. Clear sessions

    logger.info(`User logged out: ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Forgot password
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'No user found with this email'
        }
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire time (10 minutes)
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    // In a real implementation, send email with reset link
    // const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    logger.info(`Password reset requested for: ${email}`);

    res.status(200).json({
      success: true,
      message: 'Password reset email sent'
    });

  } catch (error) {
    next(error);
  }
};

// Reset password
const resetPassword = async (req, res, next) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired reset token'
        }
      });
    }

    // Set new password
    user.passwordHash = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    // Generate tokens
    const { token, refreshToken } = generateTokens(user);

    logger.info(`Password reset successful for: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
      token,
      refreshToken
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  googleLogin,
  refreshToken,
  getProfile,
  logout,
  forgotPassword,
  resetPassword
};
