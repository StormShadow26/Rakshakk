// routes/detectionRoutes.js
const express= require('express');
const multer=require('multer');
const  detectAccident =require('../controllers/help.controller.js');

const router = express.Router();
const upload = multer();  // Using in-memory storage

// Define the /detect endpoint.
// The key 'file' must match the form-data key used in your client.
router.post('/detect', upload.single('file'), detectAccident);

module.exports= router;
