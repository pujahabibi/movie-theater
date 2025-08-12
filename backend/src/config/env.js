require('dotenv').config();

const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT) || 4000,
  DATABASE_URL: process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/movietheater',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173'
};

// Validate required environment variables
const requiredVars = ['DATABASE_URL'];
for (const varName of requiredVars) {
  if (!config[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
}

module.exports = config;