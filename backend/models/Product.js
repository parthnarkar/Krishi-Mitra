const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Product image URL is required']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'Product quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  unit: {
    type: String,
    required: [true, 'Product unit is required'],
    trim: true
  },
  farmer: {
    type: String,
    required: [true, 'Farmer name is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Product location is required'],
    trim: true
  },
  isOrganic: {
    type: Boolean,
    default: false
  },
  harvestDate: {
    type: Date,
    default: Date.now
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create a compound index for name and farmer to help with duplicate detection
productSchema.index({ name: 1, farmer: 1 }, { unique: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product; 