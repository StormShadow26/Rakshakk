import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';

// Context
import { AuthProvider } from './Context/AuthContext.jsx';
import LobbyScreen from './screens/Lobby.jsx';
import RoomPage from './screens/Room.jsx';
// Pages
import Heropage from './Components/HeroPage/Heropage.jsx';
import LoginPage from './Components/LoginPage/LoginPage.jsx';
import RegisterPage from './Components/RegisterPage/RegisterPage.jsx';
import Donate from './Components/Donation/Donate.jsx';

import DoctorDashboard from './Components/Doctor/DoctorDashboard.jsx';
import Patients from './Components/Doctor/Patients.jsx';
import UpdatePatientData from './Components/Doctor/UpdatePatientData.jsx';

import WardDetail from './Components/Wards/WardDetails.jsx';
import Wards from './Components/Wards/Wards.jsx';

import Dashboard from './Components/Dashboard/Dashboard.jsx';
import AiDoctor from './Components/Dashboard/AiDoctor.jsx';
import Book from './Components/Dashboard/Book.jsx';

import Doctors from './Components/Doctors/Doctors.jsx';
// If UpdateData is missing, make sure it's created and imported:
// import UpdateData from './Components/Doctor/UpdateData.jsx'; // If this file exists
import SlotView from './Components/Doctors/SlotView.jsx';
import DoctorList from './Components/Dashboard/DoctorList.jsx';
import Help from './Components/Help/Help.jsx'
export default function App() {
  return (
    <AuthProvider>
      <Routes>
        
        <Route path="/" element={<Heropage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/donate" element={<Donate />} />

        {/* Doctor Section */}
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/help" element={<Help />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/UpdatePatientData" element={<UpdatePatientData />} />
        {/* <Route path="/UpdateData" element={<UpdateData />} /> */}

        {/* Wards */}
        <Route path="/wards" element={<Wards />} />
        <Route path="/wards/:wardId" element={<WardDetail />} />

        {/* Patient Dashboard */}
        <Route path="/patient-dashboard" element={<Dashboard />} />
        <Route path="/ai-doctor" element={<AiDoctor />} />
        <Route path="/book" element={<Book />} />

        {/* Doctors */}
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/listDoctors/:email" element={<DoctorList />} />
        <Route path="/doctor/:id/slots" element={<SlotView />} />

        {/*Video call*/}
        <Route path='/videoCall' element={<LobbyScreen></LobbyScreen>}></Route>
        <Route  path="/room/:roomId" element={<RoomPage />}></Route>
      </Routes>
    </AuthProvider>
  );
}
