const mongoose = require('mongoose');

const ColdStorageSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  location: { 
    type: String, 
    required: true 
  },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  capacity: { 
    type: String, 
    required: true 
  },
  available: { 
    type: String, 
    required: true 
  },
  temperature: { 
    type: String, 
    required: true 
  },
  price: { 
    type: String, 
    required: true 
  },
  pricePerTonPerDay: {
    type: Number,
    required: true
  },
  rating: { 
    type: Number, 
    default: 0 
  },
  reviews: { 
    type: Number, 
    default: 0 
  },
  features: [{ 
    type: String 
  }],
  contact: { 
    type: String 
  },
  ownerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('ColdStorage', ColdStorageSchema); 