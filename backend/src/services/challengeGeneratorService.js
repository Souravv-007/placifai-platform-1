const openRouterService = require('./openRouterService');
const DojoChallenge = require('../models/DojoChallenge');
const TestCase = require('../models/TestCase');

const challengeGeneratorService = {
  async generateDailyChallenge() {
    console.log('[AI] Generating new daily challenge...');
    
    const prompt = `You are a competitive programming problem setter for a platform like LeetCode. 
    Generate a new, unique coding challenge in JSON format.
    
    Requirements:
    1. Title: A creative name.
    2. Difficulty: "Easy", "Medium", or "Hard".
    3. Category: e.g., "Arrays", "Strings", "Trees", "Graphs", "DP".
    4. Description: Clear problem statement using Markdown. Include clear examples.
    5. Explanation: A high-level hint or walkthrough of the optimal approach.
    6. Constraints: Performance limits.
    7. Starter Code: Valid templates for "javascript", "python", "cpp", and "java". 
       CRITICAL: The starter code MUST NOT contain the solution. It should ONLY contain the boilerplate logic to read input from STDIN, parse it, and call an EMPTY function that the user will implement. Add a comment "// TODO: Implement your solution here" inside the empty function. Print the result of the function to STDOUT.
       For Javascript, use fs.readFileSync(0, 'utf-8'). For Python, use sys.stdin.read(). For C++, use cin. For Java, use Scanner.
    8. Test Cases: At least 3 test cases, each with "input" (stringified) and "expectedOutput" (stringified). Mark at least one as isHidden: true.

    Return ONLY a JSON object with this structure:
    {
      "title": "string",
      "difficulty": "Easy|Medium|Hard",
      "topics": ["string"],
      "category": "string",
      "description": "string",
      "explanation": "string",
      "constraints": "string",
      "rewardXP": number,
      "starterCode": { "javascript": "...", "python": "...", "cpp": "...", "java": "..." },
      "testCases": [
        { "input": "string", "expectedOutput": "string", "isHidden": boolean }
      ]
    }`;

    try {
      const response = await openRouterService.callLLM('openrouter/auto', [{ role: 'user', content: prompt }], 0.7, 3000);
      const challengeData = openRouterService.parseJsonResponse(response);

      if (!challengeData || !challengeData.title) throw new Error('Invalid AI response');

      // 1. Reset old daily challenge
      await DojoChallenge.update({ isDaily: false }, { where: { isDaily: true } });

      // 2. Create new challenge
      const challenge = await DojoChallenge.create({
        ...challengeData,
        isDaily: true,
        activeDate: new Date()
      });

      // 3. Create test cases
      if (challengeData.testCases && challengeData.testCases.length > 0) {
        const tcs = challengeData.testCases.map(tc => ({
          ...tc,
          challengeId: challenge.id
        }));
        await TestCase.bulkCreate(tcs);
      }

      console.log(`[AI] Successfully generated daily challenge: ${challenge.title}`);
      return challenge;
    } catch (error) {
      console.error('[AI] Challenge generation failed:', error);
      throw error;
    }
  }
};

module.exports = challengeGeneratorService;
