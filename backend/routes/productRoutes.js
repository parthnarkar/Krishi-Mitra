const express = require('express');
const { getProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');

const router = express.Router();

// Route for getting all products and adding a new product
router.route('/')
  .get(getProducts)
  .post(createProduct);

// Routes for updating and deleting a product by ID
router.route('/:id')
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;
