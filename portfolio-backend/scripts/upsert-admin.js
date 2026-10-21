const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const { validatePassword } = require('../src/modules/auth/auth.validation');

dotenv.config();

const requiredEnv = ['MONGODB_URI', 'ADMIN_EMAIL', 'ADMIN_PASSWORD'];

const getRequiredEnv = (name) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
};

const upsertAdmin = async () => {
  requiredEnv.forEach(getRequiredEnv);

  const email = process.env.ADMIN_EMAIL.toLowerCase();
  const username = process.env.ADMIN_USERNAME || email;
  const password = validatePassword(process.env.ADMIN_PASSWORD, 'ADMIN_PASSWORD');

  await mongoose.connect(process.env.MONGODB_URI);

  const existingAdmin = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingAdmin) {
    existingAdmin.username = username;
    existingAdmin.email = email;
    existingAdmin.password = password;
    existingAdmin.role = 'admin';
    existingAdmin.active = true;

    await existingAdmin.save();

    console.log(`Admin updated: ${email}`);
    return;
  }

  const admin = new User({
    username,
    email,
    password,
    role: 'admin',
    active: true
  });

  await admin.save();

  console.log(`Admin created: ${email}`);
};

upsertAdmin()
  .then(async () => {
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('Could not create/update admin:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  });
