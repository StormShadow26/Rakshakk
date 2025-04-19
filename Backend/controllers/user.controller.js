// controllers/auth.controller.js

const User = require("../models/User.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Patient = require("../models/patient.model.js");
// const Doctor=require("../models/doctor.model.js")
const Hospital=require("../models/hospital.model.js")
// DiceBear URL generator
const generateAvatar = (firstname, lastname) => {
  return `https://api.dicebear.com/5.x/initials/svg?seed=${firstname} ${lastname}`;
};

exports.register = async (req, res) => {
  try {
    const { firstname, lastname, email, password, role, latitude, longitude } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate token
    const token = jwt.sign({ email, role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Create avatar
    const image = generateAvatar(firstname, lastname);

    // Construct GeoJSON location object
    const location = {
      type: "Point",
      coordinates: [parseFloat(longitude), parseFloat(latitude)], // [lng, lat]
    };

    // Save user
    if (role == "Patient") {
      const patient = new Patient({
        firstname,
        lastname,
        location,
        email,
      });
      await patient.save();
    }
    if (role == "Admin") {
      const hospital = new Hospital({
        firstname,
        lastname:"Hospital",
        location,
        email,
      });
      await hospital.save();
    }

    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role,
      token,
      image,
      location,
    });

    await newUser.save();

    // Set token as a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        firstname,
        lastname,
        email,
        role,
        image,
        token,
        location: newUser.location,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, latitude, longitude } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Update token and location in DB
    user.token = token;

    if (latitude && longitude) {
      user.location = {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      };
    }

    await user.save();

    // Set token as a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        name: `${user.firstname} ${user.lastname}`,
        email: user.email,
        role: user.role,
        image: user.image,
        token: user.token,
        _id: user._id,
        location: user.location,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed", error: error.message });
  }
};
