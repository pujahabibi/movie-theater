import React, { useState } from 'react';
import { ArrowLeft, CreditCard, User, Mail, Phone, DollarSign, Calendar, MapPin, Users } from 'lucide-react';
import api from '../api';

function Checkout({ bookingData, updateBookingData, nextStep, prevStep }) {
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { showtime, selectedSeats, selectedSnacks } = bookingData;

  const validateForm = () => {
    const newErrors = {};
    
    if (!customerData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!customerData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(customerData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!customerData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateSeatsTotal = () => {
    const seatPrice = parseFloat(showtime.movie.price);
    return (selectedSeats.length * seatPrice).toFixed(2);
  };

  const calculateSnacksTotal = () => {
    return selectedSnacks.reduce((total, item) => {
      return total + (parseFloat(item.snack.price) * item.quantity);
    }, 0).toFixed(2);
  };

  const calculateGrandTotal = () => {
    return (parseFloat(calculateSeatsTotal()) + parseFloat(calculateSnacksTotal())).toFixed(2);
  };

  const handleInputChange = (field, value) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Prepare booking data
      const bookingPayload = {
        showtimeId: showtime.id,
        customerName: customerData.name,
        customerEmail: customerData.email,
        customerPhone: customerData.phone,
        seatIds: selectedSeats.map(seat => seat.id),
        snackItems: selectedSnacks.map(item => ({
          snackId: item.snack.id,
          quantity: item.quantity
        }))
      };

      // Create booking
      const response = await api.post('/bookings', bookingPayload);
      
      // Update booking data and proceed to confirmation
      updateBookingData({ 
        customer: customerData,
        booking: response.data
      });
      
      nextStep();
    } catch (error) {
      showNotification(error.message || 'Failed to process booking. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevStep}
          className="flex items-center text-white hover:text-yellow-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Snacks
        </button>
        
        <h2 className="text-3xl font-bold text-white text-center">
          Complete Your Booking
        </h2>
        
        <div className="w-24"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Customer Information Form */}
        <div className="flex-1">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <User className="w-6 h-6 mr-2" />
              Customer Information
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    id="name"
                    value={customerData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`
                      w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      ${errors.name ? 'border-red-500' : 'border-gray-300'}
                    `}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    id="email"
                    value={customerData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`
                      w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      ${errors.email ? 'border-red-500' : 'border-gray-300'}
                    `}
                    placeholder="Enter your email address"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    id="phone"
                    value={customerData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`
                      w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      ${errors.phone ? 'border-red-500' : 'border-gray-300'}
                    `}
                    placeholder="Enter your phone number"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
                  <h4 className="font-semibold text-blue-900">Payment</h4>
                </div>
                <p className="text-sm text-blue-700">
                  Payment will be processed at the theater counter upon arrival. 
                  Please arrive 15 minutes before showtime.
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="w-full lg:w-96">
          <div className="bg-white rounded-xl p-6 shadow-lg sticky top-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Booking Summary
            </h3>
            
            {/* Movie Details */}
            <div className="mb-6 pb-4 border-b">
              <div className="flex mb-3">
                <img
                  src={showtime.movie.posterUrl || '/api/placeholder/80/120'}
                  alt={showtime.movie.title}
                  className="w-16 h-24 object-cover rounded"
                />
                <div className="ml-4 flex-1">
                  <h4 className="font-bold text-gray-900 text-lg">{showtime.movie.title}</h4>
                  <p className="text-sm text-gray-600">{showtime.movie.genre} • {showtime.movie.rating}</p>
                  <p className="text-sm text-gray-600">{showtime.movie.duration} min</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatTime(showtime.startTime)}
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {showtime.theaterRoom}
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  Seats: {selectedSeats.map(seat => `${seat.seatRow}${seat.seatNumber}`).join(', ')}
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tickets ({selectedSeats.length}) ×  ${showtime.movie.price}</span>
                <span className="font-medium">${calculateSeatsTotal()}</span>
              </div>
              
              {selectedSnacks.length > 0 && (
                <div>
                  <div className="text-sm text-gray-600 font-medium mb-2">Snacks:</div>
                  {selectedSnacks.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm pl-4">
                      <span className="text-gray-600">
                        {item.snack.name} × {item.quantity}
                      </span>
                      <span>${(parseFloat(item.snack.price) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm font-medium mt-2 pl-4 pt-2 border-t">
                    <span className="text-gray-600">Snacks Subtotal:</span>
                    <span>${calculateSnacksTotal()}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-800 flex items-center">
                  <DollarSign className="w-5 h-5 mr-1" />
                  Total:
                </span>
                <span className="text-3xl font-bold text-green-600">
                  ${calculateGrandTotal()}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`
                w-full py-4 rounded-lg font-bold text-lg transition-all duration-200 btn
                ${!loading
                  ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg transform hover:scale-[1.02]'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }
              `}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Complete Booking'
              )}
            </button>
            
            <p className="text-xs text-gray-500 text-center mt-3">
              By completing this booking, you agree to our terms and conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;