const mongoose = require('mongoose');

const BulkNegotiationSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product',
    required: true
  },
  buyerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  sellerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  quantity: { 
    type: Number, 
    required: true 
  },
  originalPrice: { 
    type: Number, 
    required: true 
  },
  negotiatedPrice: { 
    type: Number, 
    required: true 
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: { 
    type: String, 
    enum: ['UPI', 'Bank Transfer', 'Credit Card', 'Cash on Delivery'],
    required: true 
  },
  deliveryDate: { 
    type: Date, 
    required: true 
  },
  notes: { 
    type: String 
  },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  counterOffer: {
    price: { type: Number },
    message: { type: String },
    date: { type: Date }
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('BulkNegotiation', BulkNegotiationSchema); 