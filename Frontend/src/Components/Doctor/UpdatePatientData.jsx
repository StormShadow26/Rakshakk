import React, { useState } from 'react';
import axios from 'axios';

const UpdatePatientData = () => {
  const [patientId, setPatientId] = useState('');
  const [patientData, setPatientData] = useState({
    name: '',
    weight: '',
    height: '',
    bmi: '',
    bloodPressure: '',
    pulse: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchPatient = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/patients/${patientId}`);
      const { name, weight, height, bmi, bloodPressure, pulse } = res.data;
      setPatientData({ name, weight, height, bmi, bloodPressure, pulse });
      setMessage('✅ Patient data loaded.');
      setError('');
    } catch (err) {
      setError('❌ Patient not found or server error.');
      setMessage('');
      setPatientData({
        name: '',
        weight: '',
        height: '',
        bmi: '',
        bloodPressure: '',
        pulse: '',
      });
    }
  };

  const handleChange = (e) => {
    setPatientData({ ...patientData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:4000/api/patients/${patientId}`, patientData);
      setMessage('✅ Patient data updated successfully!');
      setError('');
    } catch (err) {
      setError('⚠️ Update failed. Try again.');
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white text-gray-800 p-8 rounded-3xl shadow-xl w-full max-w-lg border border-blue-100">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">📝 Update Patient Info</h2>

        <input
          type="text"
          className="w-full px-4 py-2 mb-4 rounded-lg border border-blue-200 bg-blue-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="🔍 Enter Patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
        />
        <button
          onClick={fetchPatient}
          className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded-xl font-semibold shadow-md mb-4"
        >
          Load Patient Data
        </button>

        {error && <p className="text-red-500 mb-3 text-sm text-center">{error}</p>}
        {message && <p className="text-green-600 mb-3 text-sm text-center">{message}</p>}

        {patientData.weight !== '' && (
          <>
            <FormInput label="Name" name="name" value={patientData.name} onChange={handleChange} />
            <FormInput label="Weight (kg)" name="weight" value={patientData.weight} onChange={handleChange} />
            <FormInput label="Height (cm)" name="height" value={patientData.height} onChange={handleChange} />
            <FormInput label="BMI" name="bmi" value={patientData.bmi} onChange={handleChange} />
            <FormInput label="Blood Pressure" name="bloodPressure" value={patientData.bloodPressure} onChange={handleChange} />
            <FormInput label="Pulse" name="pulse" value={patientData.pulse} onChange={handleChange} />

            <button
              onClick={handleUpdate}
              className="w-full mt-4 bg-green-600 hover:bg-green-700 transition text-white py-2 rounded-xl font-semibold shadow-md"
            >
              ✅ Update Patient Info
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const FormInput = ({ label, name, value, onChange }) => (
  <div className="mb-4">
    <label className="block mb-1 font-medium text-sm text-blue-800">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
      required
    />
  </div>
);

export default UpdatePatientData;
