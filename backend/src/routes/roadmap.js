const express = require('express');
const authMiddleware = require('../middleware/auth');
const roadmapController = require('../controllers/roadmapController');

const router = express.Router();

router.post('/generate', authMiddleware, roadmapController.generateRoadmap);
router.get('/', authMiddleware, roadmapController.getAllRoadmaps);
router.get('/:roadmapId', authMiddleware, roadmapController.getRoadmap);
router.put('/:roadmapId/progress', authMiddleware, roadmapController.updateProgress);

module.exports = router;