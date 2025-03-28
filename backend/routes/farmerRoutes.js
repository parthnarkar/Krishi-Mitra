const express = require('express');
const {
  getFarmers,
  getFarmerById,
  createFarmer,
  updateFarmer,
  deleteFarmer,
  addProductToFarmer,
  verifyFarmer,
} = require('../controllers/farmerController');

const router = express.Router();

// @route GET /api/farmers
// @desc Get all farmers
// @access Public
router.get('/', getFarmers);

// @route GET /api/farmers/:id
// @desc Get a single farmer by ID
// @access Public
router.get('/:id', getFarmerById);

// @route POST /api/farmers
// @desc Create a new farmer
// @access Public
router.post('/', createFarmer);

// @route PUT /api/farmers/:id
// @desc Update farmer details
// @access Public
router.put('/:id', updateFarmer);

// @route DELETE /api/farmers/:id
// @desc Delete a farmer
// @access Public
router.delete('/:id', deleteFarmer);

// @route POST /api/farmers/:id/add-product
// @desc Add a product to a farmer's list
// @access Public
router.post('/:id/add-product', addProductToFarmer);

// @route PUT /api/farmers/:id/verify
// @desc Verify a farmer (admin)
// @access Admin
router.put('/:id/verify', verifyFarmer);

module.exports = router;
