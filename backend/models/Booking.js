const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  centre: { type: mongoose.Schema.Types.ObjectId, ref: 'Centre', required: true },
  testName: { type: String, required: true },
  appointmentDate: { type: Date, required: true },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['PENDING', 'CONFIRMED', 'FAILED', 'CANCELLED'], 
    default: 'PENDING' 
  },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
