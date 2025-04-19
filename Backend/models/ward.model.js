// models/ward.model.js
const mongoose = require('mongoose');

const bedSchema = new mongoose.Schema({
  number: Number,
  occupied: { type: Boolean, default: false },
  patientId: { type: String, default: null }
});

const wardSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Ward name is required'],  // Ensure it's required
    unique: true,   // Ensure it's unique
    trim: true,     // Trim any leading/trailing spaces
  },
  beds: [bedSchema]
});

module.exports = mongoose.model('Ward', wardSchema);
