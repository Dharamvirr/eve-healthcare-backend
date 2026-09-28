const express = require('express');
const { simulatePayment, paymentWebhook } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, simulatePayment);
router.post('/webhook', paymentWebhook); // Webhook usually public, maybe secured by signature in real life

module.exports = router;
