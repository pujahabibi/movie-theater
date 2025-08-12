const express = require('express');
const prisma = require('../../../infra/db/prisma');
const config = require('../../../config/env');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: config.NODE_ENV,
      database: 'connected'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      environment: config.NODE_ENV,
      database: 'disconnected',
      error: error.message
    });
  }
});

module.exports = router;