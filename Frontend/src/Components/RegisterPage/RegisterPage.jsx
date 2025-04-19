import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    role: 'Patient',
    latitude: '',
    longitude: '',
  });

  const navigate = useNavigate(); // useNavigate hook for programmatic navigation

  // Handle form data changes
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Get the user's current location
  const handleGetLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation not supported');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Modify lastname for Admin role before submission
    if (formData.role === 'Admin') {
      setFormData((prev) => ({
        ...prev,
        lastname: 'Hospital', // set lastname to "Hospital" for Admin role
      }));
    }

    try {
      const res = await axios.post('http://localhost:4000/api/users/register', formData);
      alert(res.data.message);
      
      // Redirect based on the role after successful registration
      if (res.data.message === "User registered successfully") {
        if (res.data.user.role === "Admin") {
          navigate("/doctor"); // Redirect to /doctor for Admin
        } else {
          navigate("/dashboard"); // Redirect to /dashboard for other roles
        }
      }

    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 flex items-center justify-center text-white px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20">
        <h2 className="text-3xl font-bold text-center mb-6">Create Your Account</h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-white text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="Patient">Patient</option>
              <option value="Doctor">Doctor</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* Conditionally render inputs based on the role */}
          {formData.role !== 'Admin' && (
            <>
              <div>
                <label className="block text-sm font-semibold mb-1">First Name</label>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  placeholder="John"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
            </>
          )}

          {formData.role === 'Admin' && (
            <div>
              <label className="block text-sm font-semibold mb-1">Name of Hospital</label>
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                placeholder="Hospital Name"
                required
                className="w-full px-4 py-3 rounded-lg bg-white text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 rounded-lg bg-white text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              required
              className="w-full px-4 py-3 rounded-lg bg-white text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm">
              {formData.latitude && formData.longitude
                ? `📍 Location enabled`
                : `📍 Location not set`}
            </span>
            <button
              type="button"
              onClick={handleGetLocation}
              className="text-xs text-indigo-200 underline hover:text-white"
            >
              Get Current Location
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-indigo-900 font-bold py-3 rounded-lg hover:bg-indigo-100 transition"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-300">
          Already have an account?{' '}
          <Link to="/login" className="text-white font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
