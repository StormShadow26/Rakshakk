const Hospital = require('../models/hospital.model.js');

// GET /api/hospitals
const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.status(200).json(hospitals);
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    res.status(500).json({ message: 'Server error while fetching hospitals' });
  }
};

module.exports = {
  getAllHospitals,
};
