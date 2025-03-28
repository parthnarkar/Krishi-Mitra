const Product = require('../models/Product');

// Get pricing information
exports.getPricing = async (req, res) => {
  try {
    // Get average pricing by category
    const categoryPricing = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get discount information
    const discountInfo = await Product.aggregate([
      {
        $match: { discountPrice: { $exists: true, $ne: null } }
      },
      {
        $group: {
          _id: '$category',
          avgDiscount: {
            $avg: {
              $subtract: [
                '$price',
                '$discountPrice'
              ]
            }
          },
          avgDiscountPercentage: {
            $avg: {
              $multiply: [
                {
                  $divide: [
                    { $subtract: ['$price', '$discountPrice'] },
                    '$price'
                  ]
                },
                100
              ]
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get organic vs non-organic price comparison
    const organicPricing = await Product.aggregate([
      {
        $group: {
          _id: '$isOrganic',
          avgPrice: { $avg: '$price' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Format the response
    const pricing = {
      categoryPricing,
      discountInfo,
      organicPricing: {
        organic: organicPricing.find(p => p._id === true) || { avgPrice: 0, count: 0 },
        nonOrganic: organicPricing.find(p => p._id === false) || { avgPrice: 0, count: 0 }
      }
    };

    res.status(200).json(pricing);
  } catch (error) {
    console.error('Error fetching pricing:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
  
module.exports = { getPricing };
  