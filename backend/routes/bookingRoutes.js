const express = require('express');
const { createBooking, getBookings, getBookingById } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(protect, createBooking).get(protect, getBookings);
router.route('/:id').get(protect, getBookingById);

module.exports = router;
