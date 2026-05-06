const express = require('express');
const authMiddleware = require('../middleware/auth');
const analyticsController = require('../controllers/analyticsController');

const router = express.Router();

router.get('/summary', authMiddleware, analyticsController.getProgressSummary);

module.exports = router;
