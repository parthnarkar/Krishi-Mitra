const express = require('express');
const { getCropRecommendation } = require('../controllers/aiController');
const router = express.Router();

router.get('/recommendation/:farmerId', getCropRecommendation);

module.exports = router;
