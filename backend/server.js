// ===============================
// 🔌 ملف الخادم الرئيسي (Server)
// ===============================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// تحميل متغيرات البيئة
dotenv.config();

// إنشاء تطبيق Express
const app = express();

// ===============================
// 📋 Middleware
// ===============================

// CORS - السماح بطلبات من جميع المصادر
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// معالجة JSON
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ===============================
// 🗄️ اتصال قاعدة البيانات
// ===============================

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ تم الاتصال بقاعدة البيانات بنجاح'))
  .catch(err => console.error('❌ خطأ في الاتصال بقاعدة البيانات:', err));

// ===============================
// 🛣️ المسارات
// ===============================

const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

// ===============================
// 🏠 مسار اختبار
// ===============================

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🏨 مرحباً بك في تطبيق مرحبتين',
    version: '1.0.0'
  });
});

// ===============================
// ❌ معالجة الأخطاء 404
// ===============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'المسار غير موجود'
  });
});

// ===============================
// 🚀 تشغيل الخادم
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════╗
  ║  🏨 تطبيق مرحبتين                  ║
  ║  Moraheetain App                   ║
  ║                                    ║
  ║  الخادم يعمل على: http://localhost:${PORT}
  ║  النسخة: 1.0.0                     ║
  ╚════════════════════════════════════╝
  `);
});

module.exports = app;
