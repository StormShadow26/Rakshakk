const Hospital = require('../models/hospital.model.js');
// const Doctor = require('../models/hospital.model.js');

// GET /api/doctors/by-hospital/:id
const getDoctorsByHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findById({ _id: req.params.id });
    res.status(200).json(hospital.doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Server error while fetching doctors' });
  }
};

const getDoctorAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(200).json(doctor.availability);
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ message: 'Server error while fetching availability' });
  }
};

module.exports = {
  getDoctorsByHospital,
  getDoctorAvailability,
};
