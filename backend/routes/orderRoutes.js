const express = require('express');
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/orderController');

const router = express.Router();

// Routes for CRUD operations on orders
router.route('/')
  .get(getOrders)
  .post(createOrder);

router.route('/:id')
  .get(getOrderById)
  .put(updateOrderStatus)
  .delete(deleteOrder);

module.exports = router;
