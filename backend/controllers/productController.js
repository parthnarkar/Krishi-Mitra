const Product = require('../models/Product');
const User = require('../models/User');

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, isOrganic, sortBy } = req.query;
    
    let query = {};
    
    // Apply filters
    if (category) query.category = category;
    if (isOrganic === 'true') query.isOrganic = true;
    if (search) query.name = { $regex: search, $options: 'i' };
    if (minPrice && maxPrice) {
      query.price = { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) };
    } else if (minPrice) {
      query.price = { $gte: parseFloat(minPrice) };
    } else if (maxPrice) {
      query.price = { $lte: parseFloat(maxPrice) };
    }

    // Apply sorting
    let sortOptions = {};
    if (sortBy === 'price-asc') sortOptions.price = 1;
    else if (sortBy === 'price-desc') sortOptions.price = -1;
    else if (sortBy === 'newest') sortOptions.createdAt = -1;
    else if (sortBy === 'rating') sortOptions.rating = -1;
    else sortOptions.createdAt = -1; // Default sort by newest

    const products = await Product.find(query)
      .sort(sortOptions)
      .populate('farmerId', 'name farmName farmLocation');
    
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('farmerId', 'name farmName farmLocation farmDescription');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new product (farmers only)
exports.createProduct = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user.role !== 'farmer') {
      return res.status(403).json({ message: 'Only farmers can create products' });
    }
    
    const { name, description, price, category, image, stock, isOrganic, discountPrice } = req.body;
    
    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      category,
      image,
      stock,
      isOrganic,
      farmerId: req.user.id
    });
    
    await product.save();
    
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a product (farmers only)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if the user is the owner of the product
    if (product.farmerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to update this product' });
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a product (farmers only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if the user is the owner of the product
    if (product.farmerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this product' });
    }
    
    await Product.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get farmer products
exports.getFarmerProducts = async (req, res) => {
  try {
    const products = await Product.find({ farmerId: req.user.id });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching farmer products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a review to a product
exports.addProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      (r) => r.userId.toString() === req.user.id
    );
    
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }
    
    const review = {
      userId: req.user.id,
      rating: Number(rating),
      comment
    };
    
    product.reviews.push(review);
    
    // Update product rating
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
    
    await product.save();
    
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 