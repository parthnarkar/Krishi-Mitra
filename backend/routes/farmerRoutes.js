const express = require('express');
const router = express.Router();
const {
  getFarmers,
  createFarmer,
  getFarmerById,
  updateFarmer,
  deleteFarmer,
} = require('../controllers/farmerController');

// Get all farmers
router.get('/', getFarmers);

// Create a new farmer
router.post('/', createFarmer);

// Get farmer by ID
router.get('/:id', getFarmerById);

// Update farmer details
router.put('/:id', updateFarmer);

// Delete farmer
router.delete('/:id', deleteFarmer);

module.exports = router;
