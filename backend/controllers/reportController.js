const Order = require('../models/Order');

// Get Order Reports: Group orders by status and calculate total orders and revenue
const getOrderReports = async (req, res) => {
  try {
    const report = await Order.aggregate([
      {
        $group: {
          _id: "$status", // Group by order status
          totalOrders: { $sum: 1 }, // Count orders in each group
          totalRevenue: { $sum: "$totalAmount" } // Sum totalAmount for each group
        }
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          totalOrders: 1,
          totalRevenue: 1
        }
      }
    ]);
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getOrderReports };

