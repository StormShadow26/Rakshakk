const mongoose = require("mongoose");
const Patient = require("./patient.model");

// Appointment schema
const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  date: { type: Date, required: true },
  purpose: { type: String, required: true },
});

// Availability slot schema
const availabilitySlotSchema = new mongoose.Schema({
  hour: { type: Number, required: true }, // updated from "slot" to "hour"
  isBooked: { type: Boolean, default: false },
  bookedBy: { type:String, default: null },
  purpose: String,
});

// Doctor schema
const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    qualification: { type: String, required: true },
    specialization: { type: String, required: true },
    hospitalEmail: { type: String, required:true},

    patients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Patient" }],
    appointments: [appointmentSchema],
    availability: [availabilitySlotSchema],
  },
  { timestamps: true }
);

// ✅ Place this pre-save hook HERE — after defining the schema
doctorSchema.pre("save", function (next) {
  if (this.availability.length === 0) {
    const slots = [];
    for (let hour = 10; hour <= 18; hour++) {
      slots.push({
        hour: hour,
        isBooked: false,
        bookedBy: null,
      });
    }
    this.availability = slots;
  }
  next();
});

// ✅ Then compile the model
const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;
