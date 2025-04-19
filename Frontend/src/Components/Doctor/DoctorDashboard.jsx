import React, { useEffect, useState } from 'react';
import { FaUserPlus, FaEdit, FaHospital, FaUserMd } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const COLORS = ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'];

const DoctorDashboard = () => {
  const [patientCount, setPatientCount] = useState(0);
  const [searchId, setSearchId] = useState('');
  const [patientDetails, setPatientDetails] = useState(null);

  useEffect(() => {
    const fetchPatientCount = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/patients/count');
        setPatientCount(response.data.count);
      } catch (error) {
        console.error("Error fetching patient count", error);
      }
    };
    fetchPatientCount();
  }, []);

  const fetchPatientById = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/patients/${searchId}`);
      setPatientDetails(res.data);
    } catch (err) {
      console.error('Patient not found or error occurred.');
      setPatientDetails(null);
    }
  };

  const pieData = [
    { name: 'Ward A', value: 400 },
    { name: 'Ward B', value: 300 },
    { name: 'Ward C', value: 200 },
    { name: 'ICU', value: 100 }
  ];

  return (
    <div className="bg-gradient-to-tr from-blue-50 to-white text-gray-800 min-h-screen p-6 font-inter">
      
      {/* Header */}
      <div className="text-4xl font-extrabold mb-10 text-center text-blue-800">Doctor Dashboard</div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <Link to="/patients" className="bg-blue-100 hover:bg-blue-200 transition text-blue-800 p-6 rounded-xl text-center shadow-md text-lg flex flex-col items-center">
          <FaUserPlus className="text-4xl mb-2 text-blue-500" />
          Add Patient
        </Link>

        <Link to="/UpdatePatientData" className="bg-purple-100 hover:bg-purple-200 transition text-purple-800 p-6 rounded-xl text-center shadow-md text-lg flex flex-col items-center">
          <FaEdit className="text-4xl mb-2 text-purple-500" />
          Update Patient
        </Link>

        <Link to="/wards">
          <div className="bg-green-100 hover:bg-green-200 transition text-green-800 p-6 rounded-xl text-center shadow-md text-lg flex flex-col items-center cursor-pointer">
            <FaHospital className="text-4xl mb-2 text-green-500" />
            Wards
          </div>
        </Link>

        <Link to="/doctors">
          <div className="bg-yellow-100 hover:bg-yellow-200 transition text-yellow-800 p-6 rounded-xl text-center shadow-md text-lg flex flex-col items-center cursor-pointer">
            <FaUserMd className="text-4xl mb-2 text-yellow-500" />
            Doctors
          </div>
        </Link>
      </div>

      {/* Stats and Pie Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-xl p-6 shadow-md text-center border border-blue-100">
          <h3 className="text-lg font-medium mb-1">Current Patients</h3>
          <p className="text-4xl font-bold text-blue-600">{patientCount}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-blue-100">
          <h3 className="text-lg font-medium mb-4 text-center">Ward Distribution</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Patient Search */}
      <div className="bg-white rounded-2xl p-8 shadow-lg mb-16 w-full mx-auto border border-gray-200">
        <h2 className="text-3xl font-semibold text-blue-700 mb-6 text-center">🔍 Get Patient Details by ID</h2>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
          <input
            type="text"
            placeholder="Enter Patient ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="px-4 py-3 rounded-lg w-full md:w-80 text-gray-700 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={fetchPatientById}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-md"
          >
            Search
          </button>
        </div>

        {/* Patient Details */}
        {patientDetails && (
          <div className="bg-blue-50 rounded-2xl p-6 shadow-md border border-blue-100">
            <h3 className="text-2xl font-semibold mb-4 border-b pb-2 text-blue-800">🧾 Patient Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm leading-6 text-gray-700">
              <p><span className="font-medium">ID:</span> {patientDetails.id}</p>
              <p><span className="font-medium">Name:</span> {patientDetails.name}</p>
              <p><span className="font-medium">Age:</span> {patientDetails.age} years</p>
              <p><span className="font-medium">Weight:</span> {patientDetails.weight} kg</p>
              <p><span className="font-medium">Blood Group:</span> {patientDetails.bloodGroup}</p>
              <p><span className="font-medium">Height:</span> {patientDetails.height} cm</p>
              <p><span className="font-medium">BMI:</span> {patientDetails.bmi}</p>
              <p><span className="font-medium">Blood Pressure:</span> {patientDetails.bloodPressure}</p>
              <p><span className="font-medium">Pulse:</span> {patientDetails.pulse} bpm</p>
            </div>

            {/* Upload PDF Report */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2 text-blue-700">📄 Upload PDF Report</h3>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData();
                  formData.append("report", e.target.report.files[0]);

                  try {
                    await axios.post(`http://localhost:4000/api/upload-report/${searchId}`, formData, {
                      headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    alert("Report uploaded successfully!");
                    fetchPatientById();
                  } catch (err) {
                    alert("Error uploading report.");
                    console.error(err);
                  }
                }}
              >
                <input
                  type="file"
                  name="report"
                  accept="application/pdf"
                  required
                  className="mb-3"
                />
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition"
                >
                  Upload PDF
                </button>
              </form>

              {/* Display Uploaded Reports */}
              {patientDetails?.reportFiles?.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-md font-semibold mb-2 text-blue-800">📚 Uploaded Reports</h3>
                  <ul className="list-disc list-inside text-blue-600 space-y-1">
                    {patientDetails.reportFiles.map((file, index) => (
                      <li key={index}>
                        <a
                          href={`http://localhost:4000/uploads/${file}`}
                          target="_blank"
                          rel="noreferrer"
                          className="underline hover:text-blue-400"
                        >
                          Report {index + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Rhythm Admin. All rights reserved.
      </footer>
    </div>
  );
};

export default DoctorDashboard;
