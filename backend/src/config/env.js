import dotenv from 'dotenv';

dotenv.config();

/**
 * Validates that all required environment variables are present.
 * Fails fast at startup instead of crashing at runtime.
 */
const requiredVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
];

const missing = requiredVars.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`❌ Missing required environment variables:\n   ${missing.join(', ')}`);
  process.exit(1);
}

const env = Object.freeze({
  PORT: parseInt(process.env.PORT, 10) || 4000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173', // supports comma-separated origins
});

export default env;
