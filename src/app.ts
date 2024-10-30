import express from 'express';
import { config } from 'dotenv';
import { errorHandler } from './middleware/error.middleware';

// Environment variables
config();

const app = express();

// Middleware
app.use(express.json());

// Dependencies

// Routes

// Error Handler
app.use(errorHandler);

export default app;
