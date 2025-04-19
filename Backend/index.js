const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const connectWithDb = require("./config/database");


// Routes
const hotspotRoutes = require("./routes/hotspotRoutes");
const patientRoutes = require("./routes/patientRoutes");
const donationRoutes = require("./routes/donation.routes");
const wardRoutes = require("./routes/wardRoutes");
const aiDoctorRoutes = require("./routes/aiDoctorRoutes");
const userRoutes = require("./routes/user.routes.js");
const docRoutes = require("./routes/doctor.routes.js");
const doctorRoutes = require("./routes/doctorRoutes.js");

const cookieParser = require("cookie-parser");
const initSocketServer = require("./Socket/index.js");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server and attach to app
const server = http.createServer(app);

// Connect to database
connectWithDb();

// Middleware
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

// Routes
app.use("/api", hotspotRoutes);
app.use("/api", patientRoutes);
app.use("/api", donationRoutes);
app.use("/api/wards", wardRoutes);
app.use("/api/ai", aiDoctorRoutes);
app.use("/api/users", userRoutes);
app.use("/api", docRoutes);
app.use("/api/doctors", doctorRoutes);
const helpRouter =require("./routes/help.routes.js");
app.use("/api/v1/help",helpRouter);

// Start Socket.IO server
initSocketServer(server);

// Start server
server.listen(PORT, () => {
  console.log(`🌍 Server running on http://localhost:${PORT}`);
});
