import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useMyContext } from '../../Context/myContext.jsx';
import { useAuth } from '../../Context/AuthContext.jsx';

const LoginPage = () => {
  const { storeUserInfo } = useMyContext();
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUser(user);
      navigate('/patient-dashboard');
    }
  }, [setUser, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          () => reject('Could not get location')
        );
      } else {
        reject('Geolocation not supported');
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const location = await getLocation();

      const loginPayload = {
        ...formData,
        latitude: location.latitude,
        longitude: location.longitude,
      };

      const res = await axios.post(
        'http://localhost:4000/api/users/login',
        loginPayload,
        { withCredentials: true }
      );

      const user = res.data.user;

      storeUserInfo({ _id: user._id, email: user.email });
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'Patient') {
        navigate('/patient-dashboard');
      } else if (user.role === 'Admin') {
        navigate('/doctor');
      } else {
        setError('Only Patients or Hospitals can log in here.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 flex items-center justify-center text-white px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20">
        <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg bg-white text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg bg-white text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              required
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <Link to="/forgot-password" className="text-white hover:underline">
              Forgot password?
            </Link>
          </div>

          {error && (
            <p className="text-red-300 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-white text-indigo-900 font-bold py-3 rounded-lg hover:bg-indigo-100 transition"
          >
            Log In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-300">
          Don’t have an account?{' '}
          <Link to="/register" className="text-white font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
