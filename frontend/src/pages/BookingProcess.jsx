import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import MovieSelection from './MovieSelection';
import SeatSelection from './SeatSelection';
import SnackSelection from './SnackSelection';
import Checkout from './Checkout';
import BookingConfirmation from './BookingConfirmation';

function BookingProcess() {
  const [bookingData, setBookingData] = useState({
    movie: null,
    showtime: null,
    selectedSeats: [],
    selectedSnacks: [],
    customer: null,
    booking: null,
    sessionId: null
  });
  
  const navigate = useNavigate();
  const location = useLocation();

  const steps = [
    { id: 1, name: 'Select Movie', path: '/', icon: '🎬' },
    { id: 2, name: 'Choose Seats', path: '/seats', icon: '🪑' },
    { id: 3, name: 'Add Snacks', path: '/snacks', icon: '🍿' },
    { id: 4, name: 'Checkout', path: '/checkout', icon: '💳' }
  ];

  // Generate a unique session ID when the app loads
  useEffect(() => {
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    updateBookingData({ sessionId });
  }, []);

  const updateBookingData = (data) => {
    setBookingData(prev => ({ ...prev, ...data }));
  };

  const nextStep = (path) => {
    navigate(path);
  };

  const prevStep = (path) => {
    navigate(path);
  };

  const resetBooking = () => {
    setBookingData({
      movie: null,
      showtime: null,
      selectedSeats: [],
      selectedSnacks: [],
      customer: null,
      booking: null,
      sessionId: bookingData.sessionId // Preserve session ID
    });
    navigate('/');
  };

  const getCurrentStep = () => {
    const currentPath = location.pathname;
    const stepIndex = steps.findIndex(step => step.path === currentPath);
    return stepIndex >= 0 ? stepIndex + 1 : 1;
  };

  const currentStep = getCurrentStep();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-white tracking-tight">
            CineMax Booking
          </h1>
          <p className="mt-2 text-xl text-blue-200">
            Your Ultimate Movie Experience Awaits
          </p>
        </header>

        {/* Progress Bar */}
        <div className="w-full max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className={`step-item ${currentStep >= step.id ? 'active' : ''}`}>
                  <div className="step-icon">{step.icon}</div>
                  <div className="step-name">{step.name}</div>
                </div>
                {index < steps.length - 1 && <div className={`step-connector ${currentStep > step.id ? 'active' : ''}`}></div>}
              </React.Fragment>
            ))}
          </div>
        </div>

        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/movies" />} />
            <Route 
              path="/movies" 
              element={
                <MovieSelection
                  bookingData={bookingData}
                  updateBookingData={updateBookingData}
                  nextStep={() => nextStep('/seats')}
                  prevStep={() => prevStep('/')}
                  resetBooking={resetBooking}
                />
              } 
            />
            <Route 
              path="/seats" 
              element={
                <SeatSelection
                  bookingData={bookingData}
                  updateBookingData={updateBookingData}
                  nextStep={() => nextStep('/snacks')}
                  prevStep={() => prevStep('/movies')}
                  resetBooking={resetBooking}
                />
              } 
            />
            <Route 
              path="/snacks" 
              element={
                <SnackSelection
                  bookingData={bookingData}
                  updateBookingData={updateBookingData}
                  nextStep={() => nextStep('/checkout')}
                  prevStep={() => prevStep('/seats')}
                  resetBooking={resetBooking}
                />
              } 
            />
            <Route 
              path="/checkout" 
              element={
                <Checkout
                  bookingData={bookingData}
                  updateBookingData={updateBookingData}
                  nextStep={() => nextStep('/confirmation')}
                  prevStep={() => prevStep('/snacks')}
                  resetBooking={resetBooking}
                />
              } 
            />
            <Route 
              path="/confirmation" 
              element={<BookingConfirmation bookingData={bookingData} resetBooking={resetBooking} />} 
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default BookingProcess;
