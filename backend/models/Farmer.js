const mongoose = require('mongoose');

const farmerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Farmer name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number'],
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },
    aadhaarNumber: {
      type: String,
      required: [true, 'Aadhaar number is required'],
      unique: true,
      match: [/^\d{12}$/, 'Aadhaar number must be 12 digits'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    pincode: {
      type: String,
      required: true,
      match: [/^\d{6}$/, 'Pincode must be 6 digits'],
    },
    language: {
      type: String,
      enum: ['Hindi', 'Marathi', 'English'],
      default: 'Hindi',
    },
  },
  { timestamps: true }
);

const Farmer = mongoose.model('Farmer', farmerSchema);
module.exports = Farmer;
