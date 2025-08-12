import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Minus, ShoppingCart, DollarSign } from 'lucide-react';
import api from '../api';

function SnackSelection({ bookingData, updateBookingData, nextStep, prevStep }) {
  const [snacks, setSnacks] = useState([]);
  const [categories, setCategories] = useState({});
  const [selectedSnacks, setSelectedSnacks] = useState(bookingData.selectedSnacks || []);
  const [loading, setLoading] = useState(true);

  const { showtime, selectedSeats } = bookingData;

  useEffect(() => {
    fetchSnacks();
  }, []);

  const fetchSnacks = async () => {
    try {
      const response = await api.get('/snacks');
      // Handle both direct array and {success, data} format
      if (response.data && Array.isArray(response.data)) {
        setSnacks(response.data);
      } else if (response.data && response.data.snacks) {
        setSnacks(response.data.snacks);
        setCategories(response.data.categories || {});
      } else {
        setSnacks([]);
      }
    } catch (error) {
      console.error('Error fetching snacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSnackQuantity = (snackId) => {
    const item = selectedSnacks.find(item => item.snack.id === snackId);
    return item ? item.quantity : 0;
  };

  const updateSnackQuantity = (snack, quantity) => {
    let newSelection = [...selectedSnacks];
    const existingIndex = newSelection.findIndex(item => item.snack.id === snack.id);
    
    if (quantity === 0) {
      if (existingIndex > -1) {
        newSelection.splice(existingIndex, 1);
      }
    } else {
      if (existingIndex > -1) {
        newSelection[existingIndex] = { snack, quantity };
      } else {
        newSelection.push({ snack, quantity });
      }
    }
    
    setSelectedSnacks(newSelection);
    updateBookingData({ selectedSnacks: newSelection });
  };

  const incrementQuantity = (snack) => {
    const currentQuantity = getSnackQuantity(snack.id);
    updateSnackQuantity(snack, currentQuantity + 1);
  };

  const decrementQuantity = (snack) => {
    const currentQuantity = getSnackQuantity(snack.id);
    if (currentQuantity > 0) {
      updateSnackQuantity(snack, currentQuantity - 1);
    }
  };

  const calculateSnacksTotal = () => {
    return selectedSnacks.reduce((total, item) => {
      return total + (parseFloat(item.snack.price) * item.quantity);
    }, 0).toFixed(2);
  };

  const calculateSeatsTotal = () => {
    const seatPrice = parseFloat(showtime.movie.price);
    return (selectedSeats.length * seatPrice).toFixed(2);
  };

  const calculateGrandTotal = () => {
    return (parseFloat(calculateSeatsTotal()) + parseFloat(calculateSnacksTotal())).toFixed(2);
  };

  const handleContinue = () => {
    nextStep();
  };

  const handleSkip = () => {
    setSelectedSnacks([]);
    updateBookingData({ selectedSnacks: [] });
    nextStep();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevStep}
          className="flex items-center text-white hover:text-yellow-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Seats
        </button>
        
        <h2 className="text-3xl font-bold text-white text-center">
          Add Some Snacks?
        </h2>
        
        <div className="w-24"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Snacks Grid */}
        <div className="flex-1">
          {Object.entries(categories).map(([categoryName, categorySnacks]) => (
            <div key={categoryName} className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-4 border-b border-white/20 pb-2">
                {categoryName}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categorySnacks.map((snack) => {
                  const quantity = getSnackQuantity(snack.id);
                  
                  return (
                    <div
                      key={snack.id}
                      className="snack-card bg-white rounded-xl overflow-hidden shadow-lg"
                    >
                      <div className="aspect-w-16 aspect-h-12">
                        <img
                          src={snack.imageUrl || '/api/placeholder/200/150'}
                          alt={snack.name}
                          className="w-full h-32 object-cover"
                        />
                      </div>
                      
                      <div className="p-4">
                        <h4 className="text-lg font-bold text-gray-900 mb-1">{snack.name}</h4>
                        <p className="text-gray-600 text-sm mb-3">{snack.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-green-600">
                            ${snack.price}
                          </span>
                          
                          <div className="flex items-center space-x-3">
                            {quantity > 0 && (
                              <button
                                onClick={() => decrementQuantity(snack)}
                                className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                            )}
                            
                            {quantity > 0 && (
                              <span className="w-8 text-center font-bold text-gray-900">
                                {quantity}
                              </span>
                            )}
                            
                            <button
                              onClick={() => incrementQuantity(snack)}
                              className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-80">
          <div className="bg-white rounded-xl p-6 shadow-lg sticky top-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Order Summary
            </h3>
            
            {/* Movie & Seats */}
            <div className="mb-4 pb-4 border-b">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Movie:</span>
                <span className="font-medium">{showtime.movie.title}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Seats ({selectedSeats.length}):</span>
                <span className="font-medium">${calculateSeatsTotal()}</span>
              </div>
              <div className="text-xs text-gray-500">
                {selectedSeats.map(seat => `${seat.seatRow}${seat.seatNumber}`).join(', ')}
              </div>
            </div>

            {/* Snacks */}
            {selectedSnacks.length > 0 && (
              <div className="mb-4 pb-4 border-b">
                <h4 className="font-semibold text-gray-800 mb-2">Snacks</h4>
                <div className="space-y-2">
                  {selectedSnacks.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.snack.name} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        ${(parseFloat(item.snack.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-sm font-medium mt-2 pt-2 border-t">
                  <span>Snacks Subtotal:</span>
                  <span>${calculateSnacksTotal()}</span>
                </div>
              </div>
            )}

            {/* Total */}
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-800 flex items-center">
                  <DollarSign className="w-5 h-5 mr-1" />
                  Grand Total:
                </span>
                <span className="text-2xl font-bold text-green-600">
                  ${calculateGrandTotal()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleContinue}
                className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all duration-200 btn shadow-lg"
              >
                Continue to Checkout
              </button>
              
              <button
                onClick={handleSkip}
                className="w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-all duration-200 btn"
              >
                Skip Snacks
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SnackSelection;