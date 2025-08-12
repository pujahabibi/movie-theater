const express = require('express');
const GetShowtimesUseCase = require('../../../usecases/GetShowtimesUseCase');

const router = express.Router();

// Get showtimes for a specific movie
router.get('/movie/:movieId', async (req, res) => {
  try {
    const { movieId } = req.params;
    const getShowtimesUseCase = new GetShowtimesUseCase();
    const showtimes = await getShowtimesUseCase.execute(movieId);
    
    res.json({
      success: true,
      data: showtimes.map(showtime => showtime.toJSON())
    });
  } catch (error) {
    console.error('Error getting showtimes:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all upcoming showtimes
router.get('/', async (req, res) => {
  try {
    const getShowtimesUseCase = new GetShowtimesUseCase();
    const showtimes = await getShowtimesUseCase.execute();
    
    res.json({
      success: true,
      data: showtimes.map(showtime => showtime.toJSON())
    });
  } catch (error) {
    console.error('Error getting showtimes:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;