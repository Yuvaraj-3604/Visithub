import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const updateSuperAdmin = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB.');

    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Update existing superadmin or create admin.visithub@gmail.com
    await User.deleteMany({ role: 'super_admin' });
    await User.create({
      username: 'admin.visithub@gmail.com',
      password: hashedPassword,
      role: 'super_admin'
    });

    console.log('✅ Super Admin credentials updated successfully!');
    console.log('Username / Email: admin.visithub@gmail.com');
    console.log('Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('Error updating Super Admin credentials:', error.message);
    process.exit(1);
  }
};

updateSuperAdmin();
