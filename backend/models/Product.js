const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [3, 'Product name must be at least 3 characters long'],
      maxlength: [50, 'Product name cannot exceed 50 characters'],
    },
    category: {
      type: String,
      enum: ['Vegetable', 'Fruit', 'Grain', 'Dairy'],
      required: [true, 'Product category is required'],
    },
    pricePerKg: {
      type: Number,
      required: [true, 'Price per kg is required'],
      min: [1, 'Price per kg must be greater than or equal to 1'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    unit: {
      type: String,
      enum: ['Kg', 'Litre', 'Piece'],
      default: 'Kg',
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },
    images: [
      {
        url: {
          type: String,
          required: [true, 'Image URL is required'],
        },
        altText: {
          type: String,
          trim: true,
          default: 'Product Image',
        },
      },
    ],
    isAvailable: {
      type: Boolean,
      default: true,
    },
    discount: {
      type: Number,
      min: [0, 'Discount cannot be less than 0'],
      max: [100, 'Discount cannot exceed 100%'],
      default: 0,
    },
    finalPrice: {
      type: Number,
      required: true,
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farmer',
      required: [true, 'Farmer reference is required'],
    },
  },
  { timestamps: true }
);

// ✅ Auto-calculate final price after applying discount
productSchema.pre('save', function (next) {
  if (this.discount > 0) {
    this.finalPrice = this.pricePerKg - (this.pricePerKg * this.discount) / 100;
  } else {
    this.finalPrice = this.pricePerKg;
  }
  next();
});

// ✅ Check stock availability before processing orders
productSchema.methods.checkStockAvailability = function (quantity) {
  return this.stock >= quantity;
};

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
