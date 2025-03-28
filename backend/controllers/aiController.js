const axios = require('axios');

// @desc Get crop recommendations using AI model
// @route GET /api/ai/recommendation/:farmerId
// @access Public
const getCropRecommendation = async (req, res) => {
  const { farmerId } = req.params;

  try {
    // Fetch historical order data for this farmer
    const orders = await Order.find({ 'products.farmer': farmerId }).populate('products.product');
    const weatherData = await getWeatherData(farmerId); // Call weather API
    const soilData = await getSoilData(farmerId); // Dummy soil API

    // Prepare payload for AI model
    const modelPayload = {
      orders,
      weatherData,
      soilData,
    };

    // Call Flask AI Model
    const aiResponse = await axios.post('http://localhost:5000/predict', modelPayload);

    res.status(200).json({
      success: true,
      recommendedCrops: aiResponse.data.recommendations,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get crop recommendations' });
  }
};

module.exports = { getCropRecommendation };
