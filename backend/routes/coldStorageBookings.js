const express = require('express');
const router = express.Router();
const ColdStorageBooking = require('../models/ColdStorageBooking');
const { protect: auth } = require('../middleware/authMiddleware');

// Get all bookings for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await ColdStorageBooking.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server error while fetching bookings' });
  }
});

// Create a new booking
router.post('/', auth, async (req, res) => {
  try {
    const {
      storageName,
      quantity,
      startDate,
      endDate,
      totalPrice,
      provider,
      ratePerTon,
      duration,
      location
    } = req.body;

    const booking = new ColdStorageBooking({
      storageName,
      quantity,
      startDate,
      endDate,
      totalPrice,
      provider,
      ratePerTon,
      duration,
      location,
      userId: req.user.id
    });

    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Server error while creating booking' });
  }
});

// Update booking status and payment
router.patch('/:id/payment', auth, async (req, res) => {
  try {
    const booking = await ColdStorageBooking.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Can only pay for pending bookings' });
    }

    booking.paymentStatus = 'paid';
    booking.status = 'confirmed';
    await booking.save();

    res.json(booking);
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ message: 'Server error while processing payment' });
  }
});

// Cancel booking
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await ColdStorageBooking.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Can only cancel pending bookings' });
    }

    await booking.deleteOne();
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Server error while cancelling booking' });
  }
});

// Get booking details
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await ColdStorageBooking.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking details:', error);
    res.status(500).json({ message: 'Server error while fetching booking details' });
  }
});

module.exports = router; 