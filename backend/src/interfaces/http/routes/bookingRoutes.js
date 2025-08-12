const express = require('express');
const CreateBookingUseCase = require('../../../usecases/CreateBookingUseCase');
const BookingRepository = require('../../../infra/repositories/BookingRepository');

const router = express.Router();

// Create a new booking
router.post('/', async (req, res) => {
  try {
    const {
      showtimeId,
      customerName,
      customerEmail,
      customerPhone,
      seatIds,
      snackItems
    } = req.body;
    
    // Validate required fields
    if (!showtimeId || !customerName || !customerEmail) {
      return res.status(400).json({
        success: false,
        error: 'Showtime ID, customer name, and email are required'
      });
    }
    
    const createBookingUseCase = new CreateBookingUseCase();
    const booking = await createBookingUseCase.execute({
      showtimeId,
      customerName,
      customerEmail,
      customerPhone,
      seatIds: seatIds || [],
      snackItems: snackItems || []
    });
    
    res.status(201).json({
      success: true,
      data: booking.toJSON()
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get booking by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const bookingRepository = new BookingRepository();
    const booking = await bookingRepository.findById(id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }
    
    res.json({
      success: true,
      data: booking.toJSON()
    });
  } catch (error) {
    console.error('Error getting booking:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get bookings by customer email
router.get('/customer/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const bookingRepository = new BookingRepository();
    const bookings = await bookingRepository.findByEmail(email);
    
    res.json({
      success: true,
      data: bookings.map(booking => booking.toJSON())
    });
  } catch (error) {
    console.error('Error getting customer bookings:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;