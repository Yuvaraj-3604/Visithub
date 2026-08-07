import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

console.log('Testing connection to MongoDB Atlas...');
console.log('URI:', process.env.MONGODB_URI.replace(/:([^@]+)@/, ':****@'));

try {
  const conn = await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  console.log('✅ SUCCESS! Connected to MongoDB Atlas host:', conn.connection.host);
  process.exit(0);
} catch (err) {
  console.error('❌ CONNECTION FAILED:', err.message);
  process.exit(1);
}
