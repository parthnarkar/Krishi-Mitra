const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true }
  },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  }],
  totalAmount: { type: Number, required: true },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['processing', 'confirmed', 'shipped', 'delivered'],
    default: 'processing'
  },
  orderNumber: { type: String, unique: true },
  paymentMethod: { type: String, default: 'simulated' },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Generate order number before saving
orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    this.orderNumber = 'ORD-' + Date.now().toString().slice(-6);
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', orderSchema); 