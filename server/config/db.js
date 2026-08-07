import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Disable command buffering so Mongoose never hangs on queries
mongoose.set('bufferCommands', false);

const dbURI = process.env.MONGODB_URI;

let isConnecting = false;

// Auto-seed initial demo accounts into the database
const autoSeed = async () => {
  try {
    const User = (await import('../models/User.js')).default;
    const Employee = (await import('../models/Employee.js')).default;
    const Visitor = (await import('../models/Visitor.js')).default;

    const superPassword = await bcrypt.hash('admin123', 10);
    const adminPassword = await bcrypt.hash('admin123', 10);
    const receptionistPassword = await bcrypt.hash('receptionist123', 10);
    const employeePassword = await bcrypt.hash('employee123', 10);

    // 1. Ensure employee host profiles exist
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

    // 2. Guarantee all pre-seeded test accounts exist and have exact official passwords
    const demoAccounts = [
      { username: 'admin.visithub@gmail.com', passwordHash: superPassword, role: 'super_admin' },
      { username: 'admin', passwordHash: adminPassword, role: 'admin' },
      { username: 'receptionist', passwordHash: receptionistPassword, role: 'receptionist' },
      { username: 'employee', passwordHash: employeePassword, role: 'employee', employeeId: emp1._id },
      { username: 'employee2', passwordHash: employeePassword, role: 'employee', employeeId: emp2._id },
    ];

    for (const acc of demoAccounts) {
      const existing = await User.findOne({ username: acc.username });
      if (!existing) {
        await User.create({
          username: acc.username,
          password: acc.passwordHash,
          role: acc.role,
          employee_id: acc.employeeId || null,
        });
      } else {
        // Refresh password hash to ensure credentials ALWAYS match
        existing.password = acc.passwordHash;
        if (acc.employeeId && !existing.employee_id) {
          existing.employee_id = acc.employeeId;
        }
        await existing.save();
      }
    }

    // Check if initial visitor demo metrics exist
    const visitorCount = await Visitor.countDocuments();
    if (visitorCount === 0) {
      const receptionistUser = await User.findOne({ role: 'receptionist' });
      const adminUser = await User.findOne({ role: 'admin' });
      const todayStr = new Date().toISOString().split('T')[0];

      const [v1, v2, v3] = await Visitor.create([
        {
          name: 'Robert Miller',
          email: 'robert.m@client.com',
          phone: '9888811111',
          organization: 'Apex Solutions',
          purpose: 'Technical Discussion',
          host_employee_id: emp1._id,
          schedule_date: todayStr,
          expected_arrival_time: '10:00',
          status: 'checked_in',
          check_in_time: new Date(),
          pass_code: 'VP-102938',
        },
        {
          name: 'Michael Chang',
          email: 'm.chang@techcorp.com',
          phone: '9888822222',
          organization: 'TechCorp Ltd',
          purpose: 'Vendor Interview',
          host_employee_id: emp2._id,
          schedule_date: todayStr,
          expected_arrival_time: '11:30',
          status: 'pending',
          pass_code: 'VP-482910',
        },
        {
          name: 'Sophia Williams',
          email: 'sophia@designstudio.com',
          phone: '9888833333',
          organization: 'DesignStudio Inc',
          purpose: 'Client Consultation',
          host_employee_id: emp1._id,
          schedule_date: todayStr,
          expected_arrival_time: '14:00',
          status: 'approved',
          pass_code: 'VP-901827',
        },
      ]);

      const Activity = (await import('../models/Activity.js')).default;
      await Activity.create([
        { visitor_id: v1._id, action: 'created', performed_by: receptionistUser?._id, remarks: 'Visitor pass registered by front desk' },
        { visitor_id: v1._id, action: 'approved', performed_by: adminUser?._id, remarks: 'Host employee approved visit' },
        { visitor_id: v1._id, action: 'checked_in', performed_by: receptionistUser?._id, remarks: 'Visitor physically checked in at reception' },
        { visitor_id: v2._id, action: 'created', performed_by: receptionistUser?._id, remarks: 'Visitor pass registered by front desk' },
        { visitor_id: v3._id, action: 'created', performed_by: receptionistUser?._id, remarks: 'Visitor pass registered by front desk' },
        { visitor_id: v3._id, action: 'approved', performed_by: adminUser?._id, remarks: 'Host employee approved visit' },
      ]);
    }

    console.log('✅ Demo test accounts (admin, receptionist, employee, employee2) verified & active!');
  } catch (err) {
    console.error('Auto-seed warning:', err.message);
  }
};

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  
  if (isConnecting) return;
  isConnecting = true;

  // 1. Try connecting to MongoDB Atlas URI
  try {
    console.log('Attempting connection to Primary MongoDB Atlas Cluster...');
    const conn = await mongoose.connect(dbURI, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
    });
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    await autoSeed();
    isConnecting = false;
    return;
  } catch (error) {
    console.warn(`MongoDB Atlas Unavailable (${error.message}). Switching to In-Memory Local Database...`);
  }

  // 2. Fallback to In-Memory MongoMemoryServer if Atlas is unreachable and not in Vercel serverless environment
  if (process.env.VERCEL) {
    console.error('MongoDB connection failed on Vercel. Ensure MONGODB_URI is configured in Vercel Environment Variables.');
    isConnecting = false;
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
  } finally {
    isConnecting = false;
  }
};

export default connectDB;
