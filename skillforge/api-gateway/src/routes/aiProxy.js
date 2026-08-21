const express = require('express');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const { verifySupabaseToken } = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || 'skillforge-secret-key';

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
      res.status(500).json({ error: "Failed to connect to AI Service", details: error.message });
    }
  }
};

router.post('/analyze-skills', (req, res) => forwardRequest(req, res, '/api/analyze-skills'));
router.post('/generate-roadmap', (req, res) => forwardRequest(req, res, '/api/generate-roadmap'));
router.post('/chat-agent', (req, res) => forwardRequest(req, res, '/api/chat-agent'));
router.post('/rag-query', (req, res) => forwardRequest(req, res, '/api/rag-query'));

router.post('/upload-cv', upload.single('file'), async (req, res) => {
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
      res.status(500).json({ error: "Failed to connect to AI Service", details: error.message });
    }
  }
});

module.exports = router;
