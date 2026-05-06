const express = require('express');
const authMiddleware = require('../middleware/auth');
const interviewController = require('../controllers/interviewController');

const router = express.Router();

router.post('/questions', authMiddleware, interviewController.getQuestions);
router.post('/answer', authMiddleware, interviewController.submitAnswer);
router.get('/history', authMiddleware, interviewController.getHistory);

module.exports = router;