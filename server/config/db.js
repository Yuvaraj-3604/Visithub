import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const dbURI = process.env.MONGODB_URI;

let isConnecting = false;

let isSeeded = false;

// Auto-seed initial demo accounts into the database if missing
const autoSeed = async () => {
  if (isSeeded) return;
  try {
    const User = (await import('../models/User.js')).default;
    const Employee = (await import('../models/Employee.js')).default;

    // 1. Ensure default employee host profiles exist
    let emp1 = await Employee.findOne({ email: 'john@company.com' });
    if (!emp1) {
      emp1 = await Employee.create({
        name: 'John Doe',
        email: 'john@company.com',
        department: 'Engineering',
        designation: 'Senior Developer',
        phone: '9876543210',
        status: 'active',
      });
    }

    let emp2 = await Employee.findOne({ email: 'sarah.smith@company.com' });
    if (!emp2) {
      emp2 = await Employee.create({
        name: 'Sarah Smith',
        email: 'sarah.smith@company.com',
        department: 'Human Resources',
        designation: 'HR Manager',
        phone: '9876543211',
        status: 'active',
      });
    }

    // 2. Ensure each pre-seeded test account exists
    const demoAccounts = [
      { username: 'admin.visithub@gmail.com', password: 'admin123', role: 'super_admin' },
      { username: 'admin', password: 'admin123', role: 'admin' },
      { username: 'receptionist', password: 'receptionist123', role: 'receptionist' },
      { username: 'employee', password: 'employee123', role: 'employee', empId: emp1._id },
      { username: 'employee2', password: 'employee123', role: 'employee', empId: emp2._id },
    ];

    for (const acc of demoAccounts) {
      const existing = await User.findOne({ username: acc.username });
      if (!existing) {
        const hashedPassword = await bcrypt.hash(acc.password, 10);
        await User.create({
          username: acc.username,
          password: hashedPassword,
          role: acc.role,
          employee_id: acc.empId || null,
        });
      }
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
