const Product = require('../models/Product');
const Farmer = require('../models/Farmer');

// @desc Get all products
// @route GET /api/products
// @access Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('farmer', 'name phone');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products', details: error.message });
  }
};

// @desc Get a single product by ID
// @route GET /api/products/:id
// @access Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('farmer', 'name phone');
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching product details', details: error.message });
  }
};

// @desc Create a new product
// @route POST /api/products
// @access Public
const createProduct = async (req, res) => {
  const {
    name,
    category,
    pricePerKg,
    stock,
    unit,
    description,
    isAvailable,
    farmer,
  } = req.body;

  try {
    // Check if the farmer exists
    const existingFarmer = await Farmer.findById(farmer);
    if (!existingFarmer) {
      return res.status(404).json({ error: 'Farmer not found' });
    }

    // Create a new product
    const product = await Product.create({
      name,
      category,
      pricePerKg,
      stock,
      unit,
      description,
      isAvailable,
      farmer,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create product', details: error.message });
  }
};

// @desc Update product details
// @route PUT /api/products/:id
// @access Public
const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update fields dynamically based on the request body
    const updateFields = req.body;
    product = await Product.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update product', details: error.message });
  }
};

// @desc Delete a product
// @route DELETE /api/products/:id
// @access Public
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product', details: error.message });
  }
};

// @desc Check product stock availability
// @route POST /api/products/:id/check-stock
// @access Public
const checkStockAvailability = async (req, res) => {
  try {
    const { quantity } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Use the schema method to check stock availability
    const isAvailable = product.checkStockAvailability(quantity);

    res.status(200).json({
      productId: product._id,
      isAvailable,
      availableStock: product.stock,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error checking stock availability', details: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  checkStockAvailability,
};
