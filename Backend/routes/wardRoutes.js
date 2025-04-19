const express = require('express');
const router = express.Router();
const Ward = require('../models/ward.model');
const Patient = require('../models/patient.model');

// Get all wards
router.get('/', async (req, res) => {
  try {
    const wards = await Ward.find();
    res.json(wards);
  } catch (err) {
    res.status(500).json({ message: 'Server error while fetching wards', error: err.message });
  }
});

// Get a single ward by ID
router.get('/:wardId', async (req, res) => {
  try {
    const ward = await Ward.findById(req.params.wardId);
    if (!ward) return res.status(404).json({ message: 'Ward not found' });
    res.json(ward);
  } catch (err) {
    res.status(500).json({ message: 'Server error while fetching ward', error: err.message });
  }
});

// Add a new ward
// Add a new ward
router.post('/', async (req, res) => {
    try {
      const { name } = req.body;
  
      // Ensure the ward name is not null or empty
      if (!name || name.trim() === "") {
        return res.status(400).json({ message: "Ward name is required" });
      }
  
      const ward = new Ward({
        name: name.trim(),
        beds: []
      });
  
      await ward.save();
      res.json(ward);
    } catch (err) {
      console.error('Error adding ward:', err);  // Log the complete error for debugging
      res.status(500).json({ message: 'Server error while adding ward', error: err.message });
    }
  });
  

// Delete a ward
router.delete('/:wardId', async (req, res) => {
  try {
    const ward = await Ward.findByIdAndDelete(req.params.wardId);
    if (!ward) return res.status(404).json({ message: 'Ward not found' });
    res.json({ message: 'Ward deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error while deleting ward', error: err.message });
  }
});

// Add a bed to a ward
router.post('/:wardId/beds', async (req, res) => {
  try {
    const ward = await Ward.findById(req.params.wardId);
    if (!ward) return res.status(404).json({ message: 'Ward not found' });

    const newBed = {
      number: ward.beds.length + 1, // Assuming bed numbers are assigned incrementally
      occupied: false,
      patientId: null
    };

    ward.beds.push(newBed);
    await ward.save();
    res.json(ward);
  } catch (err) {
    console.error('Error adding bed:', err);
    res.status(500).json({ message: 'Error adding bed', error: err.message });
  }
});

// Delete a bed from a ward
router.delete('/:wardId/beds/:bedNumber', async (req, res) => {
  try {
    const ward = await Ward.findById(req.params.wardId);
    if (!ward) return res.status(404).json({ message: 'Ward not found' });

    const bedIndex = ward.beds.findIndex(bed => bed.number === parseInt(req.params.bedNumber));
    if (bedIndex === -1) return res.status(404).json({ message: 'Bed not found' });

    ward.beds.splice(bedIndex, 1); // Remove the bed from the array
    await ward.save();
    res.json(ward);
  } catch (err) {
    res.status(500).json({ message: 'Error deleting bed', error: err.message });
  }
});

// Allot a bed to a patient
router.post('/:wardId/beds/:bedNumber/allot', async (req, res) => {
  try {
    const { patientId } = req.body;
    if (!patientId) return res.status(400).json({ message: 'Patient ID is required' });

    const patient = await Patient.findOne({ id: patientId });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const ward = await Ward.findById(req.params.wardId);
    if (!ward) return res.status(404).json({ message: 'Ward not found' });

    const bed = ward.beds.find(b => b.number === parseInt(req.params.bedNumber));
    if (!bed) return res.status(404).json({ message: 'Bed not found' });

    if (bed.occupied) {
      return res.status(400).json({ message: 'Bed is already occupied' });
    }

    // Check if patient is already allotted a bed in any ward
    const allWards = await Ward.find();
    for (let w of allWards) {
      for (let b of w.beds) {
        if (b.patientId === patientId) {
          return res.status(400).json({ message: 'Patient is already allotted a bed in another ward' });
        }
      }
    }

    bed.occupied = true;
    bed.patientId = patientId;
    await ward.save();
    res.json(ward);
  } catch (err) {
    res.status(500).json({ message: 'Error allotting bed', error: err.message });
  }
});

// Vacate a bed
router.post('/:wardId/beds/:bedNumber/vacate', async (req, res) => {
  try {
    const ward = await Ward.findById(req.params.wardId);
    if (!ward) return res.status(404).json({ message: 'Ward not found' });

    const bed = ward.beds.find(b => b.number === parseInt(req.params.bedNumber));
    if (!bed) return res.status(404).json({ message: 'Bed not found' });

    if (!bed.occupied) {
      return res.status(400).json({ message: 'Bed is already vacant' });
    }

    bed.occupied = false;
    bed.patientId = null;
    await ward.save();
    res.json(ward);
  } catch (err) {
    res.status(500).json({ message: 'Error vacating bed', error: err.message });
  }
});

module.exports = router;
