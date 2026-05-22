// ===============================
// 🔐 متحكم التسجيل والدخول
// ===============================

const User = require('../models/User');
const jwt = require('jsonwebtoken');

// ===============================
// ✍️ تسجيل مستخدم جديد
// ===============================

exports.register = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      location,
      passportImage,
      passportNumber,
      userType,
      profileImage
    } = req.body;

    // التحقق من البيانات المطلوبة
    if (!fullName || !email || !phone || !password || !location || !passportNumber || !userType) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء ملء جميع الحقول المطلوبة'
      });
    }

    // التحقق من عدم وجود بريد إلكتروني مكرر
    let userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: 'البريد الإلكتروني موجود بالفعل'
      });
    }

    // إنشاء مستخدم جديد
    const user = await User.create({
      fullName,
      email,
      phone,
      password,
      location,
      passportImage,
      passportNumber,
      userType,
      profileImage,
      isVerified: false
    });

    // إنشاء JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'تم التسجيل بنجاح',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        userType: user.userType
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في التسجيل',
      error: error.message
    });
  }
};

// ===============================
// 🔓 تسجيل الدخول
// ===============================

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // التحقق من البيانات
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء إدخال البريد الإلكتروني وكلمة المرور'
      });
    }

    // البحث عن المستخدم
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'بيانات الدخول غير صحيحة'
      });
    }

    // التحقق من كلمة المرور
    const isPasswordCorrect = await user.matchPassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'كلمة المرور غير صحيحة'
      });
    }

    // إنشاء JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // تحديث آخر دخول
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        userType: user.userType,
        profileImage: user.profileImage
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في تسجيل الدخول',
      error: error.message
    });
  }
};

// ===============================
// 👤 الحصول على بيانات المستخدم
// ===============================

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب البيانات',
      error: error.message
    });
  }
};

// ===============================
// ✏️ تحديث بيانات المستخدم
// ===============================

exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    // عدم السماح بتعديل كلمة المرور من هنا
    delete updates.password;
    delete updates.email;

    const user = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'تم تحديث البيانات بنجاح',
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث البيانات',
      error: error.message
    });
  }
};

// ===============================
// 🔓 تسجيل الخروج
// ===============================

exports.logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'تم تسجيل الخروج بنجاح'
  });
};
