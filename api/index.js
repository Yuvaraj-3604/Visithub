import app from '../server/app.js';
import { connectDB } from '../server/config/db.js';

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    console.error('DB connect error in serverless handler:', err.message);
  }
  return app(req, res);
}
