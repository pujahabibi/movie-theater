const express = require('express');
const GetMoviesUseCase = require('../../../usecases/GetMoviesUseCase');

const router = express.Router();

// Get all movies
router.get('/', async (req, res) => {
  try {
    const getMoviesUseCase = new GetMoviesUseCase();
    const movies = await getMoviesUseCase.execute();
    
    res.json({
      success: true,
      data: movies.map(movie => movie.toJSON())
    });
  } catch (error) {
    console.error('Error getting movies:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;