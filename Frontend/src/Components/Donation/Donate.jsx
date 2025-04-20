import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import im1 from "./im1.jpg";
import im2 from "./im2.jpg";
import im3 from "./im3.jpg";
import im4 from "./im4.jpg";
import im5 from "./im5.jpg";

const COLORS = ['#845EC2', '#FFC75F', '#F9F871', '#00C9A7', '#D65DB1', '#FF6F91'];

const Donate = () => {
  const [amount, setAmount] = useState('');
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  const [donations, setDonations] = useState([]);
  const images = [im1, im2, im3, im4, im5];

  useEffect(() => {
    const stored = localStorage.getItem('simulatedDonations');
    if (stored) setDonations(JSON.parse(stored));
  }, []);

  const addDonation = (donation) => {
    const updated = [...donations, donation];
    setDonations(updated);
    localStorage.setItem('simulatedDonations', JSON.stringify(updated));
  };

  const handleSimulate = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    const parsedAmount = parseFloat(amount).toFixed(4);
    const simulatedDonation = {
      amount: parsedAmount,
      hash: `sim-${Date.now()}`,
    };
    addDonation(simulatedDonation);
    setAmount('');
  };

  const handleRealDonate = async () => {
    if (!window.ethereum || !amount) {
      setError('MetaMask not available or amount not set.');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tx = await signer.sendTransaction({
        to: '0x1b44533F7AAbf9d749921F39D6F5Ad1B123Df3cb',
        value: ethers.parseEther(amount),
      });

      const donationData = {
        amount: parseFloat(amount).toFixed(4),
        hash: tx.hash,
      };

      setTxHash(tx.hash);
      addDonation(donationData);

      await fetch('http://localhost:4000/api/v1/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donationData),
      });

      setAmount('');
    } catch (err) {
      setError(err.message || 'Transaction failed');
      console.error('Real donation failed:', err);
    }
  };

  const totalDonated = donations.reduce((sum, d) => sum + parseFloat(d.amount), 0).toFixed(4);
  const averageDonation = donations.length ? (totalDonated / donations.length).toFixed(4) : '0.0000';
  const largestDonation = donations.length
    ? Math.max(...donations.map((d) => parseFloat(d.amount))).toFixed(4)
    : '0.0000';

  const chartData = donations.map((d, i) => ({
    name: `Tx ${i + 1}`,
    value: parseFloat(d.amount),
  }));

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center">
      
      {/* Slideshow Background with Donation Overlay */}
      <div className="relative w-full h-[600px] overflow-hidden mb-16">
        {/* Sliding images */}
        <div className="absolute inset-0 w-[200%] h-full flex animate-slide">
          {[...images, ...images].map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Slide ${idx + 1}`}
              className="w-[20%] h-full object-cover filter brightness-75"
            />
          ))}
        </div>

        {/* Donation Form Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white bg-opacity-90 rounded-3xl shadow-2xl p-10 max-w-3xl w-[90%] mx-auto">
            <h1 className="text-4xl font-extrabold text-center mb-4 text-indigo-700">Make a Difference ❤️</h1>
            <p className="text-center text-gray-600 mb-6 text-lg">Support our mission by donating Ethereum (simulated or real).</p>

            <input
              type="number"
              placeholder="Enter amount in ETH"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6 text-lg"
            />

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleSimulate}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg text-lg transition"
              >
                Simulate Donation
              </button>
              <button
                onClick={handleRealDonate}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg text-lg transition"
              >
                Real Donation
              </button>
            </div>

            {txHash && (
              <p className="mt-4 text-green-600 text-sm">
                Transaction Sent! Hash:{' '}
                <a
                  href={`https://sepolia.etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="underline text-blue-700"
                >
                  {txHash}
                </a>
              </p>
            )}

            {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
          </div>
        </div>
      </div>

      {/* History & Chart Section */}
      <div className="mt-0 bg-white p-10 rounded-3xl shadow-2xl max-w-4xl w-full">
        <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">🧾 Donation History</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center">
          <div className="bg-indigo-100 p-6 rounded-xl shadow-md">
            <h3 className="text-indigo-700 font-extrabold text-2xl">{totalDonated} ETH</h3>
            <p className="text-gray-600 mt-1">Total Donated</p>
          </div>
          <div className="bg-yellow-100 p-6 rounded-xl shadow-md">
            <h3 className="text-yellow-700 font-extrabold text-2xl">{averageDonation} ETH</h3>
            <p className="text-gray-600 mt-1">Average Donation</p>
          </div>
          <div className="bg-green-100 p-6 rounded-xl shadow-md">
            <h3 className="text-green-700 font-extrabold text-2xl">{largestDonation} ETH</h3>
            <p className="text-gray-600 mt-1">Largest Donation</p>
          </div>
        </div>

        {donations.length === 0 ? (
          <p className="text-gray-500 text-center">No donations yet.</p>
        ) : (
          <>
            <ul className="space-y-4 mb-8">
              {donations.map((donation, index) => (
                <li
                  key={index}
                  className="bg-gray-100 p-5 rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center"
                >
                  <span className="text-lg font-medium text-gray-800">
                    💰 {donation.amount} ETH{' '}
                    <span className="text-xs text-gray-500 ml-2">
                      ({donation.hash.startsWith('sim') ? 'Simulated' : 'Real'})
                    </span>
                  </span>
                  <span className="text-sm text-gray-500 mt-2 md:mt-0">ID: {donation.hash}</span>
                </li>
              ))}
            </ul>

            <div className="w-full h-[350px]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    label
                  >
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Donate;
