/**
 * Utility functions for Bulk Buy API operations
 */

const axios = require('axios');

/**
 * Calculate bulk discount based on product type and quantity
 * 
 * @param {String} productType - Type of product
 * @param {Number} quantity - Quantity of product
 * @param {Number} basePrice - Base price per unit
 * @returns {Object} - Discount information
 */
const calculateBulkDiscount = (productType, quantity, basePrice) => {
  let discountPercentage = 0;
  
  // Base discount tiers
  if (quantity >= 10 && quantity < 50) {
    discountPercentage = 5;
  } else if (quantity >= 50 && quantity < 100) {
    discountPercentage = 10;
  } else if (quantity >= 100 && quantity < 500) {
    discountPercentage = 15;
  } else if (quantity >= 500) {
    discountPercentage = 20;
  }
  
  // Modify discount based on product type
  switch (productType.toLowerCase()) {
    case 'perishable':
      // Higher discount for perishables to move inventory
      discountPercentage += 2;
      break;
    case 'seasonal':
      // Higher discount for seasonal products at end of season
      discountPercentage += 5;
      break;
    case 'premium':
      // Lower discount for premium products
      discountPercentage -= 2;
      break;
    default:
      // No adjustment
      break;
  }
  
  // Calculate final discounted price
  const discountAmount = (basePrice * discountPercentage) / 100;
  const discountedPrice = basePrice - discountAmount;
  
  return {
    originalPrice: basePrice,
    discountPercentage,
    discountAmount,
    finalPrice: discountedPrice,
    totalPrice: discountedPrice * quantity
  };
};

/**
 * Generate suggested counter offer amounts
 * 
 * @param {Number} originalPrice - Original price per unit
 * @param {Number} offeredPrice - Buyer's offered price per unit
 * @param {Number} quantity - Quantity of product
 * @returns {Object} - Suggested counter offer information
 */
const suggestCounterOffers = (originalPrice, offeredPrice, quantity) => {
  // Calculate minimum acceptable price (70% of original)
  const minimumPrice = originalPrice * 0.7;
  
  // If offered price is below minimum, suggest three options
  if (offeredPrice < minimumPrice) {
    // Calculate percentages between minimum and original prices
    const range = originalPrice - minimumPrice;
    
    return {
      isAcceptable: false,
      minimumAcceptablePrice: minimumPrice,
      suggestedCounters: [
        {
          price: minimumPrice,
          totalAmount: minimumPrice * quantity,
          discount: Math.round(((originalPrice - minimumPrice) / originalPrice) * 100),
          recommendation: 'Minimum acceptable price'
        },
        {
          price: minimumPrice + (range * 0.3),
          totalAmount: (minimumPrice + (range * 0.3)) * quantity,
          discount: Math.round(((originalPrice - (minimumPrice + (range * 0.3))) / originalPrice) * 100),
          recommendation: 'Recommended counter offer'
        },
        {
          price: minimumPrice + (range * 0.6),
          totalAmount: (minimumPrice + (range * 0.6)) * quantity,
          discount: Math.round(((originalPrice - (minimumPrice + (range * 0.6))) / originalPrice) * 100),
          recommendation: 'Ideal counter offer'
        }
      ]
    };
  }
  
  // If price is acceptable, provide confirmation
  return {
    isAcceptable: true,
    acceptedPrice: offeredPrice,
    totalAmount: offeredPrice * quantity,
    discount: Math.round(((originalPrice - offeredPrice) / originalPrice) * 100),
    recommendation: 'This offer is acceptable'
  };
};

/**
 * Check transportation logistics for bulk orders
 * 
 * @param {Number} quantity - Quantity of product
 * @param {String} productType - Type of product
 * @param {String} location - Delivery location
 * @returns {Object} - Logistics information
 */
const checkBulkTransportation = (quantity, productType, location) => {
  // Determine transportation requirements based on product type and quantity
  let transportType = 'truck';
  let vehiclesRequired = 1;
  let estimatedDays = 2;
  
  // Determine refrigeration needs
  const needsRefrigeration = ['perishable', 'dairy', 'meat', 'fruits'].includes(productType.toLowerCase());
  
  // Calculate vehicles needed based on quantity (assume 1 truck = 10 units)
  vehiclesRequired = Math.ceil(quantity / 10);
  
  // Adjust delivery time based on quantity and location
  if (quantity > 50) {
    estimatedDays += 1;
  }
  if (quantity > 100) {
    estimatedDays += 1;
    // For very large orders, suggest rail transport
    transportType = 'rail';
  }
  
  // Mock distance calculation
  const distance = Math.floor(Math.random() * 800) + 200; // Random distance between 200-1000km
  
  return {
    transportType,
    vehiclesRequired,
    estimatedDays,
    needsRefrigeration,
    distance,
    estimatedCost: calculateTransportCost(distance, vehiclesRequired, needsRefrigeration),
    specialRequirements: needsRefrigeration ? 'Refrigerated transport required' : 'Standard transport'
  };
};

/**
 * Helper to calculate transport cost
 * @private
 */
const calculateTransportCost = (distance, vehicles, refrigeration) => {
  const baseCost = distance * 10; // Rs. 10 per km
  const vehicleCost = baseCost * vehicles;
  const refrigerationCost = refrigeration ? vehicleCost * 0.3 : 0; // 30% extra for refrigeration
  
  return vehicleCost + refrigerationCost;
};

module.exports = {
  calculateBulkDiscount,
  suggestCounterOffers,
  checkBulkTransportation
}; 