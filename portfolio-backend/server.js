const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const portfolioRoutes = require('./routes/portfolio');
const uploadRoutes = require('./routes/upload');
const authRoutes = require('./routes/auth');

app.use('/api/portfolio', portfolioRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    // إنشاء مستخدم admin افتراضي إذا لم يكن موجوداً
    createDefaultAdmin();
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// دالة إنشاء مستخدم admin افتراضي
async function createDefaultAdmin() {
  try {
    const User = require('./models/User');
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      const admin = new User({
        username: 'admin',
        email: 'admin@portfolio.com',
        password: 'admin123',
        role: 'admin'
      });
      await admin.save();
      console.log('✅ Default admin user created: admin / admin123');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});