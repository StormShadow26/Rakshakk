const express = require('express');
const router = express.Router();
const { getAllHospitals } = require('../controllers/hospitalController');
const {
  getDoctorsByHospital,
  getDoctorAvailability,
} = require('../controllers/doctorController');

// Hospital routes
router.get('/hospitals', getAllHospitals);


router.get('/doctors/by-hospital/:id', getDoctorsByHospital);
router.get('/doctors/:id/availability', getDoctorAvailability);

module.exports = router;
