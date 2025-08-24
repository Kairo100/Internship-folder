// src/config/index.ts
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'your_super_secret_jwt_key', // ALWAYS use a strong, env variable in production!
  databaseUrl: process.env.DATABASE_URL,
  nodeEnv: process.env.NODE_ENV || 'development',
};

// Basic validation for critical variables
if (!config.jwtSecret || config.jwtSecret === 'your_super_secret_jwt_key') {
  console.warn('WARNING: JWT_SECRET is not set or using default. Set it in your .env file!');
}
if (!config.databaseUrl) {
  console.error('ERROR: DATABASE_URL is not set in your .env file!');
  process.exit(1); // Exit if DB URL is missing
}