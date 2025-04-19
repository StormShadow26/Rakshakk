import React, { useState } from 'react';

const Patients = () => {
  const [patient, setPatient] = useState({
    id: '',
    name: '',
    age: '',
    weight: '',
    bloodGroup: '',
    height: '',
    bmi: '',
    bloodPressure: '',
    pulse: '',
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');

    try {
      const response = await fetch('http://localhost:4000/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patient),
      });

      if (response.ok) {
        setStatus('✅ Patient added successfully!');
        setPatient({
          id: '',
          age: '',
          name: '',
          weight: '',
          bloodGroup: '',
          height: '',
          bmi: '',
          bloodPressure: '',
          pulse: '',
        });
      } else {
        setStatus('❌ Failed to add patient.');
      }
    } catch (error) {
      console.error(error);
      setStatus('⚠️ An error occurred.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 flex items-center justify-center px-4 py-12">
      <div className="bg-white text-gray-800 p-8 rounded-3xl shadow-xl w-full max-w-2xl border border-blue-100">
        <h2 className="text-4xl font-bold mb-8 text-center text-blue-700">🩺 Add New Patient</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Patient ID" name="id" value={patient.id} onChange={handleChange} />
            <Input label="Patient Name" name="name" value={patient.name} onChange={handleChange} />
            <Input label="Age" name="age" value={patient.age} onChange={handleChange} />
            <Input label="Weight (kg)" name="weight" value={patient.weight} onChange={handleChange} />
            <Input label="Blood Group" name="bloodGroup" value={patient.bloodGroup} onChange={handleChange} />
            <Input label="Height (cm)" name="height" value={patient.height} onChange={handleChange} />
            <Input label="BMI" name="bmi" value={patient.bmi} onChange={handleChange} />
            <Input label="Blood Pressure" name="bloodPressure" value={patient.bloodPressure} onChange={handleChange} />
            <Input label="Pulse" name="pulse" value={patient.pulse} onChange={handleChange} />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 transition text-white rounded-xl font-semibold shadow-md"
          >
            ➕ Add Patient
          </button>
        </form>

        {status && (
          <p className="mt-6 text-center text-sm text-blue-700 font-medium">
            {status}
          </p>
        )}
      </div>
    </div>
  );
};

const Input = ({ label, name, value, onChange }) => (
  <div className="flex flex-col">
    <label className="mb-1 font-medium text-sm text-blue-800">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="bg-blue-50 border border-blue-200 text-gray-800 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
      required
    />
  </div>
);

export default Patients;
