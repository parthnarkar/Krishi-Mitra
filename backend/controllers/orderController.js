const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { shippingInfo, totalAmount } = req.body;
    
    // Get user with populated cart
    const user = await User.findById(req.user.id).populate({
      path: 'cart.productId',
      select: 'name price image farmerId stock'
    });
    
    if (user.cart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    // Format products for order
    const orderProducts = user.cart.map(item => {
      return {
        productId: item.productId._id,
        name: item.productId.name,
        quantity: item.quantity,
        price: item.productId.price,
        image: item.productId.image
      };
    });
    
    // Create new order
    const order = new Order({
      userId: req.user.id,
      products: orderProducts,
      shippingInfo,
      totalAmount
    });
    
    // Update product stock
    for (const item of user.cart) {
      const product = await Product.findById(item.productId._id);
      product.stock -= item.quantity;
      await product.save();
    }
    
    // Clear user cart
    user.cart = [];
    await user.save();
    
    // Save order
    await order.save();
    
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all orders for a user
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single order details
exports.getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if the user is the owner of the order or a farmer with products in the order
    const isBuyer = order.userId.toString() === req.user.id;
    
    if (!isBuyer && req.user.role !== 'admin') {
      // Check if the user is a farmer with products in this order
      const user = await User.findById(req.user.id);
      if (user.role === 'farmer') {
        const farmerHasProducts = await Product.exists({
          farmerId: req.user.id,
          _id: { $in: order.products.map(p => p.productId) }
        });
        
        if (!farmerHasProducts) {
          return res.status(403).json({ message: 'You are not authorized to view this order' });
        }
      } else {
        return res.status(403).json({ message: 'You are not authorized to view this order' });
      }
    }
    
    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get orders for farmer's products
exports.getFarmerOrders = async (req, res) => {
  try {
    // Get all products by the farmer
    const farmerProducts = await Product.find({ farmerId: req.user.id });
    const productIds = farmerProducts.map(product => product._id);
    
    // Find orders containing these products
    const orders = await Order.find({
      'products.productId': { $in: productIds }
    }).sort({ createdAt: -1 });
    
    // Filter out products that are not from this farmer
    const filteredOrders = orders.map(order => {
      const filteredOrder = { ...order.toObject() };
      filteredOrder.products = filteredOrder.products.filter(
        product => productIds.some(id => id.equals(product.productId))
      );
      return filteredOrder;
    });
    
    res.status(200).json(filteredOrders);
  } catch (error) {
    console.error('Error fetching farmer orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { deliveryStatus, paymentStatus } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can update order status' });
    }
    
    if (deliveryStatus) order.deliveryStatus = deliveryStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    
    await order.save();
    
    res.status(200).json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 