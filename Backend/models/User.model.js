// models/user.model.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Patient", "Doctor", "Admin"],
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    chatHistoryDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "History",
    },
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
  },
  { timestamps: true }
);

// Enable geospatial index
userSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("User", userSchema);
