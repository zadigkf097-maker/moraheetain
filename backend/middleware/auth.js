// ===============================
// 🔒 ميدلوير المصادقة
// ===============================

const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;

    // الحصول على التوكن من الـ header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // التحقق من وجود التوكن
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح - لا يوجد توكن'
      });
    }

    try {
      // التحقق من صحة التوكن
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return res.status(404).json({
          success: false,
          message: 'المستخدم غير موجود'
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'التوكن غير صحيح'
      });
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في المصادقة',
      error: error.message
    });
  }
};

// ===============================
// 👤 ميدلوير التحقق من نوع المستخدم
// ===============================

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.userType)) {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح للوصول إلى هذا المورد'
      });
    }
    next();
  };
};
