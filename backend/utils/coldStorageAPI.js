/**
 * Utility functions for Cold Storage API operations
 */

const axios = require('axios');

/**
 * Calculate delivery estimate based on location, quantity, and transportation type
 * 
 * @param {Object} location - Coordinates of delivery location
 * @param {Number} quantity - Quantity of produce in tons
 * @param {String} transportType - Type of transport (road, rail, air)
 * @returns {Object} - Delivery time estimate and cost
 */
const calculateDeliveryEstimate = (location, quantity, transportType) => {
  // Base delivery times (in days)
  const baseDeliveryTimes = {
    road: 2,
    rail: 3,
    air: 1
  };

  // Base costs per ton per km
  const baseCosts = {
    road: 5,
    rail: 3,
    air: 15
  };

  // Mock distance calculation (would use actual geo-calculation in production)
  const distance = Math.floor(Math.random() * 500) + 100; // Random distance between 100-600km
  
  // Calculate delivery time based on transport type
  let deliveryTime = baseDeliveryTimes[transportType];
  
  // Adjust time based on quantity (larger quantities take longer)
  if (quantity > 10) {
    deliveryTime += 1;
  }
  if (quantity > 20) {
    deliveryTime += 1;
  }
  
  // Calculate cost based on distance, quantity, and transport type
  const cost = baseCosts[transportType] * distance * quantity;
  
  return {
    estimatedDays: deliveryTime,
    estimatedCost: cost,
    distance: distance
  };
};

/**
 * Fetch nearest cold storage facilities based on coordinates
 * 
 * @param {Object} coordinates - Lat/long coordinates
 * @param {Number} radius - Search radius in km
 * @returns {Array} - Array of nearby facilities
 */
const findNearbyColdStorage = async (coordinates, radius = 50) => {
  try {
    // In a real implementation, this would call a geocoding service
    // For demo purposes, we're returning mock data
    
    const mockFacilities = [
      {
        id: '1',
        name: 'FrostFresh Storage',
        location: 'Mumbai, Maharashtra',
        coordinates: { lat: 19.0760, lng: 72.8777 },
        distance: Math.floor(Math.random() * 30) + 5,
        capacity: 500,
        available: 350,
        temperature: -5,
        pricePerTonPerDay: 120
      },
      {
        id: '2',
        name: 'Himalaya Cold Chain',
        location: 'Pune, Maharashtra',
        coordinates: { lat: 18.5204, lng: 73.8567 },
        distance: Math.floor(Math.random() * 30) + 5,
        capacity: 800,
        available: 200,
        temperature: -10,
        pricePerTonPerDay: 150
      },
      {
        id: '3',
        name: 'Arctic Storage Solutions',
        location: 'Nagpur, Maharashtra',
        coordinates: { lat: 21.1458, lng: 79.0882 },
        distance: Math.floor(Math.random() * 30) + 5,
        capacity: 1200,
        available: 900,
        temperature: -20,
        pricePerTonPerDay: 180
      }
    ];
    
    // Sort by distance (would actually use coordinates in real implementation)
    return mockFacilities.sort((a, b) => a.distance - b.distance);
  } catch (error) {
    console.error('Error finding nearby cold storage facilities:', error);
    throw error;
  }
};

/**
 * Check cold storage availability for the given quantity and duration
 * 
 * @param {String} storageId - ID of cold storage facility
 * @param {Number} quantity - Required storage quantity in tons
 * @param {Number} duration - Duration in days
 * @returns {Object} - Availability information
 */
const checkAvailability = async (storageId, quantity, duration) => {
  try {
    // In a real implementation, this would query a database
    // For demo purposes, we're returning mock data
    
    const available = Math.random() > 0.2; // 80% chance availability is true
    const alternativeDates = [];
    
    // If not available, suggest alternative dates
    if (!available) {
      const today = new Date();
      for (let i = 1; i <= 3; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i * 3); // Suggest dates every 3 days
        alternativeDates.push(date);
      }
    }
    
    return {
      available,
      requestedQuantity: quantity,
      requestedDuration: duration,
      alternativeDates: available ? [] : alternativeDates,
      estimatedCost: quantity * duration * (Math.floor(Math.random() * 50) + 100) // Random price between 100-150 per ton per day
    };
  } catch (error) {
    console.error('Error checking cold storage availability:', error);
    throw error;
  }
};

module.exports = {
  calculateDeliveryEstimate,
  findNearbyColdStorage,
  checkAvailability
}; 