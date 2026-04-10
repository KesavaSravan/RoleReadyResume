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

const swaggerJsdoc = require('swagger-jsdoc');

const path = require('path');
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
    apis: [path.resolve(__dirname, './src/routes/*.js').replace(/\\/g, '/')],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Serve the raw swagger JSON
app.get('/api/docs/swagger.json', (req, res) => res.json(swaggerDocs));
app.get('/docs/swagger.json', (req, res) => res.json(swaggerDocs));

// Serve Swagger UI using CDN assets (Bypasses Vercel Serverless static file missing bug)
const swaggerHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>RoleReadyResume Interactive API</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css" />
  <style>
    body { margin: 0; padding: 0; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js"></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: window.location.pathname.includes('/api/') ? '/api/docs/swagger.json' : '/docs/swagger.json',
        dom_id: '#swagger-ui',
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: "BaseLayout"
      });
    };
  </script>
</body>
</html>
`;

app.use('/api/docs', (req, res) => res.send(swaggerHtml));
app.use('/docs', (req, res) => res.send(swaggerHtml));

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