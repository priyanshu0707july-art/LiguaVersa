import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import MeetingRoom from './pages/MeetingRoom';
import MeetingSummary from './pages/MeetingSummary';
import Scene from './components/canvas/Scene';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <>
            <div id="canvas-container">
              <Scene />
            </div>
            <div className="content-layer">
              <Navbar />
              <Home />
              <Footer />
            </div>
          </>
        } />
        <Route path="/auth" element={<><div id="canvas-container"><Scene /></div><div className="content-layer"><Auth /></div></>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/meet/:id" element={<MeetingRoom />} />
        <Route path="/summary/:id" element={<MeetingSummary />} />
      </Routes>
    </Router>
  );
}

export default App;
