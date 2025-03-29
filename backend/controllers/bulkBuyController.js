const Product = require('../models/Product');
const BulkNegotiation = require('../models/BulkNegotiation');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const bulkBuyAPI = require('../utils/bulkBuyAPI');

// @desc    Create a new bulk buy request/negotiation
// @route   POST /api/bulk-buy
// @access  Private
exports.createBulkNegotiation = asyncHandler(async (req, res) => {
  const {
    productId,
    sellerId,
    quantity,
    negotiatedPrice,
    paymentMethod,
    deliveryDate,
    notes
  } = req.body;

  // Validate product and seller existence
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const seller = await User.findById(sellerId);
  if (!seller) {
    res.status(404);
    throw new Error('Seller not found');
  }

  // Calculate total amount
  const totalAmount = quantity * negotiatedPrice;

  const bulkNegotiation = await BulkNegotiation.create({
    productId,
    buyerId: req.user._id,
    sellerId,
    quantity,
    originalPrice: product.price,
    negotiatedPrice,
    totalAmount,
    paymentMethod,
    deliveryDate: new Date(deliveryDate),
    notes,
    status: 'pending',
    paymentStatus: 'pending'
  });

  res.status(201).json(bulkNegotiation);
});

// @desc    Get all bulk negotiations for a buyer
// @route   GET /api/bulk-buy/buyer
// @access  Private
exports.getBuyerNegotiations = asyncHandler(async (req, res) => {
  const negotiations = await BulkNegotiation.find({ buyerId: req.user._id })
    .populate('productId', 'name images price unit')
    .populate('sellerId', 'name email');
  
  res.status(200).json(negotiations);
});

// @desc    Get all bulk negotiations for a seller
// @route   GET /api/bulk-buy/seller
// @access  Private
exports.getSellerNegotiations = asyncHandler(async (req, res) => {
  const negotiations = await BulkNegotiation.find({ sellerId: req.user._id })
    .populate('productId', 'name images price unit')
    .populate('buyerId', 'name email');
  
  res.status(200).json(negotiations);
});

// @desc    Get negotiation by ID
// @route   GET /api/bulk-buy/:id
// @access  Private
exports.getNegotiationById = asyncHandler(async (req, res) => {
  const negotiation = await BulkNegotiation.findById(req.params.id)
    .populate('productId', 'name images price description unit category')
    .populate('buyerId', 'name email phone')
    .populate('sellerId', 'name email phone');
  
  if (!negotiation) {
    res.status(404);
    throw new Error('Negotiation not found');
  }
  
  // Check if user is either buyer or seller
  if (
    negotiation.buyerId._id.toString() !== req.user._id.toString() &&
    negotiation.sellerId._id.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized to view this negotiation');
  }
  
  res.status(200).json(negotiation);
});

// @desc    Update negotiation status (accept/reject) by seller
// @route   PUT /api/bulk-buy/:id/status
// @access  Private
exports.updateNegotiationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  if (!['accepted', 'rejected', 'completed'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }
  
  const negotiation = await BulkNegotiation.findById(req.params.id);
  
  if (!negotiation) {
    res.status(404);
    throw new Error('Negotiation not found');
  }
  
  // Check if user is seller
  if (negotiation.sellerId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only the seller can update negotiation status');
  }
  
  negotiation.status = status;
  
  if (status === 'completed') {
    negotiation.paymentStatus = 'paid';
  }
  
  await negotiation.save();
  
  res.status(200).json(negotiation);
});

// @desc    Submit counter offer by seller
// @route   PUT /api/bulk-buy/:id/counter-offer
// @access  Private
exports.submitCounterOffer = asyncHandler(async (req, res) => {
  const { price, message } = req.body;
  
  if (!price) {
    res.status(400);
    throw new Error('Counter offer price is required');
  }
  
  const negotiation = await BulkNegotiation.findById(req.params.id);
  
  if (!negotiation) {
    res.status(404);
    throw new Error('Negotiation not found');
  }
  
  // Check if user is seller
  if (negotiation.sellerId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only the seller can submit counter offers');
  }
  
  // Update with counter offer
  negotiation.counterOffer = {
    price,
    message: message || '',
    date: Date.now()
  };
  
  // Update negotiation status to pending again
  negotiation.status = 'pending';
  
  await negotiation.save();
  
  res.status(200).json(negotiation);
});

// @desc    Accept counter offer by buyer
// @route   PUT /api/bulk-buy/:id/accept-counter
// @access  Private
exports.acceptCounterOffer = asyncHandler(async (req, res) => {
  const negotiation = await BulkNegotiation.findById(req.params.id);
  
  if (!negotiation) {
    res.status(404);
    throw new Error('Negotiation not found');
  }
  
  // Check if user is buyer
  if (negotiation.buyerId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only the buyer can accept counter offers');
  }
  
  // Check if there is a counter offer
  if (!negotiation.counterOffer || !negotiation.counterOffer.price) {
    res.status(400);
    throw new Error('No counter offer available to accept');
  }
  
  // Update negotiated price and total
  negotiation.negotiatedPrice = negotiation.counterOffer.price;
  negotiation.totalAmount = negotiation.quantity * negotiation.counterOffer.price;
  
  // Set status to accepted
  negotiation.status = 'accepted';
  
  await negotiation.save();
  
  res.status(200).json(negotiation);
});

// @desc    Calculate bulk discount
// @route   GET /api/bulk-buy/calculate-discount
// @access  Public
exports.calculateBulkDiscount = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.query;
  
  if (!productId || !quantity) {
    res.status(400);
    throw new Error('Product ID and quantity are required');
  }
  
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  // Get product type (using category as a proxy)
  const productType = product.category || 'standard';
  
  // Calculate discount using utility function
  const discountInfo = bulkBuyAPI.calculateBulkDiscount(
    productType,
    parseInt(quantity),
    product.price
  );
  
  // Add product details to response
  const result = {
    ...discountInfo,
    product: {
      id: product._id,
      name: product.name,
      basePrice: product.price,
      unit: product.unit
    }
  };
  
  res.status(200).json(result);
});

// @desc    Get counter offer suggestions
// @route   GET /api/bulk-buy/suggest-counter
// @access  Private
exports.suggestCounterOffers = asyncHandler(async (req, res) => {
  const { negotiationId } = req.params;
  
  const negotiation = await BulkNegotiation.findById(negotiationId);
  if (!negotiation) {
    res.status(404);
    throw new Error('Negotiation not found');
  }
  
  // Check if user is seller
  if (negotiation.sellerId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only the seller can get counter offer suggestions');
  }
  
  // Get suggestions using utility function
  const suggestions = bulkBuyAPI.suggestCounterOffers(
    negotiation.originalPrice,
    negotiation.negotiatedPrice,
    negotiation.quantity
  );
  
  res.status(200).json(suggestions);
});

// @desc    Check transportation for bulk order
// @route   GET /api/bulk-buy/check-transportation
// @access  Private
exports.checkBulkTransportation = asyncHandler(async (req, res) => {
  const { productId, quantity, location } = req.query;
  
  if (!productId || !quantity || !location) {
    res.status(400);
    throw new Error('Product ID, quantity, and location are required');
  }
  
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  // Get product type (using category as a proxy)
  const productType = product.category || 'standard';
  
  // Get transportation details using utility function
  const transportInfo = bulkBuyAPI.checkBulkTransportation(
    parseInt(quantity),
    productType,
    location
  );
  
  // Add product details to response
  const result = {
    ...transportInfo,
    product: {
      id: product._id,
      name: product.name,
      unit: product.unit
    },
    quantity: parseInt(quantity),
    deliveryLocation: location
  };
  
  res.status(200).json(result);
}); 