const DojoChallenge = require('../models/DojoChallenge');
const UserDojo = require('../models/UserDojo');
const User = require('../models/User');
const TestCase = require('../models/TestCase');
const Submission = require('../models/Submission');
const pistonService = require('../services/pistonService');
const challengeGeneratorService = require('../services/challengeGeneratorService');
const { Op } = require('sequelize');

const dojoController = {
  async getSummary(req, res) {
    try {
      // 1. Check for Daily Challenge
      const today = new Date().toISOString().split('T')[0];
      let dailyChallenge = await DojoChallenge.findOne({
        where: { isDaily: true, activeDate: today }
      });

      if (!dailyChallenge) {
        try {
          dailyChallenge = await challengeGeneratorService.generateDailyChallenge();
        } catch (genErr) {
          console.error('Failed to generate daily challenge, falling back to latest daily');
          dailyChallenge = await DojoChallenge.findOne({ where: { isDaily: true }, order: [['activeDate', 'DESC']] });
        }
      }

      // 2. Get Challenges grouped by category or just a list
      const allChallenges = await DojoChallenge.findAll({
        order: [['difficulty', 'ASC'], ['title', 'ASC']]
      });

      // 3. Get User Stats
      let userDojo = await UserDojo.findOne({ where: { userId: req.userId } });
      if (!userDojo) userDojo = await UserDojo.create({ userId: req.userId });

      // Calculate progress stats
      const userSubmissions = await Submission.findAll({
        where: { userId: req.userId, status: 'Accepted' },
        attributes: ['challengeId'],
        group: ['challengeId']
      });
      const solvedCount = userSubmissions.length;
      const solvedChallengeIds = userSubmissions.map(s => s.challengeId);

      // 4. Get Top 5 Leaderboard
      const leaderboardRaw = await UserDojo.findAll({
        order: [['xp', 'DESC']],
        limit: 5,
        include: [{ model: User, attributes: ['firstName'] }]
      });

      const leaderboard = leaderboardRaw.map(entry => ({
        name: entry.User?.firstName || 'Anonymous',
        score: entry.xp.toLocaleString(),
        av: (entry.User?.firstName || 'U')[0].toUpperCase()
      }));

      res.json({
        dailyChallenge,
        challenges: allChallenges,
        stats: {
          streak: userDojo.streak,
          xp: userDojo.xp,
          rank: userDojo.rank,
          level: userDojo.level,
          solvedCount,
          totalCount: allChallenges.length,
          solvedChallengeIds
        },
        leaderboard
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getChallenge(req, res) {
    try {
      const { id } = req.params;
      const challenge = await DojoChallenge.findByPk(id, {
        include: [{ 
          model: TestCase, 
          as: 'testCases',
          where: { isHidden: false },
          required: false
        }]
      });

      if (!challenge) return res.status(404).json({ error: 'Challenge not found' });

      const submissions = await Submission.findAll({
        where: { userId: req.userId, challengeId: id },
        order: [['createdAt', 'DESC']],
        limit: 5
      });

      res.json({ challenge, submissions });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async run(req, res) {
    try {
      const { id } = req.params;
      const { language, code } = req.body;
      const testCases = await TestCase.findAll({ where: { challengeId: id, isHidden: false } });

      const results = [];
      for (const tc of testCases) {
        try {
          const execution = await pistonService.execute(language, code, tc.input);
          
          if (!execution.run) {
             results.push({
               input: tc.input,
               expectedOutput: tc.expectedOutput,
               actualOutput: '',
               passed: false,
               error: 'Execution failed: No output returned from engine',
             });
             continue;
          }

          const output = (execution.run.stdout || '').trim();
          const error = (execution.run.stderr || (execution.compile && execution.compile.stderr) || '').trim();
          
          // Normalized comparison
          const passed = output === tc.expectedOutput.trim();

          results.push({
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            actualOutput: output,
            passed: !error && passed,
            error,
            runtime: execution.run.time,
            memory: execution.run.memory
          });
        } catch (execErr) {
          results.push({
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            actualOutput: '',
            passed: false,
            error: execErr.message
          });
        }
      }
      res.json({ results });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async submit(req, res) {
    try {
      const { id } = req.params;
      const { language, code } = req.body;
      const challenge = await DojoChallenge.findByPk(id);
      const testCases = await TestCase.findAll({ where: { challengeId: id } });

      let allPassed = true;
      let totalRuntime = 0;
      let totalMemory = 0;
      let firstError = null;
      let status = 'Accepted';

      for (const tc of testCases) {
        try {
          const execution = await pistonService.execute(language, code, tc.input);
          
          if (!execution.run) {
            allPassed = false;
            status = 'Runtime Error';
            firstError = 'Execution failed: No output returned from engine';
            break;
          }

          const output = (execution.run.stdout || '').trim();
          const error = (execution.run.stderr || (execution.compile && execution.compile.stderr) || '').trim();
          const passed = output === tc.expectedOutput.trim();

          if (error) {
            allPassed = false;
            firstError = error;
            status = (execution.compile && execution.compile.stderr) ? 'Compilation Error' : 'Runtime Error';
            break;
          }
          if (!passed) {
            allPassed = false;
            status = 'Wrong Answer';
            // Optionally store the failing output for debugging
            firstError = `Expected "${tc.expectedOutput.trim()}" but got "${output}"`;
            break;
          }
          totalRuntime += (execution.run.time || 0);
          totalMemory += (execution.run.memory || 0);
        } catch (execErr) {
          allPassed = false;
          status = 'Internal Error';
          firstError = execErr.message;
          break;
        }
      }

      const submission = await Submission.create({
        userId: req.userId,
        challengeId: id,
        language,
        code,
        status,
        runtimeMs: totalRuntime,
        memoryKb: totalMemory,
        error: firstError
      });

      if (allPassed) {
        let userDojo = await UserDojo.findOne({ where: { userId: req.userId } });
        const newXP = userDojo.xp + (challenge.rewardXP || 50);
        const newLevel = Math.floor(newXP / 500) + 1;
        await userDojo.update({
          xp: newXP,
          level: newLevel,
          streak: (userDojo.streak || 0) + 1,
          lastSolvedAt: new Date(),
          rank: newLevel > 10 ? 'MASTER' : newLevel > 5 ? 'ELITE' : 'INITIATE'
        });
      }

      res.json({ submission, xpGained: allPassed ? (challenge.rewardXP || 50) : 0 });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async solve(req, res) {
    // Legacy support or simplified solve
    try {
      const { id } = req.params;
      const challenge = await DojoChallenge.findByPk(id);
      let userDojo = await UserDojo.findOne({ where: { userId: req.userId } });
      const newXP = userDojo.xp + challenge.rewardXP;
      const newLevel = Math.floor(newXP / 500) + 1;
      await userDojo.update({ xp: newXP, level: newLevel, streak: userDojo.streak + 1, lastSolvedAt: new Date() });
      res.json({ message: 'Success', xpGained: challenge.rewardXP });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = dojoController;
