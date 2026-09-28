const Centre = require('../models/Centre');

// @desc    Get all diagnostic centres
// @route   GET /api/centres
// @access  Public
const getCentres = async (req, res) => {
  try {
    const centres = await Centre.find({});
    res.json(centres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single diagnostic centre by ID
// @route   GET /api/centres/:id
// @access  Public
const getCentreById = async (req, res) => {
  try {
    const centre = await Centre.findById(req.params.id);
    if (centre) {
      res.json(centre);
    } else {
      res.status(404).json({ message: 'Centre not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a diagnostic centre (Admin/setup purpose)
// @route   POST /api/centres
// @access  Public (for simplicity in this assignment)
const createCentre = async (req, res) => {
  const { name, location, tests } = req.body;
  if (!name || !location) {
    return res.status(400).json({ message: 'Please provide name and location' });
  }

  try {
    const centre = new Centre({ name, location, tests: tests || [] });
    const createdCentre = await centre.save();
    res.status(201).json(createdCentre);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCentres, getCentreById, createCentre };
