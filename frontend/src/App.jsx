import React, { useState, useEffect } from 'react';
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
  
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [particles, setParticles] = useState([]);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Generate floating particles for enhanced background
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 15; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          opacity: Math.random() * 0.3 + 0.1,
          duration: Math.random() * 20 + 10,
          delay: Math.random() * 5,
        });
      }
      setParticles(newParticles);
    };
    generateParticles();
  }, []);

  const steps = [
    { id: 1, name: 'Select Movie', path: '/movies', icon: '🎬' },
    { id: 2, name: 'Choose Seats', path: '/seats', icon: '🪑' },
    { id: 3, name: 'Add Snacks', path: '/snacks', icon: '🍿' },
    { id: 4, name: 'Checkout', path: '/checkout', icon: '💳' }
  ];

  const updateBookingData = (data) => {
    setBookingData(prev => ({ ...prev, ...data }));
  };

  const nextStep = (path) => {
    setIsTransitioning(true);
    setTimeout(() => {
      navigate(path);
      setTimeout(() => setIsTransitioning(false), 300);
    }, 150);
  };

  const prevStep = (path) => {
    setIsTransitioning(true);
    setTimeout(() => {
      navigate(path);
      setTimeout(() => setIsTransitioning(false), 300);
    }, 150);
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Dynamic Background with Pattern Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-900/20 via-transparent to-cyan-900/20"></div>
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                           radial-gradient(circle at 50% 50%, rgba(119, 198, 255, 0.2) 0%, transparent 50%)`
        }}></div>
      </div>

      {/* Enhanced Animated Background Elements with Particle Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main floating orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
        
        {/* Additional floating elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply filter blur-lg opacity-15 animate-float"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-pink-400 rounded-full mix-blend-multiply filter blur-lg opacity-15 animate-float animation-delay-3000"></div>
        
        {/* Floating particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-white mix-blend-overlay animate-float"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Floating Navigation Bar */}
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white/10 backdrop-blur-lg rounded-full px-6 py-3 border border-white/20 shadow-2xl">
          <div className="flex items-center space-x-6 text-white/80">
            <button 
              onClick={resetBooking}
              className="hover:text-white transition-colors duration-300 text-sm font-medium"
            >
              🏠 Home
            </button>
            <div className="w-px h-4 bg-white/30"></div>
            <span className="text-xs text-white/60">Step {currentStep} of {steps.length}</span>
            <div className="w-px h-4 bg-white/30"></div>
            <div className="flex space-x-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index < currentStep ? 'bg-green-400' : 
                    index === currentStep - 1 ? 'bg-yellow-400 animate-pulse' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Enhanced Header */}
        <header className="text-center mb-12">
          <div className="inline-block">
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 mb-4 animate-pulse">
              🎬 CineMax Theater
            </h1>
            <div className="h-1 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded-full mb-4"></div>
          </div>
          <p className="text-blue-200 text-xl font-light">Premium movie experience awaits you</p>
          <div className="flex justify-center items-center mt-4 space-x-4 text-blue-300">
            <span className="flex items-center">
              🎆 4K Ultra HD
            </span>
            <span className="w-1 h-1 bg-blue-300 rounded-full"></span>
            <span className="flex items-center">
              🔊 Dolby Atmos
            </span>
            <span className="w-1 h-1 bg-blue-300 rounded-full"></span>
            <span className="flex items-center">
              🪑 Luxury Seating
            </span>
          </div>
        </header>

        {/* Enhanced Progress Bar */}
        {location.pathname !== '/confirmation' && (
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`
                          w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-300 transform
                          ${currentStep >= step.id
                            ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg scale-110'
                            : currentStep === step.id - 1
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg animate-pulse'
                            : 'bg-white/20 text-white/60'
                          }
                        `}
                      >
                        {currentStep > step.id ? '✓' : step.icon}
                      </div>
                      <span
                        className={`
                          mt-3 text-sm font-medium transition-colors duration-300
                          ${currentStep >= step.id ? 'text-green-300' : 'text-white/60'}
                        `}
                      >
                        {step.name}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`
                          w-24 h-1 mx-4 rounded-full transition-all duration-500
                          ${currentStep > step.id
                            ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                            : 'bg-white/20'
                          }
                        `}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="relative">
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

        {/* Enhanced Footer */}
        <footer className="mt-16 text-center text-blue-200">
          <div className="border-t border-white/20 pt-8">
            <p className="text-sm">
              © 2025 CineMax Theater - Where Movies Come to Life
            </p>
            <div className="flex justify-center items-center mt-4 space-x-6 text-xs">
              <span>📞 1-800-CINEMAX</span>
              <span>📧 info@cinemax.com</span>
              <span>📍 123 Movie Street, Cinema City</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;




