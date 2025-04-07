const express = require('express');
const {
  createOrder,
  getUserOrders,
  getOrderDetails,
  getFarmerOrders,
  updateOrderStatus,
  getOrderById
} = require('../controllers/orderController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes (for demo purposes)
router.post('/', createOrder);
router.patch('/:id/status', updateOrderStatus);

// Protected routes
// Consumer routes
router.get('/user', protect, getUserOrders);
// router.post('/', protect, restrictTo('consumer'), createOrder);

// General protected routes
// router.get('/:id', protect, getOrderDetails);

// Farmer routes
// router.get('/farmer', protect, restrictTo('farmer'), getFarmerOrders);

// Admin routes
// router.put('/:id/status', protect, restrictTo('admin'), updateOrderStatus);

// This should be last to avoid catching other routes
router.get('/:id', getOrderById);

module.exports = router; 