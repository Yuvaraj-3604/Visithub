import app from '../app.js';
import { connectDB } from '../config/db.js';

export default async function handler(req, res) {
  // Ensure database connection is active before handling serverless request
  await connectDB();
  return app(req, res);
}
