const openRouterService = require('../services/openRouterService');
const User = require('../models/User');
const Resume = require('../models/Resume');
const { buildAIChatFallback } = require('../utils/frontendData');

const aiController = {
  async ask(req, res) {
    try {
      const { question } = req.body;
      if (!question) return res.status(400).json({ error: 'Question is required' });

      const user = await User.findByPk(req.userId);
      const latestResume = await Resume.findOne({
        where: { userId: req.userId },
        order: [['createdAt', 'DESC']]
      });

      let systemPrompt = `You are PlacifAI, an elite AI career coach. 
      Answer the user's career-related questions with surgical precision, professional tone, and actionable advice.
      Keep answers concise (max 3-4 sentences) unless a more detailed explanation is necessary.`;

      if (user) {
        systemPrompt += `\n\nUser Context:
        - Name: ${user.firstName}
        - Target Role: ${user.targetRole || 'Software Engineer'}
        - Experience Level: ${user.experience || 'Intermediate'}`;
      }

      if (latestResume && latestResume.rawText) {
        systemPrompt += `\n\nUse the candidate's background for context if relevant: \n${latestResume.rawText.slice(0, 2000)}`;
      }

      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question }
      ];

      let answer = '';
      try {
        answer = await openRouterService.callLLM('openrouter/auto', messages, 0.7, 1000);
      } catch (aiErr) {
        console.error('AI LLM call failed, using fallback:', aiErr.message);
        answer = buildAIChatFallback(question);
      }
      
      res.json({ answer });
    } catch (error) {
      console.error('AI Ask Error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async explainCode(req, res) {
    try {
      const { code, language, problemTitle, problemDescription } = req.body;
      if (!code) return res.status(400).json({ error: 'Code is required' });

      console.log(`[AI] Explaining ${language} code for problem: ${problemTitle}`);

      let systemPrompt = `You are PlacifAI, an elite coding mentor. 
      Your task is to explain the provided ${language} code clearly and concisely.
      The code is a solution for the problem: "${problemTitle}".
      Problem Context: ${problemDescription}
      
      Focus on:
      1. High-level logic/algorithm.
      2. Time and Space complexity.
      3. Any potential optimizations or edge cases.
      
      Format the output with Markdown. Use bullet points for readability.`;

      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Please explain this code:\n\n\`\`\`${language}\n${code}\n\`\`\`` }
      ];

      let explanation = '';
      try {
        explanation = await openRouterService.callLLM('openrouter/auto', messages, 0.5, 1500);
      } catch (aiErr) {
        console.error('[AI] Explain Code LLM call failed:', aiErr.message);
        // Still return 200 but with the error message as content so frontend doesn't catch
        return res.json({ explanation: "I'm sorry, I'm having trouble analyzing your code right now (Neural link timed out). Please try again in a moment." });
      }
      
      res.json({ explanation });
    } catch (error) {
      console.error('[AI] Fatal Explain Error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async getSolution(req, res) {
    try {
      const { language, problemTitle, problemDescription, constraints } = req.body;

      if (!problemTitle || !problemDescription) {
        return res.status(400).json({ error: 'Problem details are missing' });
      }

      console.log(`[AI] Generating solution for ${problemTitle} in ${language}`);

      const systemPrompt = `You are an elite competitive programmer and expert ${language} developer. 
      Provide the most optimal, production-grade code solution for the following problem.
      
      Problem: ${problemTitle}
      Context: ${problemDescription}
      Constraints: ${constraints || 'No specific constraints provided.'}

      Requirements:
      1. Provide a clean, efficient, and well-commented ${language} code solution.
      2. Ensure the code handles edge cases.
      3. Use a Markdown code block for the code.
      4. After the code block, provide a brief analysis of the Time and Space complexity.
      5. Do not include unnecessary conversational filler.`;

      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate the optimal solution for "${problemTitle}" in ${language}.` }
      ];

      let solution = '';
      try {
        // Using a high-quality free coding model as primary
        solution = await openRouterService.callLLM('qwen/qwen3-coder:free', messages, 0.3, 2000);
      } catch (aiErr) {
        console.error('[AI] Get Solution LLM call failed:', aiErr.message);
        return res.json({ 
          solution: "### ⚠️ Neural Link Interrupted\n\nI was unable to synthesize the solution at this moment. This usually happens due to high traffic or API rate limits.\n\n**Please try clicking the button again in a few seconds.**" 
        });
      }

      res.json({ solution });
    } catch (error) {
      console.error('[AI] Fatal Solution Error:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = aiController;
