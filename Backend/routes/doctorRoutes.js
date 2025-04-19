// In your doctor routes file (e.g., `routes/doctorRoutes.js`)
const express = require('express');
const Doctor = require('../models/doctor.model');
const router = express.Router();
const Patient = require("../models/patient.model");
// GET - Fetch all doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find(); // Fetch all doctors from the database
    res.json(doctors);  // Send the doctor data back to the frontend
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST - Add a new doctor
router.post('/', async (req, res) => {
  const { name, age, hospitalEmail, qualification, specialization } = req.body;
  try {
    const newDoctor = new Doctor({
      name,
      age,
      qualification,
      hospitalEmail,
      specialization,
    });
    await newDoctor.save();
    res.status(201).json(newDoctor);
  } catch (error) {
    console.error('Error adding doctor:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE - Remove a doctor by ID
router.delete('/:id', async (req, res) => {
  const doctorId = req.params.id;
  try {
    await Doctor.findByIdAndDelete(doctorId);
    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// GET - Fetch a specific doctor by ID with populated availability slots
router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate("availability.bookedBy");
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: "Doctor not found" });
  }
});

// POST - Book a slot for a patient
router.post("/:id/book-slot", async (req, res) => {
  const { slotTime, patientId, purpose } = req.body;
  const doctorId = req.params.id;

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    let slotFound = false;
    for (let i = 0; i < doctor.availability.length; i++) {
      const slot = doctor.availability[i];
      console.log(slot)
      console.log(slot.hour)
      console.log(slotTime)
      if (slot.hour == slotTime) {
        slotFound = true;
        if (slot.isBooked) {
          return res.status(400).json({ message: "Slot already booked" });
        }

        // Book the slot
        doctor.availability[i].isBooked = true;
        doctor.availability[i].bookedBy = patientId;
        doctor.availability[i].purpose = purpose;

        // Add appointment
        // doctor.appointments.push({
        //   patientId,
        //   date: new Date(),
        //   purpose,
        // });

        await doctor.save();
        return res.json({ message: "Slot booked successfully", doctor });
      }
    }

    if (!slotFound) {
      return res.status(400).json({ message: "Slot not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Booking failed" });
  }
});


// POST - Unbook a slot
router.post("/:id/unbook-slot", async (req, res) => {
  const { slotTime } = req.body;
  try {
    const doctor = await Doctor.findById(req.params.id);
    const slot = doctor.availability.find(s => s.hour == slotTime);
    
    if (!slot || !slot.isBooked) {
      return res.status(404).json({ message: "Slot not found or already available" });
    }

    slot.isBooked = false;
    slot.bookedBy = null;

    await doctor.save();
    res.json({ message: "Slot unbooked successfully", doctor });
  } catch (err) {
    res.status(500).json({ error: "Unbooking failed" });
  }
});
// GET /api/doctors/by-email/:email
router.get('/by-email/:email', async (req, res) => {
  const email = req.params.email;
  
  try {
    const doctors = await Doctor.find({ hospitalEmail: email });
    res.json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/by-email/:email', async (req, res) => {
  const email = req.params.email;
  
  try {
    const doctors = await Doctor.find({ hospitalEmail: email });
    res.json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;