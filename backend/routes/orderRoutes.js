const express = require('express');
const {
  createOrder,
  getUserOrders,
  getOrderDetails,
  getFarmerOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Consumer routes
router.post('/', protect, restrictTo('consumer'), createOrder);
router.get('/user', protect, getUserOrders);

// General protected routes
router.get('/:id', protect, getOrderDetails);

// Farmer routes
router.get('/farmer', protect, restrictTo('farmer'), getFarmerOrders);

// Admin routes
router.put('/:id/status', protect, restrictTo('admin'), updateOrderStatus);

module.exports = router; 