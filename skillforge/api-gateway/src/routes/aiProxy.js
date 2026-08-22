const express = require('express');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const { verifySupabaseToken } = require('../middleware/auth');
const { validate, chatAgentSchema, generateRoadmapSchema, analyzeSkillsSchema, ragQuerySchema } = require('../middleware/validate');

const rateLimit = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const { Redis } = require('ioredis');

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'https://skillforge-ai-service.onrender.com';
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || 'skillforge-secret-key-2026';

if (!process.env.INTERNAL_API_KEY) {
  console.warn("WARNING: INTERNAL_API_KEY environment variable is not set! Using fallback for development.");
}

const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const createLimiter = (maxRequests, windowMinutes) => rateLimit({
  windowMs: windowMinutes * 60 * 1000,
  max: maxRequests,
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
  message: { error: `Too many requests, please try again after ${windowMinutes} minutes.` },
  standardHeaders: true,
  legacyHeaders: false,
});

const roadmapLimiter = createLimiter(5, 15); // 5 requests per 15 minutes
const chatLimiter = createLimiter(30, 15); // 30 requests per 15 minutes
const analyzeLimiter = createLimiter(10, 15); // 10 requests per 15 minutes
const uploadLimiter = createLimiter(5, 15); // 5 requests per 15 minutes

router.use(verifySupabaseToken);

const forwardRequest = async (req, res, endpoint) => {
  try {
    const payload = { ...req.body };
    if (!payload.student_id && req.user && req.user.id) {
      payload.student_id = req.user.id;
    }

    const response = await axios.post(`${AI_SERVICE_URL}${endpoint}`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': INTERNAL_API_KEY
      }
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(502).json({ error: 'AI Service currently unreachable. Please retry.' });
    }
  }
};

const forwardChatRequest = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (!payload.student_id && req.user && req.user.id) {
      payload.student_id = req.user.id;
    }

    const response = await axios.post(`${AI_SERVICE_URL}/api/chat-agent`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': INTERNAL_API_KEY
      },
      timeout: 15000
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(502).json({ error: 'AI Service currently unreachable. Please retry.' });
    }
  }
};

router.post('/analyze-skills', analyzeLimiter, validate(analyzeSkillsSchema), (req, res) => forwardRequest(req, res, '/api/analyze-skills'));
router.post('/generate-roadmap', roadmapLimiter, validate(generateRoadmapSchema), (req, res) => forwardRequest(req, res, '/api/generate-roadmap'));
router.post('/chat-agent', chatLimiter, validate(chatAgentSchema), forwardChatRequest);
router.post('/rag-query', chatLimiter, validate(ragQuerySchema), (req, res) => forwardRequest(req, res, '/api/rag-query'));

// New Routes for integration
router.post('/questions', chatLimiter, (req, res) => forwardRequest(req, res, '/api/assessment/questions'));
router.post('/generate', roadmapLimiter, (req, res) => forwardRequest(req, res, '/api/generate-roadmap'));

router.post('/upload-cv', uploadLimiter, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  
  try {
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });
    formData.append('student_id', req.user.id);
    
    const response = await axios.post(`${AI_SERVICE_URL}/api/upload-cv`, formData, {
      headers: {
        ...formData.getHeaders(),
        'X-API-Key': INTERNAL_API_KEY
      }
    });
    
    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(502).json({ error: 'AI Service currently unreachable. Please retry.' });
    }
  }
});

module.exports = router;
