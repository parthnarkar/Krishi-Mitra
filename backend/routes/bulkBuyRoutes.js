const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createBulkNegotiation,
  getBuyerNegotiations,
  getSellerNegotiations,
  getNegotiationById,
  updateNegotiationStatus,
  submitCounterOffer,
  acceptCounterOffer,
  calculateBulkDiscount,
  suggestCounterOffers,
  checkBulkTransportation
} = require('../controllers/bulkBuyController');

// Public routes
router.get('/calculate-discount', calculateBulkDiscount);

// Protected routes for all authenticated users
router.post('/', protect, createBulkNegotiation);
router.get('/buyer', protect, getBuyerNegotiations);
router.get('/seller', protect, getSellerNegotiations);
router.get('/:id', protect, getNegotiationById);
router.put('/:id/status', protect, updateNegotiationStatus);
router.put('/:id/counter-offer', protect, submitCounterOffer);
router.put('/:id/accept-counter', protect, acceptCounterOffer);
router.get('/suggest-counter/:negotiationId', protect, suggestCounterOffers);
router.get('/check-transportation', protect, checkBulkTransportation);

module.exports = router; 