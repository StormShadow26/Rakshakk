const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    id: { type: String, unique:true},
    name: { type: String},
    age: { type: Number},
    weight: { type: Number },
    bloodGroup: { type: String },
    height: { type: Number},
    bmi: { type: Number},
    bloodPressure: { type: String },
    pulse: { type: Number},

    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    firstname: {
      type: String,
     
      trim: true,
    },
    lastname: {
      type: String,
      
      trim: true,
    },
    email: {
      type: String,
      
      unique: true,
      lowercase: true,
      trim: true,
    },
    reportFiles: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema); // ✅ only export the model
