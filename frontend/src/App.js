import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// صفحات
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard';
import BookingSearch from './pages/BookingSearch';
import BookingDetails from './pages/BookingDetails';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';

function App() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="App">
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <Routes>
          {/* الصفحات العامة */}
          <Route path="/" element={<Home />} />
          
          {/* المصادقة */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* لوحة التحكم */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* الحجوزات */}
          <Route path="/search" element={<BookingSearch />} />
          <Route path="/booking/:bookingId" element={<BookingDetails />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          
          {/* الملف الشخصي */}
          <Route path="/profile" element={<Profile />} />
          
          {/* إعادة التوجيه */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
