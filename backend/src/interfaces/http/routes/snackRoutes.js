const express = require('express');
const GetSnacksUseCase = require('../../../usecases/GetSnacksUseCase');

const router = express.Router();

// Get all snacks
router.get('/', async (req, res) => {
  try {
    const getSnacksUseCase = new GetSnacksUseCase();
    const result = await getSnacksUseCase.execute();
    
    res.json({
      success: true,
      data: {
        snacks: result.snacks.map(snack => snack.toJSON()),
        categories: Object.keys(result.categories).reduce((acc, category) => {
          acc[category] = result.categories[category].map(snack => snack.toJSON());
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Error getting snacks:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;