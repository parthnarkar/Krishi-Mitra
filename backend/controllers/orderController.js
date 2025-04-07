const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { customerInfo, items, totalAmount } = req.body;

    // Validate required fields
    if (!customerInfo || !items || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: customerInfo, items, and totalAmount are required'
      });
    }

    // Validate customer info
    const { name, email, phone, address } = customerInfo;
    if (!name || !email || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: 'Missing required customer information'
      });
    }

    // Validate items
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }

    // Create order with validated data
    const order = new Order({
      customerInfo,
      items,
      totalAmount,
      paymentStatus: 'pending',
      orderStatus: 'processing'
    });

    await order.save();
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// Get all orders for a user
exports.getUserOrders = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user.email) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const orders = await Order.find({ 'customerInfo.email': req.user.email })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};

// Get single order details
exports.getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }
    
    // Check if the user is the owner of the order or a farmer with products in the order
    const isBuyer = order.customerInfo.email === req.user.email;
    
    if (!isBuyer && req.user.role !== 'admin') {
      // Check if the user is a farmer with products in this order
      const user = await User.findById(req.user.id);
      if (user.role === 'farmer') {
        const farmerHasProducts = order.items.some(item => 
          item.farmerId.toString() === req.user.id
        );
        
        if (!farmerHasProducts) {
          return res.status(403).json({ 
            success: false,
            message: 'You are not authorized to view this order' 
          });
        }
      } else {
        return res.status(403).json({ 
          success: false,
          message: 'You are not authorized to view this order' 
        });
      }
    }
    
    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};

// Get orders for farmer's products
exports.getFarmerOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      'items.farmerId': req.user.id
    }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Error fetching farmer orders:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: req.body.status },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
}; 