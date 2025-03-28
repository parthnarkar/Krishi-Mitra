const Order = require('../models/Order');
const Product = require('../models/Product');
const Farmer = require('../models/Farmer');

// @desc Get sales report by farmer
// @route GET /api/reports/sales/:farmerId
// @access Public
const getSalesReportByFarmer = async (req, res) => {
  try {
    const { farmerId } = req.params;

    // Fetch all products from the specified farmer
    const products = await Product.find({ farmer: farmerId });
    const productIds = products.map((product) => product._id);

    // Fetch orders containing the farmer's products
    const orders = await Order.find({
      'products.product': { $in: productIds },
    }).populate('products.product', 'name pricePerKg');

    // Generate sales summary
    let totalSales = 0;
    const salesData = orders.map((order) => {
      const productDetails = order.products.map((item) => ({
        productName: item.product.name,
        quantity: item.quantity,
        totalPrice: item.quantity * item.product.pricePerKg,
      }));

      const orderTotal = productDetails.reduce((acc, item) => acc + item.totalPrice, 0);
      totalSales += orderTotal;

      return {
        orderId: order._id,
        buyerName: order.buyerName,
        productDetails,
        orderTotal,
        status: order.status,
        date: order.createdAt,
      };
    });

    res.status(200).json({
      totalSales,
      totalOrders: orders.length,
      salesData,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate sales report' });
  }
};

// @desc Get available stock report for all products
// @route GET /api/reports/stock
// @access Public
const getStockReport = async (req, res) => {
  try {
    // Fetch all products with stock information
    const products = await Product.find().populate('farmer', 'name phone');

    // Generate stock report data
    const stockData = products.map((product) => ({
      productName: product.name,
      category: product.category,
      stock: product.stock, // ✅ No separate stock database, using Product schema
      pricePerKg: product.pricePerKg,
      farmer: {
        name: product.farmer.name,
        phone: product.farmer.phone,
      },
    }));

    res.status(200).json({
      totalProducts: products.length,
      stockData,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate stock report' });
  }
};

// @desc Get order summary report
// @route GET /api/reports/orders
// @access Public
const getOrderSummaryReport = async (req, res) => {
  try {
    // Fetch all orders and populate product details
    const orders = await Order.find().populate('products.product', 'name pricePerKg');

    // Generate order summary
    const orderSummary = orders.map((order) => {
      const productDetails = order.products.map((item) => ({
        productName: item.product.name,
        quantity: item.quantity,
        totalPrice: item.quantity * item.product.pricePerKg,
      }));

      const orderTotal = productDetails.reduce((acc, item) => acc + item.totalPrice, 0);

      return {
        orderId: order._id,
        buyerName: order.buyerName,
        productDetails,
        orderTotal,
        status: order.status,
        date: order.createdAt,
      };
    });

    res.status(200).json({
      totalOrders: orders.length,
      orderSummary,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate order report' });
  }
};

module.exports = {
  getSalesReportByFarmer,
  getStockReport,
  getOrderSummaryReport,
};
