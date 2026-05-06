
const express = require('express');
const auth = require('../middleware/auth');
const controller = require('../controllers/companyPrepController');
const router = express.Router();

router.get('/', auth, controller.getCompanies);
router.get('/:companyId', auth, controller.getCompanyDetail);
module.exports = router;
