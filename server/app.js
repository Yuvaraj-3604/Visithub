import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import middlewares
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import visitorRoutes from './routes/visitorRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import supportRoutes from './routes/supportRoutes.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
import mongoose from 'mongoose';



if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Routes API Mapping
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/support', supportRoutes);

// Root test endpoint
app.get('/', (req, res) => {
  res.json({ message: 'VisitHub API is running...' });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
