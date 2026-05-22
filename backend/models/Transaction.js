// ===============================
// 💳 نموذج المعاملات (Transaction Model)
// ===============================

const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  // المستخدم
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    ar: 'معرف المس��خدم'
  },
  
  // الحجز
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    ar: 'معرف الحجز'
  },
  
  // تفاصيل المعاملة
  transactionId: {
    type: String,
    unique: true,
    ar: 'معرف المعاملة'
  },
  
  type: {
    type: String,
    enum: ['payment', 'refund', 'deposit', 'withdrawal'],
    required: true,
    ar: 'نوع المعاملة'
  },
  
  amount: {
    type: Number,
    required: true,
    ar: 'المبلغ'
  },
  
  currency: {
    type: String,
    default: 'LYD',
    ar: 'العملة'
  },
  
  // طريقة الدفع
  paymentMethod: {
    type: String,
    enum: ['online', 'cash', 'bank-transfer', 'wallet'],
    required: true,
    ar: 'طريقة الدفع'
  },
  
  // التفاصيل المصرفية
  bankDetails: {
    accountNumber: String,
    accountHolder: String,
    bankName: String,
    swiftCode: String,
    ar: 'التفاصيل المصرفية'
  },
  
  // حالة المعاملة
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending',
    ar: 'الحالة'
  },
  
  description: {
    type: String,
    ar: 'الوصف'
  },
  
  // معرفات الدفع الخارجية
  stripePaymentId: String,
  paypalTransactionId: String,
  
  // الملاحظات
  notes: String,
  
  // التواريخ
  createdAt: {
    type: Date,
    default: Date.now,
    ar: 'تاريخ الإنشاء'
  },
  
  completedAt: {
    type: Date,
    ar: 'تاريخ الاكتمال'
  },
  
  updatedAt: {
    type: Date,
    default: Date.now,
    ar: 'تاريخ التحديث'
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);
