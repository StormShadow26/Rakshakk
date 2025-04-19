import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const SlotView = () => {
  const { id } = useParams(); // doctor ID
  const [doctor, setDoctor] = useState(null);
  const [patientId, setPatientId] = useState("");
  const [purpose, setPurpose] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:4000/api/doctors/${id}`)
      .then(res => setDoctor(res.data))
      .catch(err => console.error("Error fetching doctor:", err));
  }, [id]);

  const bookSlot = async (slot) => {
    if (!patientId || !purpose) return alert("Please enter patient ID and purpose.");
    try {
      const res = await axios.post(`http://localhost:4000/api/doctors/${id}/book-slot`, {
        id,
        slotTime: slot.hour,
        patientId,
        purpose,
      });
      alert("Slot booked!");
      setDoctor(res.data.doctor);
    } catch (error) {
      console.error(error);
      alert("Booking failed");
    }
  };

  const unbookSlot = async (slot) => {
    try {
      const res = await axios.post(`http://localhost:4000/api/doctors/${id}/unbook-slot`, {
        slotTime: slot.hour,
      });
      alert("Slot unbooked!");
      setDoctor(res.data.doctor);
    } catch (error) {
      console.error(error);
      alert("Unbooking failed");
    }
  };

  if (!doctor) return <div className="text-center text-gray-600 text-xl mt-20">Loading doctor details...</div>;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-700">
          Appointment Slots for Dr. {doctor.name}
        </h2>

        <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
          <input
            type="text"
            placeholder="Enter Patient ID"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-1/3"
          />
          <input
            type="text"
            placeholder="Purpose of Visit"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-1/3"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {doctor.availability.map((slot, index) => (
            <div
              key={index}
              className={`rounded-xl p-5 text-center shadow-lg transition-all duration-300 ${
                slot.isBooked ? "bg-green-200 border border-green-400" : "bg-white border border-gray-300"
              }`}
            >
              <p className="text-xl font-semibold text-gray-800 mb-2">
                {slot.slot || `${slot.hour}:00 - ${slot.hour + 1}:00`}
              </p>
              <p className="text-sm text-gray-600 mb-3">
                {slot.isBooked ? `Booked by: ${slot.bookedBy || "Unknown"}` : "Available"}
              </p>

              {slot.isBooked ? (
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition"
                  onClick={() => unbookSlot(slot)}
                >
                  Unbook
                </button>
              ) : (
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition"
                  onClick={() => bookSlot(slot)}
                >
                  Book
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SlotView;
