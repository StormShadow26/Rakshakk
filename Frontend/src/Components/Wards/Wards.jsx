import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Wards = () => {
  const [wards, setWards] = useState([]);
  const [newWardName, setNewWardName] = useState("");
  const navigate = useNavigate();

  const fetchWards = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/wards");
      setWards(res.data);
    } catch (err) {
      console.error("Error fetching wards:", err);
      alert("Failed to fetch wards. Check console for details.");
    }
  };

  useEffect(() => {
    fetchWards();
  }, []);

  const addWard = async () => {
    if (!newWardName.trim()) {
      alert("Ward name cannot be empty.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/api/wards", { name: newWardName });
      setNewWardName("");
      fetchWards();
    } catch (err) {
      console.error("Error adding ward:", err.response?.data || err.message);
      alert("Failed to add ward. Check console for details.");
    }
  };

  const deleteWard = async (wardId) => {
    try {
      await axios.delete(`http://localhost:4000/api/wards/${wardId}`);
      fetchWards();
    } catch (err) {
      console.error("Error deleting ward:", err);
      alert("Failed to delete ward. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 text-sky-900 p-8 flex flex-col items-center">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-5xl border border-sky-100">
        <h1 className="text-3xl font-bold text-center mb-6 text-sky-800 tracking-wider">🏥 Ward Management</h1>

        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
          <input
            value={newWardName}
            onChange={(e) => setNewWardName(e.target.value)}
            className="flex-1 px-4 py-2 rounded-md bg-sky-100 text-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-400 border border-sky-200"
            placeholder="Enter new ward name"
          />
          <button
            onClick={addWard}
            disabled={!newWardName.trim()}
            className={`bg-sky-600 hover:bg-sky-700 px-5 py-2 rounded-md shadow-md transition text-white font-medium ${!newWardName.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            ➕ Add Ward
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wards.map((ward) => {
            const totalBeds = ward.beds.length;
            const availableBeds = ward.beds.filter(b => !b.occupied).length;
            return (
              <div
                key={ward._id}
                onClick={() => navigate(`/wards/${ward._id}`)}
                className="cursor-pointer bg-sky-100 hover:bg-sky-200 rounded-lg p-5 shadow-sm border border-sky-200 transition transform hover:scale-[1.02]"
              >
                <h2 className="text-xl font-semibold mb-2 text-sky-800">{ward.name}</h2>
                <p className="text-sm">Total Beds: <span className="font-semibold">{totalBeds}</span></p>
                <p className="text-sm">Available Beds: <span className="font-semibold">{availableBeds}</span></p>
                <div className="mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteWard(ward._id);
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded shadow-sm transition text-sm"
                  >
                    🗑 Delete Ward
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Wards;
