const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = require('./app');

const PORT = process.env.PORT || 5000;

const getRequiredEnv = (name) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
};

async function createDefaultAdmin() {
  try {
    const User = require('./models/User');

    const username = process.env.ADMIN_USERNAME || getRequiredEnv('ADMIN_EMAIL');
    const email = getRequiredEnv('ADMIN_EMAIL');
    const password = getRequiredEnv('ADMIN_PASSWORD');

    const adminExists = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (!adminExists) {
      const admin = new User({
        username,
        email,
        password,
        role: 'admin'
      });

      await admin.save();
      console.log('Default admin user created');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
    throw error;
  }
}

async function startServer() {
  try {
    getRequiredEnv('MONGODB_URI');
    getRequiredEnv('JWT_SECRET');
    getRequiredEnv('ADMIN_EMAIL');
    getRequiredEnv('ADMIN_PASSWORD');

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    await createDefaultAdmin();

    app.listen(PORT, '127.0.0.1', () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = {
  app,
  createDefaultAdmin,
  startServer
};
