import React, { useState, useEffect } from "react";
import axios from "axios";
import { useMyContext } from "../../Context/myContext.jsx";
import { Link } from "react-router-dom";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const { userInfo } = useMyContext();

  const emaili = userInfo?.email;
  console.log("enail is:" + emaili);
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    age: "",
    hospitalEmail: emaili || "",
    qualification: "",
    specialization: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/doctors")
      .then((response) => setDoctors(response.data))
      .catch((error) => console.error("Error fetching doctors:", error));
  }, []);

  const addDoctor = async () => {
    try {
      const doctorToAdd = {
        ...newDoctor,
        age: Number(newDoctor.age),
        hospitalEmail:emaili
      };

      const response = await axios.post(
        "http://localhost:4000/api/doctors",
        doctorToAdd
      );
      setDoctors([...doctors, response.data]);
      setNewDoctor({
        name: "",
        age: "",
        qualification: "",
        specialization: "",
      });
    } catch (error) {
      console.error("Error adding doctor:", error);
    }
  };

  const removeDoctor = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/doctors/${id}`);
      setDoctors(doctors.filter((doctor) => doctor._id !== id));
    } catch (error) {
      console.error("Error deleting doctor:", error);
    }
  };

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-tr from-[#f0e6ff] to-[#e2f0ff] text-gray-800 font-[Roboto, sans-serif]">
      <h2 className="text-4xl font-bold text-center mb-12 text-[#4c0070] drop-shadow-md tracking-wide">
        🩺 Doctor Dashboard
      </h2>

      {/* Add New Doctor Form */}
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-3xl mx-auto mb-16 border border-[#d1c4e9]">
        <h3 className="text-2xl font-semibold text-center text-[#4c0070] mb-6">
          Add New Doctor
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="Name"
            value={newDoctor.name}
            onChange={(e) =>
              setNewDoctor({ ...newDoctor, name: e.target.value })
            }
            className="p-4 rounded-lg border border-[#c5b3e6] bg-[#f9f5ff] text-[#4c0070] placeholder-[#bfa7e3] focus:outline-none focus:ring-2 focus:ring-[#a88cc9]"
          />
          <input
            type="number"
            placeholder="Age"
            value={newDoctor.age}
            onChange={(e) =>
              setNewDoctor({ ...newDoctor, age: e.target.value })
            }
            className="p-4 rounded-lg border border-[#c5b3e6] bg-[#f9f5ff] text-[#4c0070] placeholder-[#bfa7e3] focus:outline-none focus:ring-2 focus:ring-[#a88cc9]"
          />
          <input
            type="text"
            placeholder="Qualification"
            value={newDoctor.qualification}
            onChange={(e) =>
              setNewDoctor({ ...newDoctor, qualification: e.target.value })
            }
            className="p-4 rounded-lg border border-[#c5b3e6] bg-[#f9f5ff] text-[#4c0070] placeholder-[#bfa7e3] focus:outline-none focus:ring-2 focus:ring-[#a88cc9]"
          />
          <input
            type="text"
            placeholder="Specialization"
            value={newDoctor.specialization}
            onChange={(e) =>
              setNewDoctor({ ...newDoctor, specialization: e.target.value })
            }
            className="p-4 rounded-lg border border-[#c5b3e6] bg-[#f9f5ff] text-[#4c0070] placeholder-[#bfa7e3] focus:outline-none focus:ring-2 focus:ring-[#a88cc9]"
          />
        </div>
        <div className="mt-8 text-center">
          <button
            onClick={addDoctor}
            className="bg-gradient-to-r from-[#a88cc9] to-[#845ec2] text-white px-8 py-3 font-semibold rounded-full hover:scale-105 hover:shadow-lg transition-all duration-300"
          >
            ➕ Add Doctor
          </button>
        </div>
      </div>

      {/* Doctor Cards */}
      <div className="flex flex-wrap justify-center gap-8">
        {Array.isArray(doctors) &&
          doctors.map((doctor, index) => (
            <div
              key={doctor._id || index}
              className="w-80 bg-white border border-[#d1c4e9] rounded-lg shadow-md p-6 text-[#4c0070] hover:scale-105 transition-transform duration-300"
            >
              <h4 className="text-xl font-semibold mb-2">
                {doctor.name || "Unnamed"}
              </h4>
              <p className="text-sm mb-1">
                <span className="font-medium">Age:</span> {doctor.age || "N/A"}
              </p>
              <p className="text-sm mb-1">
                <span className="font-medium">Qualification:</span>{" "}
                {doctor.qualification || "N/A"}
              </p>
              <p className="text-sm mb-4">
                <span className="font-medium">Specialization:</span>{" "}
                {doctor.specialization || "N/A"}
              </p>

              <Link to={`/doctor/${doctor._id}/slots`}>
                <button className="w-full bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-full font-medium transition duration-200 mb-3">
                  🗓️ View Slots
                </button>
              </Link>

              <button
                onClick={() => removeDoctor(doctor._id)}
                className="w-full bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-full font-medium transition duration-200"
              >
                ❌ Remove
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Doctors;
