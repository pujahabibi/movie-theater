import React from 'react';
import { CheckCircle, Calendar, MapPin, Users, Mail, Phone, Download, RotateCcw } from 'lucide-react';
import { useNotification } from '../providers/NotificationProvider';

function BookingConfirmation({ bookingData, resetBooking }) {
  const { booking, customer, showtime, selectedSeats, selectedSnacks } = bookingData;
  const { showNotification } = useNotification();

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmailReceipt = () => {
    showNotification('Email receipt functionality is not yet implemented.', 'info');
  };

  return (
    <div className="fade-in max-w-4xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="success-checkmark mx-auto mb-6">
          <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle className="checkmark__circle" fill="none" stroke="#10b981" strokeWidth="3" cx="26" cy="26" r="25" strokeLinecap="round"/>
            <path className="checkmark__check" fill="none" stroke="#10b981" strokeWidth="3" d="m14.1 27.2l7.1 7.2 16.7-16.8" strokeLinecap="round"/>
          </svg>
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-2">
          Booking Confirmed!
        </h1>
        <p className="text-xl text-green-400 mb-4">
          Thank you for choosing CineMax Theater
        </p>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 inline-block">
          <p className="text-white text-sm">
            Booking ID: <span className="font-mono font-bold text-yellow-400">{booking.id}</span>
          </p>
        </div>
      </div>

      {/* Booking Details Card */}
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <h2 className="text-2xl font-bold mb-2">Your Movie Ticket</h2>
          <p className="opacity-90">Please arrive 15 minutes before showtime</p>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Movie Information */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                Movie Details
              </h3>
              
              <div className="flex mb-4">
                <img
                  src={showtime.movie.posterUrl || '/api/placeholder/100/150'}
                  alt={showtime.movie.title}
                  className="w-20 h-30 object-cover rounded-lg shadow-md"
                />
                <div className="ml-4 flex-1">
                  <h4 className="text-2xl font-bold text-gray-900 mb-1">{showtime.movie.title}</h4>
                  <p className="text-gray-600 mb-1">{showtime.movie.genre} • {showtime.movie.rating}</p>
                  <p className="text-gray-600 text-sm">{showtime.movie.duration} minutes</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <Calendar className="w-5 h-5 mr-3 text-blue-500" />
                  <div>
                    <div className="font-semibold">{formatTime(showtime.startTime)}</div>
                    <div className="text-sm text-gray-500">Show Time</div>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 mr-3 text-red-500" />
                  <div>
                    <div className="font-semibold">{showtime.theaterRoom}</div>
                    <div className="text-sm text-gray-500">Theater Room</div>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <Users className="w-5 h-5 mr-3 text-purple-500" />
                  <div>
                    <div className="font-semibold">
                      {selectedSeats.map(seat => `${seat.seatRow}${seat.seatNumber}`).join(', ')}
                    </div>
                    <div className="text-sm text-gray-500">
                      {selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Customer & Order Information */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                Customer Information
              </h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-700">
                  <Mail className="w-5 h-5 mr-3 text-blue-500" />
                  <div>
                    <div className="font-semibold">{customer.email}</div>
                    <div className="text-sm text-gray-500">Email Address</div>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <Phone className="w-5 h-5 mr-3 text-green-500" />
                  <div>
                    <div className="font-semibold">{customer.phone}</div>
                    <div className="text-sm text-gray-500">Phone Number</div>
                  </div>
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-3">Order Summary</h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Tickets ({selectedSeats.length})</span>
                    <span className="font-medium">${(selectedSeats.length * parseFloat(showtime.movie.price)).toFixed(2)}</span>
                  </div>
                  
                  {selectedSnacks.length > 0 && (
                    <div>
                      <div className="font-medium text-gray-700 mt-2 mb-1">Snacks:</div>
                      {selectedSnacks.map((item, index) => (
                        <div key={index} className="flex justify-between pl-4">
                          <span>{item.snack.name} × {item.quantity}</span>
                          <span>${(parseFloat(item.snack.price) * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="border-t pt-2 mt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Amount</span>
                      <span className="text-green-600">${parseFloat(booking.totalAmount).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Important Information */}
        <div className="bg-yellow-50 border-t border-yellow-200 p-6">
          <h3 className="font-bold text-yellow-800 mb-2">Important Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700">
            <div>
              • Arrive 15 minutes before showtime
              <br />
              • Payment due at theater counter
              <br />
              • Bring a valid ID for verification
            </div>
            <div>
              • No outside food or drinks allowed
              <br />
              • Seats cannot be changed after booking
              <br />
              • Refunds available up to 2 hours before showtime
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button
          onClick={handlePrint}
          className="flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all duration-200 btn shadow-lg"
        >
          <Download className="w-5 h-5 mr-2" />
          Print Ticket
        </button>
        
        <button
          onClick={handleEmailReceipt}
          className="flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all duration-200 btn shadow-lg"
        >
          <Mail className="w-5 h-5 mr-2" />
          Email Receipt
        </button>
        
        <button
          onClick={resetBooking}
          className="flex items-center px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-all duration-200 btn shadow-lg"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Book Another Movie
        </button>
      </div>
      
      {/* Footer */}
      <div className="text-center mt-8 text-white/70">
        <p className="text-sm">
          Thank you for choosing CineMax Theater. Enjoy your movie! 🎬
        </p>
      </div>
    </div>
  );
}

export default BookingConfirmation;