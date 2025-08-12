const app = require('./app');
const config = require('./config/env');

const PORT = config.PORT || 4000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎬 Movie Theater API running on port ${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${config.NODE_ENV}`);
});