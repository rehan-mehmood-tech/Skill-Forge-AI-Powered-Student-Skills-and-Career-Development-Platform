const request = require('supertest');
const app = require('../src/server');
const axios = require('axios');

jest.mock('axios');

jest.mock('../src/middleware/auth', () => ({
  verifySupabaseToken: (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Authorization token required" });
    }
    if (authHeader === 'Bearer valid-token') {
      req.user = { id: '00000000-0000-0000-0000-000000000000', role: 'student' };
      return next();
    }
    return res.status(401).json({ error: "Invalid or expired token" });
  },
  requireRole: (roles) => (req, res, next) => next(),
  supabase: {}
}));

describe('API Gateway Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /health -> 200 OK', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "healthy", service: "api-gateway" });
  });

  test('POST /api/ai/chat-agent without Authorization header -> 401 Unauthorized', async () => {
    const res = await request(app)
      .post('/api/ai/chat-agent')
      .send({ message: "Hello" });
    expect(res.status).toBe(401);
  });

  test('POST /api/ai/analyze-skills without Authorization header -> 401 Unauthorized', async () => {
    const res = await request(app)
      .post('/api/ai/analyze-skills')
      .send({ student_id: "00000000-0000-0000-0000-000000000000" });
    expect(res.status).toBe(401);
  });

  test('POST /api/ai/chat-agent with valid Auth -> 200 OK', async () => {
    axios.post.mockResolvedValue({ status: 200, data: { response: "Success" } });
    
    const res = await request(app)
      .post('/api/ai/chat-agent')
      .set('Authorization', 'Bearer valid-token')
      .send({ message: "Hello" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ response: "Success" });
    expect(axios.post).toHaveBeenCalledTimes(1);
  });
});
