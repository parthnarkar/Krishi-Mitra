const User = require('../models/User');
const Product = require('../models/Product');

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, phoneNumber, address, city, state, postalCode, farmName, farmLocation, farmDescription, productsGrown } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (address) updateData.address = address;
    if (city) updateData.city = city;
    if (state) updateData.state = state;
    if (postalCode) updateData.postalCode = postalCode;
    
    // Update farmer-specific fields if user is a farmer
    const user = await User.findById(req.user.id);
    if (user.role === 'farmer') {
      if (farmName) updateData.farmName = farmName;
      if (farmLocation) updateData.farmLocation = farmLocation;
      if (farmDescription) updateData.farmDescription = farmDescription;
      if (productsGrown) updateData.productsGrown = productsGrown;
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true }
    ).select('-password');
    
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    // Validate product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if there's enough stock
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }
    
    // Get user and their cart
    const user = await User.findById(req.user.id);
    
    // Check if product already in cart
    const existingCartItem = user.cart.find(
      item => item.productId.toString() === productId
    );
    
    if (existingCartItem) {
      // Update quantity if product already in cart
      existingCartItem.quantity = quantity;
    } else {
      // Add new product to cart
      user.cart.push({ productId, quantity });
    }
    
    await user.save();
    
    // Return updated cart with populated product details
    const populatedUser = await User.findById(req.user.id).populate({
      path: 'cart.productId',
      select: 'name price image stock'
    });
    
    res.status(200).json(populatedUser.cart);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Find user and update cart
    const user = await User.findById(req.user.id);
    
    user.cart = user.cart.filter(
      item => item.productId.toString() !== productId
    );
    
    await user.save();
    
    // Return updated cart with populated product details
    const populatedUser = await User.findById(req.user.id).populate({
      path: 'cart.productId',
      select: 'name price image stock'
    });
    
    res.status(200).json(populatedUser.cart);
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get cart
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'cart.productId',
      select: 'name price image stock'
    });
    
    res.status(200).json(user.cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    // Find user and clear their cart
    const user = await User.findById(req.user.id);
    
    // Empty the cart array
    user.cart = [];
    await user.save();
    
    res.status(200).json({ message: 'Cart cleared successfully', cart: [] });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    
    // Validate product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const user = await User.findById(req.user.id);
    
    // Check if product already in wishlist
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }
    
    // Add to wishlist
    user.wishlist.push(productId);
    await user.save();
    
    // Return populated wishlist
    const populatedUser = await User.findById(req.user.id).populate({
      path: 'wishlist',
      select: 'name price image'
    });
    
    res.status(200).json(populatedUser.wishlist);
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const user = await User.findById(req.user.id);
    
    // Remove from wishlist
    user.wishlist = user.wishlist.filter(
      item => item.toString() !== productId
    );
    
    await user.save();
    
    // Return populated wishlist
    const populatedUser = await User.findById(req.user.id).populate({
      path: 'wishlist',
      select: 'name price image'
    });
    
    res.status(200).json(populatedUser.wishlist);
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get wishlist
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'wishlist',
      select: 'name price image'
    });
    
    res.status(200).json(user.wishlist);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 