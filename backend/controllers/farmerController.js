const Farmer = require('../models/Farmer');

// @desc Get all farmers
// @route GET /api/farmers
const getFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.find();
    res.status(200).json(farmers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Create a new farmer
// @route POST /api/farmers
const createFarmer = async (req, res) => {
  try {
    const { name, phone, address, language, products } = req.body;

    const farmer = new Farmer({
      name,
      phone,
      address,
      language,
      products,
    });

    const savedFarmer = await farmer.save();
    res.status(201).json(savedFarmer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc Get a farmer by ID
// @route GET /api/farmers/:id
const getFarmerById = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }
    res.status(200).json(farmer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Update farmer details
// @route PUT /api/farmers/:id
const updateFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }
    res.status(200).json(farmer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Delete a farmer
// @route DELETE /api/farmers/:id
const deleteFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findByIdAndDelete(req.params.id);
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }
    res.status(200).json({ message: 'Farmer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getFarmers,
  createFarmer,
  getFarmerById,
  updateFarmer,
  deleteFarmer,
};
