import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, DollarSign, Monitor, Armchair, Crown, Star } from 'lucide-react';
import api from '../api';

function SeatSelection({ bookingData, updateBookingData, nextStep, prevStep }) {
  const [seats, setSeats] = useState([]);
  const [seatMap, setSeatMap] = useState({});
  const [selectedSeats, setSelectedSeats] = useState(bookingData.selectedSeats || []);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);

  const { showtime } = bookingData;

  useEffect(() => {
    if (showtime) {
      fetchSeats();
    }
  }, [showtime]);

  const fetchSeats = async () => {
    try {
      const response = await api.get(`/seats/showtime/${showtime.id}`);
      setSeats(response.data.seats);
      setSeatMap(response.data.seatMap);
    } catch (error) {
      console.error('Error fetching seats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seat) => {
    if (!seat.isAvailable) return;

    const isSelected = selectedSeats.some(s => s.id === seat.id);
    let newSelection;
    
    if (isSelected) {
      newSelection = selectedSeats.filter(s => s.id !== seat.id);
    } else {
      // Limit to 8 seats maximum
      if (selectedSeats.length >= 8) {
        alert('You can select a maximum of 8 seats.');
        return;
      }
      newSelection = [...selectedSeats, seat];
    }
    
    setSelectedSeats(newSelection);
    updateBookingData({ selectedSeats: newSelection });
  };

  const handleContinue = async () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat.');
      return;
    }

    setReserving(true);
    try {
      // Reserve seats temporarily
      const seatIds = selectedSeats.map(seat => seat.id);
      await api.post('/seats/reserve', {
        seatIds,
        customerEmail: 'temp@example.com' // This would come from user input in a real app
      });
      
      nextStep();
    } catch (error) {
      alert(error.message || 'Failed to reserve seats. Please try again.');
      // Refresh seat data
      fetchSeats();
    } finally {
      setReserving(false);
    }
  };

  const getSeatClass = (seat) => {
    const baseClass = 'seat relative w-10 h-10 m-1 flex items-center justify-center text-xs font-bold rounded-lg transition-all duration-300 transform cursor-pointer overflow-hidden';
    
    if (selectedSeats.some(s => s.id === seat.id)) {
      return `${baseClass} selected bg-gradient-to-br from-yellow-400 to-orange-500 text-black shadow-lg scale-110 animate-pulse ring-2 ring-yellow-300`;
    }
    
    if (!seat.isAvailable) {
      if (seat.isOccupied) {
        return `${baseClass} occupied bg-gradient-to-br from-red-500 to-red-600 text-white cursor-not-allowed opacity-60`;
      } else {
        return `${baseClass} reserved bg-gradient-to-br from-purple-500 to-purple-600 text-white cursor-not-allowed opacity-60`;
      }
    }
    
    // Different seat types with enhanced styling
    const seatTypeClass = getSeatTypeClass(seat.seatType);
    return `${baseClass} available ${seatTypeClass} hover:scale-110 hover:shadow-xl hover:z-10 group`;
  };

  const getSeatTypeClass = (seatType) => {
    switch (seatType) {
      case 'VIP':
        return 'bg-gradient-to-br from-purple-600 to-indigo-700 text-white border-2 border-purple-400';
      case 'Premium':
        return 'bg-gradient-to-br from-blue-500 to-blue-600 text-white border-2 border-blue-300';
      case 'Regular':
      default:
        return 'bg-gradient-to-br from-green-500 to-green-600 text-white border-2 border-green-300';
    }
  };

  const getSeatIcon = (seatType) => {
    switch (seatType) {
      case 'VIP':
        return <Crown className="w-3 h-3" />;
      case 'Premium':
        return <Star className="w-3 h-3" />;
      case 'Regular':
      default:
        return <Armchair className="w-3 h-3" />;
    }
  };

  const calculateTotal = () => {
    const seatPrice = parseFloat(showtime.movie.price);
    return (selectedSeats.length * seatPrice).toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  const rows = Object.keys(seatMap).sort();

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevStep}
          className="flex items-center text-white hover:text-yellow-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Movies
        </button>
        
        <h2 className="text-3xl font-bold text-white text-center">
          Choose Your Seats
        </h2>
        
        <div className="w-24"></div> {/* Spacer for centering */}
      </div>

      {/* Movie Info */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
        <div className="text-center text-white">
          <h3 className="text-xl font-bold">{showtime.movie.title}</h3>
          <p className="text-sm opacity-75">
            {new Date(showtime.startTime).toLocaleString()} • {showtime.theaterRoom}
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Enhanced Seating Chart with Theater Perspective */}
        <div className="flex-1">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
            {/* Background theater ambiance */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-blue-900/10 to-black/30 rounded-3xl"></div>
            
            {/* Enhanced Cinema Screen with Glow Effects */}
            <div className="text-center mb-12 relative z-10">
              <div className="relative inline-block">
                {/* Screen glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-white to-blue-400 rounded-2xl blur-xl opacity-30 scale-110"></div>
                
                {/* Main screen */}
                <div className="relative bg-gradient-to-r from-gray-100 via-white to-gray-100 text-gray-800 py-4 px-16 rounded-2xl font-bold text-lg shadow-2xl border-4 border-gray-300">
                  <div className="flex items-center justify-center space-x-3">
                    <Monitor className="w-6 h-6" />
                    <span>CINEMA SCREEN</span>
                    <Monitor className="w-6 h-6" />
                  </div>
                  
                  {/* Screen reflection effect */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-transparent rounded-2xl"></div>
                </div>
                
                {/* Screen base/stand */}
                <div className="mt-2 w-32 h-2 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full mx-auto shadow-lg"></div>
                
                {/* Ambient lighting effects */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-64 h-16 bg-gradient-to-b from-blue-400/20 to-transparent rounded-full blur-2xl"></div>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-48 h-8 bg-gradient-to-t from-white/10 to-transparent rounded-full blur-xl"></div>
              </div>
              
              {/* Theater perspective indicator */}
              <p className="text-white/60 text-sm mt-4 font-medium">Premium Theater Experience</p>
            </div>

            {/* Seats */}
            <div className="max-w-2xl mx-auto">
              {rows.map((row) => (
                <div key={row} className="flex items-center justify-center mb-2">
                  <div className="w-6 text-white font-bold text-sm flex items-center justify-center">
                    {row}
                  </div>
                  <div className="flex mx-4">
                    {seatMap[row].map((seat) => (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat)}
                        disabled={!seat.isAvailable}
                        className={getSeatClass(seat)}
                        title={`${row}${seat.seatNumber} - ${seat.seatType} - $${showtime.movie.price}`}
                      >
                        {seat.seatNumber}
                      </button>
                    ))}
                  </div>
                  <div className="w-6 text-white font-bold text-sm flex items-center justify-center">
                    {row}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-8 flex justify-center space-x-6 text-sm">
              <div className="flex items-center text-white">
                <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                Available
              </div>
              <div className="flex items-center text-white">
                <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
                Selected
              </div>
              <div className="flex items-center text-white">
                <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                Occupied
              </div>
              <div className="flex items-center text-white">
                <div className="w-4 h-4 bg-purple-500 rounded mr-2"></div>
                Reserved
              </div>
            </div>
          </div>
        </div>

        {/* Selection Summary */}
        <div className="w-full lg:w-80">
          <div className="bg-white rounded-xl p-6 shadow-lg sticky top-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Booking Summary</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Movie:</span>
                <span className="font-medium">{showtime.movie.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Showtime:</span>
                <span className="font-medium">
                  {new Date(showtime.startTime).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Theater:</span>
                <span className="font-medium">{showtime.theaterRoom}</span>
              </div>
            </div>

            {selectedSeats.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Selected Seats ({selectedSeats.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSeats.map((seat) => (
                    <span
                      key={seat.id}
                      className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-medium"
                    >
                      {seat.seatRow}{seat.seatNumber}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-gray-800 flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />
                  Total:
                </span>
                <span className="text-2xl font-bold text-green-600">
                  ${calculateTotal()}
                </span>
              </div>
              
              <button
                onClick={handleContinue}
                disabled={selectedSeats.length === 0 || reserving}
                className={`
                  w-full py-3 rounded-lg font-semibold transition-all duration-200 btn
                  ${selectedSeats.length > 0 && !reserving
                    ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                {reserving ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Reserving...
                  </div>
                ) : (
                  'Continue to Snacks'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeatSelection;


