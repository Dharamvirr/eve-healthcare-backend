const express = require('express');
const { getCentres, getCentreById, createCentre } = require('../controllers/centreController');

const router = express.Router();

router.route('/').get(getCentres).post(createCentre);
router.route('/:id').get(getCentreById);

module.exports = router;
