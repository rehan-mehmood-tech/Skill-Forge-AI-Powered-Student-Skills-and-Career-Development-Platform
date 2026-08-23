require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const { Redis } = require('ioredis');

const app = express();

// Security Headers
app.use(helmet());

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-internal-key']
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Redis connection for rate limit
const redisClient = process.env.REDIS_URL ? new Redis(process.env.REDIS_URL, {
  lazyConnect: true,
  enableOfflineQueue: false,
  maxRetriesPerRequest: 0,
  retryStrategy: () => null // Never retry in background if connection fails
}) : null;

if (redisClient) {
  redisClient.on('error', (err) => {
    console.warn('Redis connection failed, running in fallback mode');
  });
}

// Rate limiting
const apiLimiterConfig = {
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
};

if (redisClient) {
  apiLimiterConfig.store = new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  });
}

const apiLimiter = rateLimit(apiLimiterConfig);
app.use(apiLimiter);

// AI Proxy Routes
const aiProxyRouter = require('./routes/aiProxy');
app.use('/api/ai', aiProxyRouter);

// New Routes for Assessment & Roadmap
app.use('/api/assessment', aiProxyRouter); // Map to the same proxy for now, we'll handle inside
app.use('/api/roadmap', aiProxyRouter);

// Health Endpoint
const axios = require('axios');
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'https://skillforge-ai-service.onrender.com';

app.get('/health', async (req, res) => {
  let aiStatus = 'unreachable';
  try {
    const aiResponse = await axios.get(`${AI_SERVICE_URL}/health`, { timeout: 3000 });
    aiStatus = aiResponse.data.status || 'healthy';
  } catch (err) {
    console.warn('AI Service health check failed in gateway');
  }

  res.status(200).json({ 
    status: 'healthy', 
    service: 'api-gateway',
    ai_service: aiStatus
  });
});

// Port binding
const PORT = process.env.PORT || 5000;
let server;
if (require.main === module) {
  server = app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
  });

  // Graceful shutdown
  const gracefulShutdown = () => {
    console.log('Received kill signal, shutting down gracefully');
    server.close(() => {
      console.log('Closed out remaining connections');
      if (redisClient) redisClient.quit();
      process.exit(0);
    });

    setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
}

module.exports = app;
