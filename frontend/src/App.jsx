import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import MovieSelection from './pages/MovieSelection';
import SeatSelection from './pages/SeatSelection';
import SnackSelection from './pages/SnackSelection';
import Checkout from './pages/Checkout';
import BookingConfirmation from './pages/BookingConfirmation';
import './index.css';

function App() {
  const [bookingData, setBookingData] = useState({
    movie: null,
    showtime: null,
    selectedSeats: [],
    selectedSnacks: [],
    customer: null,
    booking: null
  });
  
  const navigate = useNavigate();
  const location = useLocation();

  const steps = [
    { id: 1, name: 'Select Movie', path: '/movies' },
    { id: 2, name: 'Choose Seats', path: '/seats' },
    { id: 3, name: 'Add Snacks', path: '/snacks' },
    { id: 4, name: 'Checkout', path: '/checkout' }
  ];

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
      booking: null
    });
    navigate('/movies');
  };

  const getCurrentStep = () => {
    const currentPath = location.pathname;
    const stepIndex = steps.findIndex(step => step.path === currentPath);
    return stepIndex >= 0 ? stepIndex + 1 : 1;
  };

  const currentStep = getCurrentStep();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🎬 CineMax Theater</h1>
          <p className="text-blue-200">Premium movie experience awaits</p>
        </header>

        {/* Progress Bar */}
        {location.pathname !== '/confirmation' && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                    ${currentStep >= step.id 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-600 text-gray-300'
                    }
                  `}>
                    {step.id}
                  </div>
                  <span className={`
                    ml-2 text-sm font-medium
                    ${currentStep >= step.id ? 'text-green-400' : 'text-gray-400'}
                  `}>
                    {step.name}
                  </span>
                  {step.id < 4 && (
                    <div className={`
                      w-24 h-1 mx-4
                      ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-600'}
                    `} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="max-w-6xl mx-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/movies" replace />} />
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
              element={
                <BookingConfirmation
                  bookingData={bookingData}
                  updateBookingData={updateBookingData}
                  nextStep={nextStep}
                  prevStep={prevStep}
                  resetBooking={resetBooking}
                />
              } 
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;