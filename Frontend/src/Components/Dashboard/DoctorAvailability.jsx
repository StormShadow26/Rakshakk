import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DoctorAvailability = ({ doctorId }) => {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    if (doctorId) {
      axios.get(`http://localhost:4000/api/doctors/${doctorId}/availability`)
        .then(res => setSlots(res.data))
        .catch(err => console.error(err));
    }
  }, [doctorId]);

  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-2">Availability</h3>
      {slots.length === 0 ? (
        <p>No slots available.</p>
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {slots.map((slot, index) => (
            <li key={index} className="bg-green-100 p-2 rounded text-center">
              {slot.date} - {slot.time}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DoctorAvailability;
