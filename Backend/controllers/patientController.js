const Patient = require('../models/patient.model');

exports.addPatient = async (req, res) => {
  try {
    const newPatient = new Patient(req.body);
    await newPatient.save();
    res.status(201).json({ message: 'Patient added successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding patient', error });
  }
};

exports.getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findOne({ id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// ✅ New: Update patient by ID
exports.updatePatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedPatient = await Patient.findOneAndUpdate(
      { id },           // match using the 'id' field
      updatedData,
      { new: true }     // return the updated document
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json({
      message: 'Patient updated successfully',
      updatedPatient
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating patient', error });
  }
};
