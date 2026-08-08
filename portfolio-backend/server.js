const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173'
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(
  '/uploads',
  express.static(uploadsDir, {
    maxAge: '7d',
    etag: true
  })
);

const portfolioRoutes = require('./routes/portfolio');
const uploadRoutes = require('./routes/upload');
const authRoutes = require('./routes/auth');

app.use('/api/portfolio', portfolioRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, service: 'portfolio-api' });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');
    await createDefaultAdmin();
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
  });

async function createDefaultAdmin() {
  try {
    const User = require('./models/User');

    const adminExists = await User.findOne({
      username: process.env.ADMIN_USERNAME || 'admin'
    });

    if (!adminExists) {
      const admin = new User({
        username: process.env.ADMIN_USERNAME || 'admin',
        email: process.env.ADMIN_EMAIL || 'admin@portfolio.com',
        password: process.env.ADMIN_PASSWORD || 'admin123',
        role: 'admin'
      });

      await admin.save();
      console.log('✅ Default admin user created');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
}

app.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
