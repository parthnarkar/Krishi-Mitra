const mongoose = require('mongoose');

const farmerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      enum: ['Hindi', 'Marathi', 'English'],
      default: 'Hindi',
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  { timestamps: true }
);

const Farmer = mongoose.model('Farmer', farmerSchema);
module.exports = Farmer;
