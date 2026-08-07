import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import Employee from './models/Employee.js';
import User from './models/User.js';
import Visitor from './models/Visitor.js';
import Activity from './models/Activity.js';

dotenv.config();

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('Connected to MongoDB.');

    console.log('Clearing database collections...');
    await Activity.deleteMany({});
    await Visitor.deleteMany({});
    await User.deleteMany({});
    await Employee.deleteMany({});
    console.log('Database collections cleared.');

    console.log('Seeding employees...');
    const employees = await Employee.create([
      {
        name: 'John Doe',
        email: 'john@company.com',
        department: 'Engineering',
        designation: 'Senior Developer',
        phone: '9876543210',
        status: 'active',
      },
      {
        name: 'Sarah Smith',
        email: 'sarah@company.com',
        department: 'Human Resources',
        designation: 'HR Manager',
        phone: '8765432109',
        status: 'active',
      },
    ]);
    console.log('Employees seeded successfully.');

    const john = employees.find((e) => e.name === 'John Doe');
    const sarah = employees.find((e) => e.name === 'Sarah Smith');

    console.log('Seeding users...');
    const superPassword = await bcrypt.hash('admin123', 10);
    const adminPassword = await bcrypt.hash('admin123', 10);
    const receptionistPassword = await bcrypt.hash('receptionist123', 10);
    const employeePassword = await bcrypt.hash('employee123', 10);

    const users = await User.create([
      {
        username: 'admin',
        password: adminPassword,
        role: 'admin',
      },
      {
        username: 'receptionist',
        password: receptionistPassword,
        role: 'receptionist',
      },
      {
        username: 'employee',
        password: employeePassword,
        role: 'employee',
        employee_id: john._id,
      },
      {
        username: 'employee2',
        password: employeePassword,
        role: 'employee',
        employee_id: sarah._id,
      },
      {
        username: 'admin.visithub@gmail.com',
        password: superPassword,
        role: 'super_admin',
      },
    ]);

    console.log('User accounts seeded successfully!');
    
    console.log('----------------------------------------------------');
    console.log('Credentials list:');
    console.log('1. Super Admin: username="admin.visithub@gmail.com", password="admin123"');
    console.log('2. Admin: username="admin", password="admin123"');
    console.log('3. Receptionist: username="receptionist", password="receptionist123"');
    console.log('4. Employee: username="employee", password="employee123"');
    console.log('5. Employee 2: username="employee2", password="employee123"');
    console.log('----------------------------------------------------');

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding data in MongoDB: ${error.message}`);
    process.exit(1);
  }
};

seedData();
