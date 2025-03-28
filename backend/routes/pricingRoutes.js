const express = require('express');
const { getPricing } = require('../controllers/pricingControllers');
const router = express.Router();

router.get('/', getPricing);

module.exports = router;
