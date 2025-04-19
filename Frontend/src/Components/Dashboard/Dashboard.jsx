import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext'; // Import the useAuth hook

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, loading, setUser,logout } = useAuth(); // Access user and loading from AuthContext

  // Function to handle navigation
  const handleNavigation = (path) => {
    navigate(path);
  };

  console.log("Logged in user:"+user);
  // Function to handle logout
  const handleLogout = () => {
    setUser(null); // Clears the user from context
    localStorage.removeItem('user'); // Assuming user details are stored under 'user'
    navigate('/login'); // Redirect to login page

  };

  // Show loading indicator while checking for user
  if (loading) {
    return <div>Loading...</div>;
  }

  // If the user is not logged in, redirect to login page (or display a message)
  if (!user) {
    navigate('/login'); // Optionally redirect if no user is logged in
    return <div>Please log in to access the dashboard.</div>;
  }

  return (
    <div className="flex min-h-screen font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1c2b39] text-white p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-10">Patient Portal</h2>
          <ul className="space-y-4 text-sm">
            <li className="bg-[#30455c] px-3 py-2 rounded">
              <button onClick={() => handleNavigation('/dashboard')}>Patient Portal</button>
            </li>
            <li className="hover:bg-[#30455c] px-3 py-2 rounded cursor-pointer">
              <button onClick={() => handleNavigation('/overview')}>Overview</button>
            </li>
            <li className="hover:bg-[#30455c] px-3 py-2 rounded cursor-pointer">
              <button onClick={() => handleNavigation('/download')}>Download</button>
            </li>
            <li className="hover:bg-[#30455c] px-3 py-2 rounded cursor-pointer">
              <button onClick={() => handleNavigation('/filters')}>Show Filters</button>
            </li>
            {/* New Routes */}
            <li className="hover:bg-[#30455c] px-3 py-2 rounded cursor-pointer">
              <button onClick={() => handleNavigation('/ai-doctor')}>AI Doctor</button>
            </li>
            <li className="hover:bg-[#30455c] px-3 py-2 rounded cursor-pointer">
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
      <main className="flex-1 p-8 bg-[#f9fafe] overflow-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Welcome, {user.email || 'Guest'}.</h1>
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

        {/* Patient Profile & Location */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Profile Card */}
          <div className="md:col-span-2 bg-white rounded-xl shadow p-6 flex items-center gap-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-sm">
              Img
            </div>
            <div>
              <h2 className="text-lg font-semibold">{user.name || 'Patient Name'}</h2>
              <p><strong>DOB:</strong> {user.dob || 'N/A'}</p>
              <p><strong>Gender:</strong> {user.gender || 'N/A'}</p>
              <p><strong>Address:</strong> {user.address || 'N/A'}</p>
            </div>
          </div>

          {/* Location Map */}
          <div className="bg-white rounded-xl shadow p-4 h-full flex justify-center items-center text-gray-500">
            Location Map
          </div>
        </div>

        {/* History Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visit History */}
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold text-sm mb-3">Visit History</h3>
            <div className="h-40 bg-gray-100 rounded flex items-center justify-center text-gray-500 text-sm">
              Visit timeline
            </div>
          </div>

          {/* Condition History */}
          <div className="bg-white rounded-xl shadow p-4 lg:col-span-2">
            <h3 className="font-semibold text-sm mb-3">Condition History</h3>
            <div className="h-40 bg-gray-100 rounded flex items-center justify-center text-gray-500 text-sm">
              Condition timeline
            </div>
          </div>

          {/* Procedure History */}
          <div className="bg-white rounded-xl shadow p-4 lg:col-span-3">
            <h3 className="font-semibold text-sm mb-3">Procedure History</h3>
            <div className="h-40 bg-gray-100 rounded flex items-center justify-center text-gray-500 text-sm">
              Procedure timeline
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
