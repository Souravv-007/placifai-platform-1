const Resume = require('../models/Resume');
const CareerRoadmap = require('../models/CareerRoadmap');
const InterviewSession = require('../models/InterviewSession');
const { buildDashboardPayload } = require('../utils/frontendData');
const User = require('../models/User');

const dashboardController = {
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
        limit: 3,
        order: [['createdAt', 'DESC']]
      });

      const resumeScore = latestResume ? Math.round(latestResume.score || 70) : 0;
      
      const phases = roadmap?.roadmap || [];
      const totalTasks = phases.flatMap(p => p.tasks || []).length;
      const completedTasks = phases.flatMap(p => p.tasks || []).filter(t => t.done).length;
      const roadmapProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      const readinessPercent = Math.round((resumeScore * 0.6) + (roadmapProgress * 0.4));

      // Build recent activity list
      const recentActivity = [];
      if (sessions.length > 0) {
        sessions.forEach(s => {
          recentActivity.push({
            type: 'practice',
            name: `Completed ${s.company} Mock Session`,
            meta: `Accuracy: ${s.ratings?.accuracy || 0}% • ${new Date(s.createdAt).toLocaleDateString()}`
          });
        });
      }

      if (latestResume) {
        recentActivity.push({
          type: 'resume',
          name: 'Resume Analysis Updated',
          meta: `ATS Score: ${resumeScore}/100 • ${new Date(latestResume.createdAt).toLocaleDateString()}`
        });
      }

      const payload = buildDashboardPayload({
        user,
        resumeScore,
        roadmapProgress,
        readinessPercent,
        nextLesson: roadmap?.nextLesson || 'System Design Fundamentals',
        recentActivity: recentActivity.slice(0, 3)
      });

      res.json(payload);
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = dashboardController;