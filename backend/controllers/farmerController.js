const Farmer = require('../models/Farmer');
const Product = require('../models/Product');

// @desc Get all farmers
// @route GET /api/farmers
// @access Public
const getFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.find().populate('products');
    res.status(200).json(farmers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch farmers', details: error.message });
  }
};

// @desc Get a single farmer by ID
// @route GET /api/farmers/:id
// @access Public
const getFarmerById = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id).populate('products');
    if (!farmer) {
      return res.status(404).json({ error: 'Farmer not found' });
    }
    res.status(200).json(farmer);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching farmer details', details: error.message });
  }
};

// @desc Create a new farmer
// @route POST /api/farmers
// @access Public
const createFarmer = async (req, res) => {
  const {
    name,
    phone,
    email,
    aadhaarNumber,
    address,
    city,
    state,
    pincode,
    language,
    bankDetails,
    profilePicture,
    landSize,
  } = req.body;

  try {
    const farmer = await Farmer.create({
      name,
      phone,
      email,
      aadhaarNumber,
      address,
      city,
      state,
      pincode,
      language,
      bankDetails,
      profilePicture,
      landSize,
    });

    res.status(201).json(farmer);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create farmer', details: error.message });
  }
};

// @desc Update farmer details
// @route PUT /api/farmers/:id
// @access Public
const updateFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!farmer) {
      return res.status(404).json({ error: 'Farmer not found' });
    }

    res.status(200).json(farmer);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update farmer details', details: error.message });
  }
};

// @desc Delete a farmer
// @route DELETE /api/farmers/:id
// @access Public
const deleteFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findByIdAndDelete(req.params.id);

    if (!farmer) {
      return res.status(404).json({ error: 'Farmer not found' });
    }

    res.status(200).json({ message: 'Farmer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete farmer', details: error.message });
  }
};

// @desc Add a product to a farmer's list
// @route POST /api/farmers/:id/add-product
// @access Public
const addProductToFarmer = async (req, res) => {
  const { productId } = req.body;

  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) {
      return res.status(404).json({ error: 'Farmer not found' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if the product is already added to the farmer
    if (farmer.products.includes(productId)) {
      return res.status(400).json({ error: 'Product is already associated with this farmer' });
    }

    // Add product to farmer's product list
    farmer.products.push(productId);
    await farmer.save();

    const updatedFarmer = await Farmer.findById(req.params.id).populate('products');
    res.status(200).json({ message: 'Product added to farmer successfully', farmer: updatedFarmer });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add product to farmer', details: error.message });
  }
};

// @desc Update farmer verification status
// @route PUT /api/farmers/:id/verify
// @access Admin
const verifyFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) {
      return res.status(404).json({ error: 'Farmer not found' });
    }

    farmer.isVerified = true;
    await farmer.save();

    res.status(200).json({ message: 'Farmer verified successfully', farmer });
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify farmer', details: error.message });
  }
};

module.exports = {
  getFarmers,
  getFarmerById,
  createFarmer,
  updateFarmer,
  deleteFarmer,
  addProductToFarmer,
  verifyFarmer,
};
