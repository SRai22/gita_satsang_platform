const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(err.stack);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message,
      }
    };
    return res.status(404).json(error);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    error = {
      success: false,
      error: {
        code: 'DUPLICATE_FIELD',
        message,
        field
      }
    };
    return res.status(400).json(error);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = {};
    Object.values(err.errors).forEach(error => {
      errors[error.path] = error.message;
    });
    
    error = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: errors
      }
    };
    return res.status(400).json(error);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = {
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid token'
      }
    };
    return res.status(401).json(error);
  }

  if (err.name === 'TokenExpiredError') {
    error = {
      success: false,
      error: {
        code: 'TOKEN_EXPIRED',
        message: 'Token expired'
      }
    };
    return res.status(401).json(error);
  }

  // Custom application errors
  if (err.isOperational) {
    return res.status(err.statusCode || 500).json({
      success: false,
      error: {
        code: err.code || 'SERVER_ERROR',
        message: err.message
      }
    });
  }

  // Default server error
  res.status(500).json({
    success: false,
    error: {
      code: 'SERVER_ERROR',
      message: 'Internal server error'
    }
  });
};

module.exports = errorHandler;
