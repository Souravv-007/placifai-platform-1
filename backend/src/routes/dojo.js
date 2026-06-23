const express = require('express');
const dojoController = require('../controllers/dojoController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/summary', authMiddleware, dojoController.getSummary);
router.get('/:id', authMiddleware, dojoController.getChallenge);
router.post('/run/:id', authMiddleware, dojoController.run);
router.post('/submit/:id', authMiddleware, dojoController.submit);
router.post('/solve/:id', authMiddleware, dojoController.solve);

module.exports = router;
