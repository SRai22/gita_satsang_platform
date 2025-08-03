const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token;

  // Check for token in header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Not authorized to access this route'
      }
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await User.findById(decoded.id).select('-passwordHash');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'USER_INACTIVE',
          message: 'User account is inactive'
        }
      });
    }

    // Update last active
    user.updateLastActive();

    req.user = user;
    next();
  } catch (error) {
    logger.error('JWT verification error:', error);
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Not authorized to access this route'
      }
    });
  }
};

// Check if user is approved
const requireApproval = (req, res, next) => {
  if (!req.user.isApproved) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'USER_NOT_APPROVED',
        message: 'Your account is pending approval'
      }
    });
  }
  next();
};

// Role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: `Role ${req.user.role} is not authorized to access this route`
        }
      });
    }
    next();
  };
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-passwordHash');
      
      if (user && user.isActive) {
        req.user = user;
        user.updateLastActive();
      }
    } catch (error) {
      // Silently ignore authentication errors for optional auth
      logger.debug('Optional auth failed:', error.message);
    }
  }

  next();
};

module.exports = {
  protect,
  requireApproval,
  authorize,
  optionalAuth
};
