import React from 'react';
import { FaHeart, FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import WebScrapping from './WebScrapping';
import teamImage from './team1.png';
import aryan from './aryan.jpeg';
import tanishq from './tanishqPhoto.jpg';
import ashish from './ashish.jpeg';
import vatsal from './vatsal.jpeg';
import bg from './bg.png';

const Heropage = () => {
  const teamMembers = [
    {
      name: "Tanishq Gupta",
      role: "Founder (CEO)",
      desc: "Graduating from MNNIT ALLAHBAD with a degree in Computer Science",
      image: tanishq,
    },
    {
      name: "Aryan Sharma",
      role: "Founder (CEO)",
      desc: "Graduating from MNNIT ALLAHBAD with a degree in Computer Science",
      image: aryan,
    },
    {
      name: "Ashish Jha",
      role: "Founder (CEO)",
      desc: "Graduating from MNNIT ALLAHBAD with a degree in Computer Science",
      image: ashish,
    },
    {
      name: "Yalamanchili Vatsal",
      role: "Founder (CEO)",
      desc: "Graduating from MNNIT ALLAHBAD with a degree in Computer Science",
      image: vatsal,
    }
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 text-white min-h-screen flex flex-col overflow-x-hidden">
      {/* Navbar */}
      <nav className="w-full bg-indigo-950 px-8 py-5 flex justify-between items-center shadow-md z-10">
        <div className="flex items-center gap-2">
          <FaHeart className="text-red-500 text-2xl" />
          <span className="text-xl font-bold">Rakshak</span>
        </div>
        <div className="space-x-6">
          <Link to="/about" className="hover:text-gray-300 transition">About</Link>
          <Link to="/login" className="hover:text-gray-300 transition">Login</Link>
          <Link to="/register" className="bg-white text-indigo-900 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-100 transition">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center px-8 py-36 w-full">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
              Redefining Trust in <br /> Healthcare
            </h1>
            <p className="text-lg sm:text-xl text-gray-300">
              Rakshak stands by you—protecting lives and delivering the compassionate care you deserve.
            </p>
            <div className="flex gap-4">
              <Link to="/register" className="bg-white text-indigo-800 font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-indigo-100 transition">
                Get Started
              </Link>
              <Link to="/learnmore" className="bg-transparent border border-white px-6 py-3 rounded-xl hover:bg-white hover:text-indigo-800 transition">
                Learn More
              </Link>
            </div>
          </div>

          <div className="flex justify-center relative">
            {/* Glow Effect */}
            <div className="absolute w-[80%] h-[80%] bg-indigo-500 blur-3xl rounded-3xl opacity-30 z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            {/* Image */}
            <img
              src={bg}
              alt="Team"
              className="rounded-3xl shadow-xl border border-white/20 w-full max-w-md object-cover relative z-10"
            />
          </div>
        </div>
      </main>

      <WebScrapping />

      {/* Parallax Image Section */}
      <div
        className="relative bg-fixed bg-center bg-cover h-[60vh] flex items-center justify-center"
        style={{ backgroundImage: `url(${teamImage})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">Meet Our Team</h2>
        </div>
      </div>

      {/* Team Section */}
      <section className="py-16 px-4 md:px-16 bg-indigo-950">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">TEAM</h1>
          <h2 className="text-3xl font-semibold text-white mt-2">Founder Team</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-lg text-center transition transform hover:scale-105">
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-indigo-500"
              />
              <h3 className="text-xl font-bold">{member.name}</h3>
              <p className="text-indigo-200 mb-1">{member.role}</p>
              <p className="text-gray-300 text-sm">{member.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-950 text-gray-300 px-8 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-3">Contact Us</h3>
            <p>Email: contact@rakshak.io</p>
            <p>Phone: +91 9876543210</p>
            <p>Address: 123 Rakshak Avenue, Tech City, IN</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Useful Links</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="hover:underline">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:underline">Terms of Service</Link></li>
              <li><Link to="/support" className="hover:underline">Support</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Follow Us</h3>
            <div className="flex gap-4 text-2xl">
              <a href="https://instagram.com/dummyhandle" target="_blank" rel="noreferrer">
                <FaInstagram className="hover:text-white transition" />
              </a>
              <a href="https://twitter.com/dummyhandle" target="_blank" rel="noreferrer">
                <FaTwitter className="hover:text-white transition" />
              </a>
              <a href="https://facebook.com/dummyhandle" target="_blank" rel="noreferrer">
                <FaFacebook className="hover:text-white transition" />
              </a>
            </div>
          </div>
        </div>

        <div className="text-center text-sm mt-10 text-gray-400">
          © {new Date().getFullYear()} Rakshak. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Heropage;
