import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

const requiredEnvVars = [
  'MONGO_URI',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_EXPIRES_IN',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GEMINI_API_KEY',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'CLIENT_URL',
];

const missing = requiredEnvVars.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(' Missing required environment variables:');
  missing.forEach((key) => console.error(`   - ${key}`));
  console.error('\nCheck your .env file against .env.example and try again.');
  process.exit(1); 
}

connectDB().then(() => {
  app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
});