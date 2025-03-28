const express = require('express');
const {
  getSalesReportByFarmer,
  getStockReport,
  getOrderSummaryReport,
} = require('../controllers/reportController');

const router = express.Router();

// Get sales report by farmer ID
router.get('/sales/:farmerId', getSalesReportByFarmer);

// Get stock report for all products (using Product schema)
router.get('/stock', getStockReport);

// Get order summary report
router.get('/orders', getOrderSummaryReport);

module.exports = router;
