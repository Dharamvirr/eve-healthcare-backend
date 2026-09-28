const Booking = require('../models/Booking');
const Centre = require('../models/Centre');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  const { centreId, testName, appointmentDate } = req.body;

  if (!centreId || !testName || !appointmentDate) {
    return res.status(400).json({ message: 'Please provide centreId, testName, and appointmentDate' });
  }

  try {
    const centre = await Centre.findById(centreId);
    if (!centre) {
      return res.status(404).json({ message: 'Centre not found' });
    }

    const test = centre.tests.find(t => t.name === testName);
    if (!test) {
      return res.status(400).json({ message: 'Test not available at this centre' });
    }

    const booking = new Booking({
      user: req.user._id,
      centre: centreId,
      testName,
      appointmentDate,
      amount: test.price,
      status: 'PENDING'
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('centre', 'name location');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('centre', 'name location').populate('user', 'name email');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if the user is authorized to view this booking
    if (booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, getBookings, getBookingById };
