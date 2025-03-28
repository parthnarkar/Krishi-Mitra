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
    bankDetails: {
      bankName: {
        type: String,
        required: [true, 'Bank name is required'],
        trim: true,
      },
      accountNumber: {
        type: String,
        required: [true, 'Account number is required'],
        match: [/^\d{9,18}$/, 'Account number must be between 9 to 18 digits'],
      },
      ifscCode: {
        type: String,
        required: [true, 'IFSC code is required'],
        match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Please enter a valid IFSC code'],
      },
    },
    profilePicture: {
      type: String, // URL to the profile image
      default:
        'https://www.example.com/default-profile-picture.png', // Optional default URL
    },
    landSize: {
      type: Number,
      min: [0.1, 'Land size must be at least 0.1 acre'],
      required: [true, 'Land size is required'],
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    ratings: {
      averageRating: {
        type: Number,
        default: 0,
        min: [0, 'Rating cannot be below 0'],
        max: [5, 'Rating cannot be above 5'],
      },
      totalReviews: {
        type: Number,
        default: 0,
      },
    },
    isVerified: {
      type: Boolean,
      default: false, // Admin can verify farmer manually
    },
  },
  { timestamps: true }
);

const Farmer = mongoose.model('Farmer', farmerSchema);
module.exports = Farmer;
