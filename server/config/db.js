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

    const count = await User.countDocuments();
    if (count === 0) {
      console.log('Seeding initial system accounts & live metrics into active database...');

      const superPassword = await bcrypt.hash('admin123', 10);
      const adminPassword = await bcrypt.hash('admin123', 10);
      const receptionistPassword = await bcrypt.hash('receptionist123', 10);
      const employeePassword = await bcrypt.hash('employee123', 10);

      // Seed 4 active employees
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

      const emp3 = await Employee.create({
        name: 'Alex Johnson',
        email: 'alex.j@company.com',
        department: 'Operations',
        designation: 'Operations Lead',
        phone: '9876543212',
        status: 'active',
      });

      const emp4 = await Employee.create({
        name: 'Emily Davis',
        email: 'emily.d@company.com',
        department: 'Finance',
        designation: 'Financial Analyst',
        phone: '9876543213',
        status: 'active',
      });

      // Seed default user accounts
      const createdUsers = await User.create([
        { username: 'admin.visithub@gmail.com', password: superPassword, role: 'super_admin' },
        { username: 'admin', password: adminPassword, role: 'admin' },
        { username: 'receptionist', password: receptionistPassword, role: 'receptionist' },
        { username: 'employee', password: employeePassword, role: 'employee', employee_id: emp1._id },
      ]);

      const receptionistUser = createdUsers.find(u => u.role === 'receptionist');
      const adminUser = createdUsers.find(u => u.role === 'admin');

      // Today's date string ISO
      const todayStr = new Date().toISOString().split('T')[0];

      // Seed visitors across lifecycle states (Currently Inside, Pending Approval, Approved)
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
          host_employee_id: emp3._id,
          schedule_date: todayStr,
          expected_arrival_time: '14:00',
          status: 'approved',
          pass_code: 'VP-901827',
        },
      ]);

      // Seed Activity Logs
      const Activity = (await import('../models/Activity.js')).default;
      await Activity.create([
        { visitor_id: v1._id, action: 'created', performed_by: receptionistUser._id, remarks: 'Visitor pass registered by front desk' },
        { visitor_id: v1._id, action: 'approved', performed_by: adminUser._id, remarks: 'Host employee approved visit' },
        { visitor_id: v1._id, action: 'checked_in', performed_by: receptionistUser._id, remarks: 'Visitor physically checked in at reception' },
        { visitor_id: v2._id, action: 'created', performed_by: receptionistUser._id, remarks: 'Visitor pass registered by front desk' },
        { visitor_id: v3._id, action: 'created', performed_by: receptionistUser._id, remarks: 'Visitor pass registered by front desk' },
        { visitor_id: v3._id, action: 'approved', performed_by: adminUser._id, remarks: 'Host employee approved visit' },
      ]);

      console.log('✅ System accounts, live metrics & Activity history auto-seeded successfully!');
    }
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
