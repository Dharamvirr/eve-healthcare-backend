const Booking = require('../models/Booking');
const WebhookEvent = require('../models/WebhookEvent');

// @desc    Simulate payment processing
// @route   POST /api/payments
// @access  Private
const simulatePayment = async (req, res) => {
  const { bookingId } = req.body;

  if (!bookingId) {
    return res.status(400).json({ message: 'Booking ID is required' });
  }

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized for this booking' });
    }

    if (booking.status !== 'PENDING' && booking.status !== 'FAILED') {
      return res.status(400).json({ message: `Cannot process payment for a booking with status ${booking.status}` });
    }

    // Simulate payment logic (80% success rate)
    const isSuccess = Math.random() > 0.2;
    const paymentStatus = isSuccess ? 'SUCCESS' : 'FAILED';
    const transactionId = `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // Generate a payload to be sent to webhook (simulating third party sending webhook)
    const webhookPayload = {
      transactionId,
      bookingId,
      status: paymentStatus
    };

    // In a real system, the third party would hit our webhook asynchronously.
    // For this simulation, we could just return the payload for the user to test the webhook manually,
    // or trigger it directly via an internal call. Let's just return the simulated result.
    
    res.json({
      message: 'Payment simulated. Please send this payload to the webhook endpoint to update the booking.',
      paymentStatus,
      webhookPayload
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Payment Webhook
// @route   POST /api/payments/webhook
// @access  Public
const paymentWebhook = async (req, res) => {
  const { transactionId, bookingId, status } = req.body;

  if (!transactionId || !bookingId || !status) {
    return res.status(400).json({ message: 'transactionId, bookingId, and status are required' });
  }

  if (!['SUCCESS', 'FAILED'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    // Idempotency check
    const existingEvent = await WebhookEvent.findOne({ transactionId });
    if (existingEvent) {
      return res.status(200).json({ message: 'Webhook already processed for this transaction' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only update if it's currently PENDING or FAILED
    if (booking.status === 'CONFIRMED' || booking.status === 'CANCELLED') {
      return res.status(400).json({ message: `Booking already ${booking.status}` });
    }

    // Update booking status
    if (status === 'SUCCESS') {
      booking.status = 'CONFIRMED';
    } else if (status === 'FAILED') {
      booking.status = 'FAILED';
    }

    await booking.save();

    // Record webhook event to ensure idempotency
    await WebhookEvent.create({
      transactionId,
      bookingId,
      status
    });

    res.status(200).json({ message: 'Webhook processed successfully' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { simulatePayment, paymentWebhook };
