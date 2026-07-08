import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import VideoGrid from '../components/meeting/VideoGrid';
import ControlBar from '../components/meeting/ControlBar';
import Sidebar from '../components/meeting/Sidebar';
import '../components/meeting/Meeting.css';

const MeetingRoom = () => {
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // chat, participants, notes
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // Mock participants data for layout testing
  const [participants, setParticipants] = useState([
    { id: '1', name: 'You', isLocal: true, speaking: true, muted: isMuted, videoOff: isVideoOff },
    { id: '2', name: 'Alex Johnson', isLocal: false, speaking: false, muted: false, videoOff: false },
    { id: '3', name: 'Maria Garcia', isLocal: false, speaking: false, muted: true, videoOff: false },
    { id: '4', name: 'Kenji Sato', isLocal: false, speaking: false, muted: false, videoOff: true },
  ]);

  // Sync local controls with state
  useEffect(() => {
    setParticipants(prev => prev.map(p => p.isLocal ? { ...p, muted: isMuted, videoOff: isVideoOff } : p));
  }, [isMuted, isVideoOff]);

  const toggleSidebar = (tab) => {
    if (sidebarOpen && activeTab === tab) {
      setSidebarOpen(false);
    } else {
      setActiveTab(tab);
      setSidebarOpen(true);
    }
  };

  return (
    <div className="meeting-container">
      {/* Background layer for cinematic feel */}
      <div className="meeting-bg"></div>

      <div className="meeting-main">
        {/* Main Video Area */}
        <div className={`meeting-grid-area ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <div className="meeting-header glass">
            <h2>Meeting: {id}</h2>
            <div className="meeting-badges">
              <span className="badge">HD 4K</span>
              <span className="badge green">Encrypted</span>
            </div>
          </div>

          <VideoGrid participants={participants} />
          
          <ControlBar 
            isMuted={isMuted} setIsMuted={setIsMuted}
            isVideoOff={isVideoOff} setIsVideoOff={setIsVideoOff}
            toggleSidebar={toggleSidebar}
            activeTab={sidebarOpen ? activeTab : null}
          />
        </div>

        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          activeTab={activeTab} 
          onClose={() => setSidebarOpen(false)} 
          participants={participants}
        />
      </div>
    </div>
  );
};

export default MeetingRoom;
