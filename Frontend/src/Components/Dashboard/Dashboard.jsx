import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Dummy data for the charts
const visitData = [
  { name: 'Jan', visits: 5 },
  { name: 'Feb', visits: 8 },
  { name: 'Mar', visits: 12 },
  { name: 'Apr', visits: 18 },
  { name: 'May', visits: 24 },
  { name: 'Jun', visits: 30 },
];

const conditionData = [
  { name: 'Jan', condition: 2 },
  { name: 'Feb', condition: 3 },
  { name: 'Mar', condition: 5 },
  { name: 'Apr', condition: 4 },
  { name: 'May', condition: 6 },
  { name: 'Jun', condition: 8 },
];

const procedureData = [
  { date: '01-01-2025', procedure: 'Routine Checkup' },
  { date: '15-01-2025', procedure: 'Blood Test' },
  { date: '10-02-2025', procedure: 'X-Ray' },
  { date: '20-02-2025', procedure: 'MRI Scan' },
  { date: '05-03-2025', procedure: 'CT Scan' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, loading, setUser, logout } = useAuth();

  // Function to handle navigation
  const handleNavigation = (path) => {
    navigate(path);
  };

  // Function to handle logout
  const handleLogout = () => {
    setUser(null); 
    localStorage.removeItem('user'); 
    navigate('/login'); 
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    navigate('/login');
    return <div>Please log in to access the dashboard.</div>;
  }

  return (
    <div className="flex min-h-screen bg-blue-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-10">Patient Portal</h2>
          <ul className="space-y-4 text-sm">
            <li className="hover:bg-blue-700 px-3 py-2 rounded">
              <button onClick={() => handleNavigation('/dashboard')}>Patient Portal</button>
            </li>
            <li className="hover:bg-blue-700 px-3 py-2 rounded">
              <button onClick={() => handleNavigation('/overview')}>Overview</button>
            </li>
            <li className="hover:bg-blue-700 px-3 py-2 rounded">
              <button onClick={() => handleNavigation('/download')}>Download</button>
            </li>
            <li className="hover:bg-blue-700 px-3 py-2 rounded">
              <button onClick={() => handleNavigation('/filters')}>Show Filters</button>
            </li>
            <li className="hover:bg-blue-700 px-3 py-2 rounded">
              <button onClick={() => handleNavigation('/ai-doctor')}>AI Doctor</button>
            </li>
            <li className="hover:bg-blue-700 px-3 py-2 rounded">
              <button onClick={() => handleNavigation('/book')}>Book an Appointment</button>
            </li>
          </ul>
        </div>
        <div className="text-xs mt-10">
          <p>LoveYourData@lovelytics.com</p>
          <p>(571) 403-0283</p>
          <p>Arlington, VA 22201</p>
          <p className="mt-2">Designed by Eric Balash</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-white overflow-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-blue-800">Welcome, {user.email || 'Guest'}.</h1>
          <p className="text-sm text-red-500 mt-1">
            Attention: Data below should only be shared and discussed with the patient directly
          </p>
        </div>

        {/* Logout Button */}
        <div className="mb-6">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Log Out
          </button>
        </div>

        {/* Patient Profile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Profile Card */}
          <div className="md:col-span-2 bg-white rounded-xl shadow p-6 flex items-center gap-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-sm">
              Img
            </div>
            <div>
              <h2 className="text-lg font-semibold text-blue-800">{user.name || 'Patient Name'}</h2>
              <p><strong>DOB:</strong> {user.dob || 'N/A'}</p>
              <p><strong>Gender:</strong> {user.gender || 'N/A'}</p>
              <p><strong>Address:</strong> {user.address || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* History Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visit History */}
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold text-blue-800 text-sm mb-3">Visit History</h3>
            <div className="h-40 bg-gray-100 rounded flex items-center justify-center text-gray-500 text-sm">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={visitData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="visits" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Condition History */}
          <div className="bg-white rounded-xl shadow p-4 lg:col-span-2">
            <h3 className="font-semibold text-blue-800 text-sm mb-3">Condition History</h3>
            <div className="h-40 bg-gray-100 rounded flex items-center justify-center text-gray-500 text-sm">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={conditionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="condition" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Procedure History */}
          <div className="bg-white rounded-xl shadow p-4 lg:col-span-3">
            <h3 className="font-semibold text-blue-800 text-sm mb-3">Procedure History</h3>
            <div className="h-40 bg-gray-100 rounded flex items-center justify-center text-gray-500 text-sm">
              <ul className="space-y-2">
                {procedureData.map((procedure, index) => (
                  <li key={index} className="text-gray-700">
                    <strong>{procedure.date}:</strong> {procedure.procedure}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
