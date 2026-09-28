const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }
});

const centreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  tests: [testSchema]
}, { timestamps: true });

module.exports = mongoose.model('Centre', centreSchema);
