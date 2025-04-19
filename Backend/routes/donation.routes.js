// const express = require('express');
// const router = express.Router();

// // In-memory donation storage (or switch to DB later)
// let donations = [];

// router.post('/donate', (req, res) => {
//   const { amount, hash } = req.body;
//   if (!amount || !hash) {
//     return res.status(400).json({ message: 'Amount and transaction hash are required.' });
//   }
//   donations.push({ amount, hash, timestamp: new Date() });
//   console.log("Donation received:", { amount, hash });
//   res.status(200).json({ message: "Donation received successfully." });
// });

// router.get('/donations', (req, res) => {
//   res.status(200).json(donations);
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const Donation = require("../models/donation.model"); // Update this to match the correct file name

// POST route to handle donations
router.post("/donate", async (req, res) => {
  const { amount, hash } = req.body;

  try {
    const newDonation = new Donation({
      amount,
      hash,
    });

    await newDonation.save();
    res.status(201).json({ message: "Donation added successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error saving donation", error: error.message });
  }
});

// GET route to fetch all donations
router.get("/donations", async (req, res) => {
  try {
    const donations = await Donation.find();
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching donations", error: error.message });
  }
});

module.exports = router;

