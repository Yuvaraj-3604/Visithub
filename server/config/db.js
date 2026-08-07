import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const dbURI = process.env.MONGODB_URI;

let isConnecting = false;

let isSeeded = false;

// Auto-seed initial demo accounts into the database
const autoSeed = async () => {
  if (isSeeded) return;
  try {
    const User = (await import('../models/User.js')).default;
    const Employee = (await import('../models/Employee.js')).default;

    const count = await User.countDocuments();
    if (count === 0) {
      console.log('Seeding initial system accounts into database...');
      const superPassword = await bcrypt.hash('admin123', 10);
      const adminPassword = await bcrypt.hash('admin123', 10);
      const receptionistPassword = await bcrypt.hash('receptionist123', 10);
      const employeePassword = await bcrypt.hash('employee123', 10);

      const emp1 = await Employee.create({
        name: 'John Doe',
        email: 'john@company.com',
        department: 'Engineering',
        designation: 'Senior Developer',
        phone: '9876543210',
        status: 'active',
      });

      const emp2 = await Employee.create({
        name: 'Sarah Smith',
        email: 'sarah.smith@company.com',
        department: 'Human Resources',
        designation: 'HR Manager',
        phone: '9876543211',
        status: 'active',
      });

      await User.create([
        { username: 'admin.visithub@gmail.com', password: superPassword, role: 'super_admin' },
        { username: 'admin', password: adminPassword, role: 'admin' },
        { username: 'receptionist', password: receptionistPassword, role: 'receptionist' },
        { username: 'employee', password: employeePassword, role: 'employee', employee_id: emp1._id },
        { username: 'employee2', password: employeePassword, role: 'employee', employee_id: emp2._id },
      ]);
    }
    isSeeded = true;
  } catch (err) {
    console.error('Auto-seed check warning:', err.message);
  }
};

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return true;
  }
  
  if (connectionPromise) {
    await connectionPromise;
    return mongoose.connection.readyState === 1;
  }

  connectionPromise = (async () => {
    // 1. Try connecting to MongoDB Atlas URI
    try {
      if (dbURI) {
        console.log('Attempting connection to Primary MongoDB Atlas Cluster...');
        const conn = await mongoose.connect(dbURI, {
          serverSelectionTimeoutMS: 5000,
          connectTimeoutMS: 5000,
        });
        console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
        await autoSeed();
        return;
      }
    } catch (error) {
      console.warn(`MongoDB Atlas Unavailable (${error.message}).`);
    }

    // 2. Fallback to In-Memory MongoMemoryServer if Atlas is unreachable and not in Vercel serverless environment
    if (process.env.VERCEL) {
      console.error('MongoDB connection failed on Vercel.');
      return;
    }

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      
      const conn = await mongoose.connect(mongoUri);
      console.log(`🚀 In-Memory Local Database Connected: ${conn.connection.host}`);
      await autoSeed();
    } catch (err) {
      console.error(`In-Memory DB Fallback Error: ${err.message}`);
    }
  })();

  try {
    await connectionPromise;
  } finally {
    connectionPromise = null;
  }

  return mongoose.connection.readyState === 1;
};

export default connectDB;
