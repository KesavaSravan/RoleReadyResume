require('dotenv').config(); // Load .env file
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const apiRoutes = require('./src/routes/api');

const app = express();
const PORT = 3001;

// API Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 requests per window
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/api', apiLimiter);
app.use('/', apiLimiter); // Vercel stripped route fallback

// Load Routes
app.use('/api', apiRoutes);
app.use('/', apiRoutes); // Vercel stripped route fallback

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'RoleReadyResume API',
            version: '1.0.0',
            description: 'API Documentation for the Resume Builder and Tailor',
        },
        servers: [
            { url: '/api', description: 'API routes' }
        ]
    },
    apis: [__dirname + '/src/routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs)); // Vercel stripped route fallback

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  if (err && err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size exceeds 5MB limit.' });
    }
  }
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Start the server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ Backend server running at http://localhost:${PORT}`);
    console.log(`📋 Available providers: groq`);
  });
}

// Export for Vercel serverless functions
module.exports = app;