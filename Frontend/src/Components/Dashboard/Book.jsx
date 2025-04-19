import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

const Book = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize the navigate hook

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/hospitals");
        setHospitals(res.data);
      } catch (err) {
        console.error("Error fetching hospitals:", err);
        setError("Failed to load hospitals. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  const handleHospitalSelect = (email) => {
    // Navigate to /listDoctors with the selected hospital's email as a route parameter
    navigate(`/listDoctors/${email}`);
  };

  if (loading) {
    return <div className="text-center text-gray-500 text-xl mt-10">Loading hospitals...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 text-xl mt-10">{error}</div>;
  }

  if (hospitals.length === 0) {
    return <div className="text-center text-gray-500 text-xl mt-10">No hospitals found.</div>;
  }

  return (
    <div className="px-6 py-8 bg-gray-50">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Select a Hospital</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {hospitals.map((hospital) => {
          const { location } = hospital;
          const coordinates = location?.coordinates || [];
          const [longitude, latitude] = coordinates;
          const locationText = latitude && longitude ? `Lat: ${latitude}, Long: ${longitude}` : "Location not available";

          return (
            <div
              key={hospital._id}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition border border-gray-200"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{hospital.firstname} {hospital.lastname}</h3>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Email:</span> {hospital.email || "No email provided"}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <span className="font-medium">Location:</span> {locationText}
              </p>
              <button
                onClick={() => handleHospitalSelect(hospital.email)} // Navigate on select
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
              >
                Select
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Book;
