const express = require('express');
const { getOrderReports } = require('../controllers/reportController');
const router = express.Router();

// GET /api/reports/orders - Fetch order reports
router.get('/orders', getOrderReports);

module.exports = router;
