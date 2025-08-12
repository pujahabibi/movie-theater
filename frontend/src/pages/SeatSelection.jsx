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
    const baseClass = 'seat w-8 h-8 m-1 flex items-center justify-center text-xs font-bold';
    
    if (selectedSeats.some(s => s.id === seat.id)) {
      return `${baseClass} selected`;
    }
    
    if (!seat.isAvailable) {
      return `${baseClass} ${seat.isOccupied ? 'occupied' : 'reserved'}`;
    }
    
    return `${baseClass} available`;
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
        {/* Seating Chart */}
        <div className="flex-1">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            {/* Screen */}
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 py-2 px-8 rounded-full inline-block font-bold">
                SCREEN
              </div>
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
