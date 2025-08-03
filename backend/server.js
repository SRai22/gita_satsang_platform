require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');
const logger = require('./src/utils/logger');
const { connectRedis } = require('./src/config/redis');

const PORT = process.env.PORT || 5000;

// Connect to databases
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Connect to Redis
    await connectRedis();

    // Start server
    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received. Shutting down gracefully');
      server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT received. Shutting down gracefully');
      server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    
    // In development, start server anyway for API testing
    if (process.env.NODE_ENV === 'development') {
      logger.info('Starting server in development mode without full database connectivity...');
      
      const server = app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode (limited functionality)`);
      });
      
      return;
    }
    
    process.exit(1);
  }
};

startServer();
