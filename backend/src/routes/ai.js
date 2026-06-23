const express = require('express');
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/ask', authMiddleware, aiController.ask);
router.post('/explain-code', authMiddleware, aiController.explainCode);
router.post('/get-solution', authMiddleware, aiController.getSolution);

module.exports = router;
