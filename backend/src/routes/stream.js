const express = require('express');
const axios = require('axios');
const authMiddleware = require('../middleware/auth');
require('dotenv').config();

const router = express.Router();

router.post('/analyze-stream', authMiddleware, async (req, res) => {
  const { resumeText } = req.body;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openrouter/auto',
        messages: [
          {
            role: 'system',
            content: 'You are an expert FAANG recruiter. Provide real-time analysis feedback.',
          },
          {
            role: 'user',
            content: `Analyze this resume deeply: ${resumeText}`,
          },
        ],
        temperature: 0.7,
        stream: true,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPEN_ROUTER_API_KEY}`,
          'HTTP-Referer': process.env.OPEN_ROUTER_REFERER,
        },
        responseType: 'stream',
      }
    );

    response.data.on('data', (chunk) => {
      const lines = chunk.toString().split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            res.write('data: [DONE]\n\n');
          } else {
            try {
              const json = JSON.parse(data);
              const content = json.choices[0]?.delta?.content || '';
              if (content) {
                res.write(`data: ${JSON.stringify({ content })}\n\n`);
              }
            } catch (e) {
              // Skip parsing errors
            }
          }
        }
      }
    });

    response.data.on('end', () => {
      res.end();
    });
  } catch (error) {
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

module.exports = router;