import app from './app.js';
import { connectDB } from './config/db.js';

// Connect Database
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err, promise) => {
  console.error(`Logged Error: ${err.message}`);
  server.close(() => process.exit(1));
});
