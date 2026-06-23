const axios = require('axios');
require('dotenv').config();

const {
  buildCompanyInsightsFallback,
  buildInterviewTurn,
  buildResumeAnalysisFallback,
  buildRoadmapPayload,
  buildSkillGapFallback,
} = require('../utils/frontendData');

// A list of currently available free models on OpenRouter
const FREE_MODELS = [
  'meta-llama/llama-3.3-70b-instruct:free',
  'qwen/qwen3-coder:free',
  'meta-llama/llama-3.2-3b-instruct:free',
  'deepseek/deepseek-v4-flash:free',
  'google/gemma-2-9b-it:free'
];

class OpenRouterService {
  constructor() {
    this.apiKey = process.env.OPEN_ROUTER_API_KEY;
    this.referer = process.env.OPEN_ROUTER_REFERER;
  }

  isConfigured() {
    return Boolean(this.apiKey) && this.apiKey !== 'your_openrouter_key';
  }

  async callAPI(model, messages, temperature = 0.7, maxTokens = 2000, modelIndex = 0) {
    console.log(`--- OpenRouter API Call [${model}] ---`);
    if (!this.isConfigured()) {
      console.log('Error: OPEN_ROUTER_API_KEY not configured or is default');
      throw new Error('OPEN_ROUTER_API_KEY is not configured');
    }

    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
          top_p: 0.9,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'HTTP-Referer': this.referer || 'https://placifai.com',
            'Content-Type': 'application/json',
          },
          timeout: 45000,
        }
      );

      return response.data.choices[0]?.message?.content || '';
    } catch (error) {
      const status = error.response?.status;
      const errorData = error.response?.data?.error;
      
      console.error(`OpenRouter API Error [${status}]:`, JSON.stringify(errorData || error.message));

      // If we hit rate limits (429), payment issues (402), or missing models (404), try fallback models
      if ([402, 429, 404, 400].includes(status)) {
        if (modelIndex < FREE_MODELS.length) {
          const nextModel = FREE_MODELS[modelIndex];
          console.log(`Retrying with fallback free model (${modelIndex + 1}/${FREE_MODELS.length}): ${nextModel}`);
          // Add a small delay for 429s
          if (status === 429) await new Promise(r => setTimeout(r, 1000));
          return this.callAPI(nextModel, messages, temperature, maxTokens, modelIndex + 1);
        }
      }
      
      throw error;
    }
  }

  async callLLM(...args) {
    try {
      return await this.callAPI(...args);
    } catch (err) {
      console.error('callLLM failed, returning error string');
      throw err;
    }
  }

  parseJsonResponse(response, fallbackValue) {
    if (!response) return fallbackValue;
    if (typeof response === 'object') return response;

    try {
      const cleaned = response.replace(/```json/gi, '').replace(/```/g, '').trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      return JSON.parse(jsonMatch ? jsonMatch[0] : cleaned);
    } catch (error) {
      console.error('JSON Parse Error:', error.message);
      return fallbackValue;
    }
  }

  async analyzeResume(resumeText) {
    console.log('Analyzing resume...');
    const fallback = buildResumeAnalysisFallback(resumeText);
    if (!this.isConfigured()) return fallback;

    try {
      const messages = [
        { 
          role: 'system', 
          content: `You are an expert ATS (Applicant Tracking System) analyzer and senior technical recruiter. 
          Analyze the provided resume text and provide a detailed evaluation in JSON format.
          
          Scoring Criteria (0-100):
          - Impact (30%): Are there quantifiable achievements (numbers, %, $, x-fold)?
          - Keywords (30%): Does it contain relevant technical and leadership keywords for senior roles?
          - Structure (20%): Is the information logically organized?
          - Narrative (20%): Does the resume tell a clear story of career growth and ownership?

          Return ONLY a JSON object with this structure:
          {
            "score": number,
            "strengths": ["string", "string"],
            "weaknesses": ["string", "string"],
            "improvements": ["string", "string"],
            "keywords_missing": ["string", "string"],
            "recommendations": ["string", "string"],
            "ats_compatibility_details": "string"
          }`
        },
        { role: 'user', content: `Resume Text:\n${resumeText.slice(0, 10000)}` }
      ];
      const response = await this.callLLM('openrouter/auto', messages, 0.3, 2000);
      const parsed = this.parseJsonResponse(response, fallback);
      
      // Ensure score is a number and within 0-100
      if (parsed && typeof parsed.score !== 'number') {
        parsed.score = fallback.score;
      }
      return parsed;
    } catch (error) {
      console.error('OpenRouter analyzeResume error:', error);
      return fallback;
    }
  }

  async generateCareerRoadmap(userProfile = {}, resumeText = '', resumeAnalysis = null) {
    console.log('Generating roadmap...');
    const fallback = buildRoadmapPayload(userProfile);
    if (!this.isConfigured()) return fallback;

    try {
      let systemContent = `You are an elite career coach and engineering manager at a top-tier tech company. 
      Create a highly personalized 8-week career road map to help the user grow from their current level (${userProfile.experience || 'junior'}) into a ${userProfile.targetRole || 'Intermediate Software Engineer'} role.`;

      if (resumeText) {
        systemContent += `\n\nUse the following resume as the baseline for their current skills and experience.
        \nResume Content:\n${resumeText.slice(0, 4000)}`;
      }

      if (resumeAnalysis) {
        systemContent += `\n\nSpecific Resume Analysis Insights:
        - Strengths: ${JSON.stringify(resumeAnalysis.strengths || [])}
        - Weaknesses: ${JSON.stringify(resumeAnalysis.weaknesses || [])}
        - ATS Score: ${resumeAnalysis.score || 'N/A'}`;
      }

      systemContent += `\n\nInstructions:
      1. The road map must be divided into 8 distinct weeks with a clear tiered progression tailored for someone starting as a ${userProfile.experience || 'fresher'} and aiming for ${userProfile.targetRole || 'Intermediate'}:
         - Weeks 1-4: Solidifying Fresher level foundations and bridging identified gaps.
         - Weeks 5-8: Moving into Intermediate level concepts, complexity, and ownership.
      2. Each week should have a clear "title" and a specific "focus".
      3. Each week must have 3-5 concrete "tasks" with a "name" and a "desc" (description).
      4. Provide a "subtitle" that summarizes the overall strategy based on their specific background, resume analysis, and goals.
      5. Include a "skillGaps" array identifying 3-5 specific areas they need to bridge based ON THE RESUME ANALYSIS PROVIDED.
      6. Each phase should include a "status" (initially 'locked' for all except the first few).
      7. Add an "insight" for each phase—a short, high-value piece of advice.

      Return ONLY a JSON object with this structure:
      {
        "title": "string",
        "subtitle": "string",
        "skillGaps": ["string"],
        "phases": [
          {
            "title": "Week 1: string",
            "focus": "string",
            "week": "Week 1",
            "tasks": [{ "name": "string", "desc": "string", "done": false }],
            "insight": "string",
            "status": "locked"
          }
        ]
      }`;

      const messages = [
        { role: 'system', content: systemContent },
        { role: 'user', content: `User Profile: ${JSON.stringify(userProfile)}` }
      ];
      const response = await this.callLLM('openrouter/auto', messages, 0.6, 3000);
      const parsed = this.parseJsonResponse(response, fallback);
      
      // Ensure the first phase is 'active' if all are 'locked'
      if (parsed.phases && parsed.phases.length > 0 && parsed.phases.every(p => p.status === 'locked')) {
        parsed.phases[0].status = 'active';
        if (parsed.phases[0].tasks && parsed.phases[0].tasks.length > 0) {
          parsed.phases[0].tasks[0].active = true;
        }
      }
      
      return parsed;
    } catch (error) {
      console.error('OpenRouter generateCareerRoadmap error:', error);
      return fallback;
    }
  }

  async conductMockInterview(transcript = [], context = {}) {
    const fallback = buildInterviewTurn({ ...context, response: transcript[transcript.length-1]?.content });
    if (!this.isConfigured()) return fallback;

    try {
      let systemContent = `You are a senior technical interviewer at ${context.company || 'a top tech company'}. You are interviewing a candidate for a ${context.role || 'Senior Software Engineer'} position.`;
      
      if (context.resumeText) {
        systemContent += `\n\nCandidate's Resume Context:\n${context.resumeText.slice(0, 3000)}`;
      }

      systemContent += `\n\nInstructions:
1. Evaluate the candidate's last response for technical depth, correctness, and communication style.
2. Provide a NEW, brief, challenging follow-up question (max 2 sentences) that builds on their previous answer or explores their background and skills.
3. Start with standard introductory or behavioral questions (like "Tell me about yourself" or "Describe a major project") if the interview is just beginning, then transition into deeper technical or situational challenges.
4. Ask ONLY one specific question at a time.
5. Calculate metrics (0-100):
   - accuracy: Rigorous score based on technical correctness and depth.
   - confidence: Based on tone, word choice (lack of "um", "maybe", "I think"), and directness.
6. Return JSON: {
     "feedback_on_previous": "constructive critique of their last answer",
     "question": "next interview question",
     "accuracy": number,
     "confidence": number,
     "rating": "Overall rating (1-10)",
     "tips": ["specific actionable advice"],
     "speechPace": "Fast/Normal/Slow",
     "keyTerms": ["keywords identified in their answer"]
   }`;

      const messages = [
        { role: 'system', content: systemContent },
        ...transcript
      ];
      const response = await this.callLLM('openrouter/auto', messages, 0.7, 1000);
      return this.parseJsonResponse(response, fallback);
    } catch (error) {
      return fallback;
    }
  }

  async generateCompanyInsights(companyName, role) {
    const fallback = buildCompanyInsightsFallback(companyName, role);
    if (!this.isConfigured()) return fallback;

    try {
      const messages = [
        { role: 'system', content: 'Provide interview prep JSON: {company_info, role_expectations, common_questions[], culture_fit_tips[], technical_focus[]}' },
        { role: 'user', content: `Prep for ${role} at ${companyName}` }
      ];
      const response = await this.callLLM('openrouter/auto', messages, 0.5, 1200);
      return this.parseJsonResponse(response, fallback);
    } catch (error) {
      return fallback;
    }
  }
}

module.exports = new OpenRouterService();