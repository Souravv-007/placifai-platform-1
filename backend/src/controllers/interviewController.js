const InterviewSession = require('../models/InterviewSession');
const Resume = require('../models/Resume');
const openRouterService = require('../services/openRouterService');

const interviewController = {
  async getQuestions(req, res) {
    console.log('--- getQuestions ---');
    try {
      const { role, company } = req.body;
      if (!role || !company) return res.status(400).json({ error: 'Role and Company required' });

      // Fetch user's latest resume for context
      const resume = await Resume.findOne({
        where: { userId: req.userId },
        order: [['createdAt', 'DESC']]
      });

      let contextMessage = `Elite technical interviewer for ${company}. Start interview for ${role} with ONE brief, welcoming introductory question (max 2 sentences). 
      You should start with a standard opening like "Tell me about yourself" or "Could you walk me through your background and interest in this role?".`;
      if (resume && resume.rawText) {
        contextMessage += ` Use the following resume for context to make the opening more personalized: \n\n${resume.rawText.slice(0, 4000)}`;
      }

      let firstQuestion = '';
      try {
        const messages = [
          { role: 'system', content: contextMessage },
          { role: 'user', content: 'Start the interview.' }
        ];
        firstQuestion = await openRouterService.callLLM('openrouter/auto', messages, 0.7, 500);
      } catch (aiErr) {
        console.error('AI opening question failed, using fallback');
        firstQuestion = `Welcome to the interview for the ${role} position at ${company}. To start, could you describe a complex technical challenge you've faced and how you resolved it?`;
      }

      const session = await InterviewSession.create({
        userId: req.userId,
        role,
        company,
        transcript: [{ role: 'assistant', content: firstQuestion }],
      });

      res.json({ sessionId: session.id, question: firstQuestion });
    } catch (error) {
      console.error('getQuestions Error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async submitAnswer(req, res) {
    try {
      const { sessionId, answer } = req.body;
      const session = await InterviewSession.findByPk(sessionId);
      if (!session || session.userId !== req.userId) return res.status(404).json({ error: 'Session not found' });

      // Fetch user's latest resume for context
      const resume = await Resume.findOne({
        where: { userId: req.userId },
        order: [['createdAt', 'DESC']]
      });

      const transcript = session.transcript || [];
      transcript.push({ role: 'user', content: answer });

      const context = {
        role: session.role,
        company: session.company,
        turnNumber: Math.floor(transcript.length / 2) + 1,
        resumeText: resume ? resume.rawText : null
      };

      const result = await openRouterService.conductMockInterview(transcript, context);

      transcript.push({ role: 'assistant', content: result.question });

      await session.update({ 
        transcript,
        feedback: result.feedback_on_previous,
        ratings: { accuracy: result.accuracy, confidence: result.confidence, rating: result.rating }
      });

      res.json({ sessionId, ...result, transcript });
    } catch (error) {
      console.error('submitAnswer Error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async getHistory(req, res) {
    try {
      const history = await InterviewSession.findAll({
        where: { userId: req.userId },
        order: [['createdAt', 'DESC']],
      });
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = interviewController;