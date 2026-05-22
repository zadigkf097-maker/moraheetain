// ===============================
// 📝 نموذج الحجز (Booking Model)
// ===============================

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // معرفات
  bookingNumber: {
    type: String,
    unique: true,
    ar: 'رقم الحجز'
  },
  
  // المستخدم والاستراحة
  guestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    ar: 'معرف النزيل'
  },
  
  restortId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    ar: 'معرف الاستراحة'
  },
  
  // تفاصيل الحجز
  checkInDate: {
    type: Date,
    required: [true, 'الرجاء إدخال تاريخ الدخول'],
    ar: 'تاريخ الدخول'
  },
  
  checkOutDate: {
    type: Date,
    required: [true, 'الرجاء إدخال تاريخ المغادرة'],
    ar: 'تاريخ المغادرة'
  },
  
  numberOfGuests: {
    type: Number,
    required: [true, 'الرجاء إدخال عدد النزلاء'],
    min: 1,
    ar: 'عدد النزلاء'
  },
  
  specialRequests: {
    type: String,
    ar: 'طلبات خاصة'
  },
  
  // التسعير
  pricePerDay: {
    type: Number,
    required: true,
    ar: 'السعر لليوم الواحد'
  },
  
  numberOfDays: {
    type: Number,
    required: true,
    ar: 'عدد الأيام'
  },
  
  totalPrice: {
    type: Number,
    required: true,
    ar: 'السعر الإجمالي'
  },
  
  taxes: {
    type: Number,
    default: 0,
    ar: 'الضرائب'
  },
  
  finalPrice: {
    type: Number,
    required: true,
    ar: 'السعر النهائي'
  },
  
  // حالة الحجز
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected', 'checked-in', 'checked-out', 'cancelled'],
    default: 'pending',
    ar: 'حالة الحجز'
  },
  
  // الدفع
  payment: {
    method: {
      type: String,
      enum: ['online', 'cash', 'bank-transfer'],
      ar: 'طريقة الدفع'
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
      ar: 'حالة الدفع'
    },
    transactionId: String,
    paidDate: Date,
    ar: 'الدفع'
  },
  
  // التواصل
  communicationNotes: [
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        ar: 'المرسل'
      },
      message: {
        type: String,
        ar: 'الرسالة'
      },
      timestamp: {
        type: Date,
        default: Date.now,
        ar: 'الوقت'
      }
    }
  ],
  
  // التقييم
  rating: {
    score: {
      type: Number,
      min: 1,
      max: 5,
      ar: 'النقاط'
    },
    review: {
      type: String,
      ar: 'المراجعة'
    },
    images: [String],
    ratedAt: Date,
    ar: 'التقييم'
  },
  
  // التواريخ
  createdAt: {
    type: Date,
    default: Date.now,
    ar: 'تاريخ الإنشاء'
  },
  
  updatedAt: {
    type: Date,
    default: Date.now,
    ar: 'تاريخ التحديث'
  }
});

// ===============================
// 🔧 حساب عدد الأيام والسعر قبل الحفظ
// ===============================

bookingSchema.pre('save', function(next) {
  // حساب عدد الأيام
  const timeDifference = this.checkOutDate - this.checkInDate;
  this.numberOfDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  
  // حساب ا��سعر الإجمالي
  this.totalPrice = this.pricePerDay * this.numberOfDays;
  
  // إضافة الضرائب (5%)
  this.taxes = this.totalPrice * 0.05;
  
  // حساب السعر النهائي
  this.finalPrice = this.totalPrice + this.taxes;
  
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
