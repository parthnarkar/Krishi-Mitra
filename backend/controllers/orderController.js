const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc Get all orders
// @route GET /api/orders
// @access Public
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('products.product');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// @desc Get a single order by ID
// @route GET /api/orders/:id
// @access Public
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('products.product');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching order details' });
  }
};

// @desc Create a new order
// @route POST /api/orders
// @access Public
const createOrder = async (req, res) => {
  const {
    deliveryAddress,
    products,
    totalAmount,
    paymentMethod,
    paymentStatus,
    orderNotes,
  } = req.body;

  try {
    // Check if all products exist and update stock
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ error: `Product with ID ${item.product} not found` });
      }
      if (item.quantity > product.stock) {
        return res.status(400).json({ error: `Insufficient stock for product: ${product.name}` });
      }

      // Reduce product stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Create the order
    const order = await Order.create({
      deliveryAddress,
      products,
      totalAmount,
      paymentMethod,
      paymentStatus,
      orderNotes,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create order', details: error.message });
  }
};

// @desc Update order status and payment status
// @route PUT /api/orders/:id
// @access Public
const updateOrderStatus = async (req, res) => {
  const { status, paymentStatus } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, paymentStatus },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update order', details: error.message });
  }
};

// @desc Delete an order
// @route DELETE /api/orders/:id
// @access Public
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete order' });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
};
