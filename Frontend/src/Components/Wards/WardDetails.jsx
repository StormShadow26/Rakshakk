import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const WardDetail = () => {
  const { wardId } = useParams();
  const [ward, setWard] = useState(null);

  const fetchWard = async () => {
    const res = await axios.get(`http://localhost:4000/api/wards/${wardId}`);
    setWard(res.data);
  };

  useEffect(() => {
    fetchWard();
  }, [wardId]);

  const addBed = async () => {
    await axios.post(`http://localhost:4000/api/wards/${wardId}/beds`);
    fetchWard();
  };

  const deleteBed = async (bedNumber) => {
    await axios.delete(`http://localhost:4000/api/wards/${wardId}/beds/${bedNumber}`);
    fetchWard();
  };

  const allotBed = async (bedNumber, patientId) => {
    await axios.post(`http://localhost:4000/api/wards/${wardId}/beds/${bedNumber}/allot`, { patientId });
    fetchWard();
  };

  const vacateBed = async (bedNumber) => {
    await axios.post(`http://localhost:4000/api/wards/${wardId}/beds/${bedNumber}/vacate`);
    fetchWard();
  };

  if (!ward) return <div className="text-sky-900 p-10">Loading...</div>;

  return (
    <div className="bg-sky-50 min-h-screen flex flex-col items-center py-10 px-6 text-sky-900">
      <div className="max-w-5xl w-full">
        <h1 className="text-4xl font-bold mb-8 text-center text-sky-800">
          🏥 {ward.name} - Bed Management
        </h1>

        <div className="flex justify-center mb-8">
          <button
            onClick={addBed}
            className="bg-sky-600 hover:bg-sky-700 px-6 py-2 rounded-full shadow text-white transition"
          >
            ➕ Add Bed
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
          {ward.beds.map((bed) => (
            <div
              key={bed.number}
              className={`relative w-full h-44 rounded-2xl flex flex-col justify-center items-center text-center font-semibold transition-all duration-300 shadow-lg border ${
                bed.occupied ? 'bg-emerald-300 border-emerald-600' : 'bg-sky-200 border-sky-500'
              }`}
            >
              <span className="text-xl font-bold text-sky-900">Bed {bed.number}</span>
              {bed.occupied && (
                <span className="text-sm mt-1 text-sky-800 font-medium break-words px-2">
                  🧍 {bed.patientId}
                </span>
              )}

              <div className="absolute inset-0 bg-slate-200 bg-opacity-95 rounded-2xl opacity-0 hover:opacity-100 transition flex flex-col justify-center items-center px-4 py-3">
                {bed.occupied ? (
                  <button
                    onClick={() => vacateBed(bed.number)}
                    className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1.5 text-sm rounded mb-2 text-white w-full"
                  >
                    Set Vacant
                  </button>
                ) : (
                  <>
                    <input
                      type="text"
                      id={`input-${bed.number}`}
                      placeholder="Patient ID"
                      className="text-sky-900 text-sm px-3 py-1 rounded mb-2 w-full border border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <button
                      onClick={() => {
                        const pid = document.getElementById(`input-${bed.number}`).value;
                        if (pid) allotBed(bed.number, pid);
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 text-sm rounded mb-2 text-white w-full"
                    >
                      Allot Patient
                    </button>
                  </>
                )}
                <button
                  onClick={() => deleteBed(bed.number)}
                  className="bg-red-500 hover:bg-red-600 px-3 py-1.5 text-sm rounded text-white w-full"
                >
                  Delete Bed
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WardDetail;
