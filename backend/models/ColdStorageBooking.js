const mongoose = require('mongoose');

const ColdStorageBookingSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  storageId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ColdStorage',
    required: true
  },
  quantity: { 
    type: Number, 
    required: true 
  },
  duration: { 
    type: Number, 
    required: true 
  },
  transportType: { 
    type: String, 
    enum: ['road', 'rail', 'air'],
    default: 'road'
  },
  deliveryDate: { 
    type: Date, 
    required: true 
  },
  notes: { 
    type: String 
  },
  totalPrice: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'canceled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('ColdStorageBooking', ColdStorageBookingSchema); 