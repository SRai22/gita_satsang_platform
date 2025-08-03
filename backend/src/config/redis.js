const redis = require('redis');
const logger = require('../utils/logger');

let redisClient;

const connectRedis = async () => {
  try {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL
    });

    redisClient.on('error', (error) => {
      logger.error('Redis Client Error:', error);
    });

    redisClient.on('connect', () => {
      logger.info('Redis Client Connected');
    });

    redisClient.on('ready', () => {
      logger.info('Redis Client Ready');
    });

    redisClient.on('end', () => {
      logger.warn('Redis Client Disconnected');
    });

    await redisClient.connect();
    
    return redisClient;
  } catch (error) {
    logger.error('Redis connection failed:', error);
    logger.warn('Starting server without Redis connection...');
    // Don't throw in development mode
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
  }
};

const getRedisClient = () => {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call connectRedis() first.');
  }
  return redisClient;
};

const closeRedisConnection = async () => {
  if (redisClient) {
    await redisClient.quit();
    logger.info('Redis connection closed');
  }
};

module.exports = {
  connectRedis,
  getRedisClient,
  closeRedisConnection
};
