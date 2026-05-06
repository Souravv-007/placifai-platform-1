const express = require('express');
const authMiddleware = require('../middleware/auth');
const analyticsController = require('../controllers/analyticsController');

const router = express.Router();

router.get('/summary', authMiddleware, analyticsController.getSummary);
router.get('/skill-gap', authMiddleware, analyticsController.getSkillGap);
router.get('/progress', authMiddleware, analyticsController.getProgress);
router.get('/readiness', authMiddleware, analyticsController.getReadiness);

module.exports = router;
