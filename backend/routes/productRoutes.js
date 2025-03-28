const express = require('express');
const { 
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFarmerProducts,
  addProductReview
} = require('../controllers/productController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes
router.post('/', protect, restrictTo('farmer'), createProduct);
router.put('/:id', protect, restrictTo('farmer'), updateProduct);
router.delete('/:id', protect, restrictTo('farmer'), deleteProduct);
router.get('/farmer/products', protect, restrictTo('farmer'), getFarmerProducts);
router.post('/:id/reviews', protect, restrictTo('consumer'), addProductReview);

module.exports = router; 