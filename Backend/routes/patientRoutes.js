const express = require('express');
const router = express.Router();
const multer = require('multer');
const Patient = require('../models/patient.model'); 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // store in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post('/upload-report/:id', upload.single('report'), async (req, res) => {
  try {
    const patient = await Patient.findOne({ id: req.params.id });
    if (!patient) return res.status(404).send('Patient not found');

    patient.reportFiles.push(req.file.filename); // push new report
    await patient.save();

    res.status(200).send({ message: 'Report uploaded successfully', file: req.file.filename });
  } catch (error) {
    res.status(500).send({ message: 'Error uploading report', error });
  }
});

const {
  addPatient,
  getPatientById,
  updatePatientById // <- Import the update controller
} = require('../controllers/patientController');

router.get('/patients/count', async (req, res) => {
  try {
    const count = await Patient.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error("Error fetching patient count", error);
    res.status(500).json({ message: 'Server error' });
  }
});


// POST - Add new patient
router.post('/patients', addPatient);

// GET - Get patient by ID
router.get('/patients/:id', getPatientById);

// ✅ PUT - Update patient by ID
router.put('/patients/:id', updatePatientById);

module.exports = router;
