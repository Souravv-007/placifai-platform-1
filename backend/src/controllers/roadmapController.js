const CareerRoadmap = require('../models/CareerRoadmap');
const Resume = require('../models/Resume');
const openRouterService = require('../services/openRouterService');
const { updateRoadmapTask } = require('../utils/frontendData');

const roadmapController = {
  async generateRoadmap(req, res) {
    console.log('--- Generate Roadmap Started ---');
    try {
      const { targetRole, experience, currentSkills } = req.body;
      console.log('Request body:', { targetRole, experience, currentSkills });

      const userProfile = {
        targetRole: targetRole || 'Senior Software Engineer',
        experience: experience || 'mid',
        currentSkills: currentSkills || [],
      };

      // Fetch user's latest resume for context
      const latestResume = await Resume.findOne({
        where: { userId: req.userId },
        order: [['createdAt', 'DESC']]
      });

      console.log('Calling OpenRouter for roadmap generation...');
      const roadmap = await openRouterService.generateCareerRoadmap(
        userProfile, 
        latestResume?.rawText,
        latestResume?.analysis
      );
      console.log('Roadmap generated from service:', !!roadmap);

      console.log('Saving roadmap to database for user:', req.userId);
      const saved = await CareerRoadmap.create({
        userId: req.userId,
        targetRole: userProfile.targetRole,
        currentLevel: userProfile.experience,
        roadmap: roadmap.phases || [],
        milestones: roadmap,
        skillGaps: roadmap.skillGaps || [],
      });

      console.log('Roadmap saved with ID:', saved.id);
      res.json(saved);
    } catch (error) {
      console.error('Roadmap Controller Error (generate):', error);
      res.status(500).json({ error: error.message });
    }
  },

  async getRoadmap(req, res) {
    try {
      const { roadmapId } = req.params;
      const roadmap = await CareerRoadmap.findByPk(roadmapId);

      if (!roadmap || roadmap.userId !== req.userId) {
        return res.status(404).json({ error: 'Roadmap not found' });
      }

      res.json(roadmap);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  async getAllRoadmaps(req, res) {
    try {
      console.log('Fetching all roadmaps for user:', req.userId);
      const roadmaps = await CareerRoadmap.findAll({
        where: { userId: req.userId },
        order: [['createdAt', 'DESC']],
      });
      console.log('Found roadmaps:', roadmaps.length);
      res.json(roadmaps);
    } catch (error) {
      console.error('Roadmap Controller Error (getAll):', error);
      res.status(500).json({ error: error.message });
    }
  },

  async updateProgress(req, res) {
    try {
      const { roadmapId } = req.params;
      const { phaseIndex, taskIndex, completed } = req.body;

      const roadmap = await CareerRoadmap.findOne({
        where: { id: roadmapId, userId: req.userId }
      });

      if (!roadmap) {
        return res.status(404).json({ error: 'Roadmap not found' });
      }

      const sourcePayload = roadmap.milestones?.phases?.length
        ? roadmap.milestones
        : {
            phases: roadmap.roadmap || [],
            skillGaps: roadmap.skillGaps || [],
          };

      const updatedPayload = updateRoadmapTask(
        sourcePayload,
        Number(phaseIndex),
        Number(taskIndex),
        Boolean(completed)
      );

      await roadmap.update({
        roadmap: updatedPayload.phases || roadmap.roadmap,
        milestones: updatedPayload,
        skillGaps: updatedPayload.skillGaps || roadmap.skillGaps,
      });

      res.json(updatedPayload);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = roadmapController;