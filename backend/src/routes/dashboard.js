
const express = require('express');
const auth = require('../middleware/auth');
const controller = require('../controllers/dashboardController');
const router = express.Router();

router.get('/summary', auth, controller.getSummary);
module.exports = router;
