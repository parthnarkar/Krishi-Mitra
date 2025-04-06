const express = require('express');
const {
  getUserProfile,
  updateUserProfile,
  addToCart,
  removeFromCart,
  getCart,
  clearCart,
  addToWishlist,
  removeFromWishlist,
  getWishlist
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Profile routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Cart routes
router.get('/cart', protect, getCart);
router.post('/cart', protect, addToCart);
router.put('/cart/:productId', protect, addToCart);
router.delete('/cart/:productId', protect, removeFromCart);
router.delete('/cart', protect, clearCart);

// Wishlist routes
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist', protect, addToWishlist);
router.delete('/wishlist/:productId', protect, removeFromWishlist);

module.exports = router; 