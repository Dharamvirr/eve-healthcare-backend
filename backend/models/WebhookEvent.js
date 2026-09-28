const mongoose = require('mongoose');

const webhookEventSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  status: { type: String, required: true },
  processedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WebhookEvent', webhookEventSchema);
