require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Security Headers
app.use(helmet());

// CORS config
app.use(cors({
  origin: '*'
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(apiLimiter);

// AI Proxy Routes
const aiProxyRouter = require('./routes/aiProxy');
app.use('/api/ai', aiProxyRouter);

// Health Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: "healthy", service: "api-gateway" });
});

// Port binding
const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
  });
}

module.exports = app;
