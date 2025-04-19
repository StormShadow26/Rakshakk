import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HospitalList = ({ onHospitalSelect }) => {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/api/hospitals')
      .then(res => setHospitals(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {hospitals.map(hospital => (
        <div
          key={hospital._id}
          className="bg-white shadow rounded-lg p-4 cursor-pointer hover:bg-gray-100"
          onClick={() => onHospitalSelect(hospital._id)}
        >
          <h2 className="text-xl font-semibold">{hospital.name}</h2>
          <p>{hospital.location}</p>
        </div>
      ))}
    </div>
  );
};

export default HospitalList;
