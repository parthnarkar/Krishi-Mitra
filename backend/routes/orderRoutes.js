const express = require('express');
const {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/orderController');

const router = express.Router();

// Create a new order
router.post('/', createOrder);

// Get all orders
router.get('/', getAllOrders);

// Get a specific order by ID
router.get('/:id', getOrderById);

// Update order status
router.put('/:id', updateOrderStatus);

// Delete an order
router.delete('/:id', deleteOrder);

module.exports = router;
