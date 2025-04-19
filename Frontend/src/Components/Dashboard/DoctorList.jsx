import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const DoctorList = ({ onDoctorSelect }) => {
  const [doctors, setDoctors] = useState([]);
  const { email } = useParams(); // 👈 Extract email from route

  useEffect(() => {
    if (email) {
      axios.get(`http://localhost:4000/api/doctors/by-email/${email}`) // 👈 Adjust API route as needed
        .then(res => setDoctors(res.data))
        .catch(err => console.error("Error fetching doctors:", err));
    }
  }, [email]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Doctors at {email}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {doctors.length > 0 ? doctors.map(doc => (
          <div
            key={doc._id}
            className="bg-blue-100 shadow rounded-lg p-4 cursor-pointer hover:bg-blue-200 transition"
            onClick={() => onDoctorSelect?.(doc._id)}
          >
            <h3 className="text-lg font-semibold">{doc.name}</h3>
            <p className="text-sm text-gray-700">{doc.specialization}</p>
            <p className="text-sm text-gray-500">Qualification: {doc.qualification}</p>
            <p className="text-sm text-gray-500">Age: {doc.age}</p>
          </div>
        )) : (
          <div className="text-gray-500 col-span-full text-center">
            No doctors found for this hospital.
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorList;
