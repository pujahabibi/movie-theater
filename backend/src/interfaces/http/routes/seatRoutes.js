const express = require('express');
const GetSeatsUseCase = require('../../../usecases/GetSeatsUseCase');
const ReserveSeatsUseCase = require('../../../usecases/ReserveSeatsUseCase');

const router = express.Router();

// Get seats for a showtime
router.get('/showtime/:showtimeId', async (req, res) => {
  try {
    const { showtimeId } = req.params;
    const getSeatsUseCase = new GetSeatsUseCase();
    const result = await getSeatsUseCase.execute(showtimeId);
    
    res.json({
      success: true,
      data: {
        seats: result.seats.map(seat => seat.toJSON()),
        seatMap: Object.keys(result.seatMap).reduce((acc, row) => {
          acc[row] = result.seatMap[row].map(seat => seat.toJSON());
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Error getting seats:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Reserve seats temporarily
router.post('/reserve', async (req, res) => {
  try {
    const { seatIds, customerEmail } = req.body;
    
    if (!seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Seat IDs are required'
      });
    }
    
    if (!customerEmail) {
      return res.status(400).json({
        success: false,
        error: 'Customer email is required'
      });
    }
    
    const reserveSeatsUseCase = new ReserveSeatsUseCase();
    const reservation = await reserveSeatsUseCase.execute(seatIds, customerEmail);
    
    res.json({
      success: true,
      data: reservation
    });
  } catch (error) {
    console.error('Error reserving seats:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;