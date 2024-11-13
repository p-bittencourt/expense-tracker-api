import { config } from 'dotenv';
config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI,
  CLIENT_ID: process.env.CLIENT_ID,
  ISSUER_BASE_URL: process.env.ISSUER_BASE_URL,
  SECRET: process.env.SECRET,
} as const;
