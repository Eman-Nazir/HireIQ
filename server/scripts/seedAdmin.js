

import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../src/models/User.js';

const seedAdmin = async () => {
  try {
    if (!process.env.SEED_ADMIN_EMAIL || !process.env.SEED_ADMIN_PASSWORD) {
      console.error(' SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set in .env');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const existing = await User.findOne({ email: process.env.SEED_ADMIN_EMAIL });

    if (existing) {
      if (existing.role === 'admin') {
         existing.role = 'admin';
  existing.isProtected = true;
  await existing.save();
        console.log('ℹ  This user is already an admin. Nothing to do.');
      } else {
        existing.role = 'admin';
        await existing.save();
        console.log(` Promoted existing user (${existing.email}) to admin`);
      }
    } else {
      const admin = await User.create({
  name: process.env.SEED_ADMIN_NAME || 'Admin',
  email: process.env.SEED_ADMIN_EMAIL,
  password: process.env.SEED_ADMIN_PASSWORD,
  role: 'admin',
  authProvider: 'local',
  isProtected: true,
});
      console.log(` Admin account created: ${admin.email}`);
    }
  } catch (error) {
    console.error(' Seeding failed:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedAdmin();