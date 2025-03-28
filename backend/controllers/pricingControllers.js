const getPricing = async (req, res) => {
    const simulatedPrice = 250;
    res.json({ price: simulatedPrice });
  };
  
  module.exports = { getPricing };
  