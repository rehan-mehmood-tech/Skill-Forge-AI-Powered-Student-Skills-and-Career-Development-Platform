const { z } = require('zod');

// Schema for /api/ai/chat-agent
const chatAgentSchema = z.object({
  message: z.string().min(1).max(2000),
  target_role: z.string().min(1).max(100).optional(),
  conversation_history: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string()
  })).optional(),
  student_id: z.string().uuid().optional()
});

// Schema for /api/ai/generate-roadmap
const generateRoadmapSchema = z.object({
  target_role: z.string().min(1).max(100),
  timeframe_weeks: z.number().int().min(1).max(52).optional(),
  student_id: z.string().uuid().optional()
});

// Schema for /api/ai/analyze-skills
const analyzeSkillsSchema = z.object({
  student_id: z.string().uuid().optional()
});

// Schema for /api/ai/rag-query
const ragQuerySchema = z.object({
  query: z.string().min(1).max(1000),
  student_id: z.string().uuid().optional()
});

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    return res.status(422).json({
      error: "Validation error",
      details: err.errors
    });
  }
};

module.exports = {
  validate,
  chatAgentSchema,
  generateRoadmapSchema,
  analyzeSkillsSchema,
  ragQuerySchema
};
