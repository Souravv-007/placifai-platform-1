const Resume = require('../models/Resume');
const CareerRoadmap = require('../models/CareerRoadmap');
const InterviewSession = require('../models/InterviewSession');
const User = require('../models/User');
const { buildAnalyticsPayload, buildProgressPayload } = require('../utils/frontendData');

const analyticsController = {
  async getProgressSummary(req, res) {
    try {
      const user = await User.findByPk(req.userId);

      const latestResume = await Resume.findOne({
        where: { userId: req.userId },
        order: [['createdAt', 'DESC']]
      });

      const roadmap = await CareerRoadmap.findOne({
        where: { userId: req.userId },
        order: [['createdAt', 'DESC']]
      });

      const sessions = await InterviewSession.findAll({
        where: { userId: req.userId },
        limit: 10,
        order: [['createdAt', 'DESC']]
      });

      const resumeScore = latestResume ? Math.round(latestResume.score || 70) : 0;
      
      const phases = roadmap?.roadmap || [];
      const totalTasks = phases.flatMap(p => p.tasks || []).length;
      const completedTasks = phases.flatMap(p => p.tasks || []).filter(t => t.done).length;
      const roadmapProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      // Calculate readiness based on resume, roadmap, and interview performance
      let interviewAvg = 0;
      if (sessions.length > 0) {
        interviewAvg = sessions.reduce((acc, s) => acc + (s.ratings?.accuracy || 70), 0) / sessions.length;
      }

      const readinessPercent = Math.round((resumeScore * 0.3) + (roadmapProgress * 0.3) + (interviewAvg * 0.4));

      const payload = buildProgressPayload({
        resumeScore,
        roadmapProgress,
        readinessPercent,
        sessions,
        targetRole: user?.targetRole
      });

      res.json(payload);
    } catch (error) {
      console.error('Progress summary error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async getSummary(req, res) {
    try {
      const user = await User.findByPk(req.userId);

      const latestResume = await Resume.findOne({
        where: { userId: req.userId },
        order: [['createdAt', 'DESC']]
      });

      const roadmap = await CareerRoadmap.findOne({
        where: { userId: req.userId },
        order: [['createdAt', 'DESC']]
      });

      const sessions = await InterviewSession.findAll({
        where: { userId: req.userId },
        limit: 5,
        order: [['createdAt', 'DESC']]
      });

      const resumeScore = latestResume ? Math.round(latestResume.score || 70) : 0;
      
      const phases = roadmap?.roadmap || [];
      const totalTasks = phases.flatMap(p => p.tasks || []).length;
      const completedTasks = phases.flatMap(p => p.tasks || []).filter(t => t.done).length;
      const roadmapProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      // Average interview accuracy if available
      let interviewScore = 0;
      if (sessions.length > 0) {
        const totalAccuracy = sessions.reduce((acc, s) => acc + (s.ratings?.accuracy || 70), 0);
        interviewScore = Math.round(totalAccuracy / sessions.length);
      }

      const payload = buildAnalyticsPayload({
        resumeScore,
        roadmapProgress,
        interviewScore,
        targetRole: user?.targetRole,
        latestResume,
        roadmap
      });

      res.json(payload);
    } catch (error) {
      console.error('Analytics summary error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async getSkillGap(req, res) {
    try {
      const roadmap = await CareerRoadmap.findOne({
        where: { userId: req.userId },
        order: [['createdAt', 'DESC']]
      });
      
      const gaps = roadmap ? (roadmap.skillGaps || []) : ['System Design', 'Leadership', 'Algorithms'];
      res.json({ skillGaps: gaps });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getProgress(req, res) {
    try {
      const roadmap = await CareerRoadmap.findOne({
        where: { userId: req.userId },
        order: [['createdAt', 'DESC']]
      });

      if (!roadmap) {
        return res.json({ progress: 0, completedMilestones: 0, totalMilestones: 10 });
      }

      const phases = roadmap.roadmap || [];
      const totalTasks = phases.flatMap(p => p.tasks || []).length;
      const completedTasks = phases.flatMap(p => p.tasks || []).filter(t => t.done).length;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      res.json({ 
        progress, 
        completedMilestones: completedTasks, 
        totalMilestones: totalTasks 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getReadiness(req, res) {
    try {
      const latestResume = await Resume.findOne({
        where: { userId: req.userId },
        order: [['createdAt', 'DESC']]
      });

      const roadmap = await CareerRoadmap.findOne({
        where: { userId: req.userId },
        order: [['createdAt', 'DESC']]
      });

      const resumeScore = latestResume ? (latestResume.score || 70) : 60;
      
      const phases = roadmap?.roadmap || [];
      const totalTasks = phases.flatMap(p => p.tasks || []).length;
      const completedTasks = phases.flatMap(p => p.tasks || []).filter(t => t.done).length;
      const roadmapProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      // Weighted readiness score
      const readinessScore = Math.round((resumeScore * 0.6) + (roadmapProgress * 0.4));
      
      let level = 'Beginner';
      if (readinessScore > 85) level = 'Expert';
      else if (readinessScore > 70) level = 'Advanced';
      else if (readinessScore > 50) level = 'Intermediate';

      res.json({ readinessScore, level });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = analyticsController;