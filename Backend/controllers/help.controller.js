// controllers/detectionController.js
const fetch=require('node-fetch');
const  FormData= require( 'form-data');
const detectAccident = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    // Create a FormData object and append the file.
    const formData = new FormData();
    formData.append('file', req.file.buffer, { filename: req.file.originalname });

    // Replace with your Flask service URL
    const flaskURL = 'http://localhost:5000/detect';
    const flaskResponse = await fetch(flaskURL, {
      method: 'POST',
      body: formData,
    });

    // Handle non-200 responses from Flask
    if (!flaskResponse.ok) {
      const errorText = await flaskResponse.text();
      console.error("Flask Error:", errorText);
      return res.status(500).json({ error: 'Error from Flask backend', details: errorText });
    }

    const jsonResponse = await flaskResponse.json();
    console.log("Flask responded:", jsonResponse);

    // ✅ Send response to the frontend client
    res.json(jsonResponse);
  } catch (error) {
    console.error("Error forwarding request to ML service:", error);
    res.status(500).json({ error: 'Internal server error in ML service' });
  }
};

module.exports=detectAccident
