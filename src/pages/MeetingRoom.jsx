import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import VideoGrid from '../components/meeting/VideoGrid';
import ControlBar from '../components/meeting/ControlBar';
import Sidebar from '../components/meeting/Sidebar';
import { BACKEND_URL } from '../config';
import '../components/meeting/Meeting.css';

const MeetingRoom = () => {
  const { id } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('chat'); // chat, participants, ai
  const [backendStatus, setBackendStatus] = useState('Connecting...');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // Mock participants data for layout testing
  const [participants, setParticipants] = useState([
    { id: '1', name: 'You', isLocal: true, speaking: true, muted: isMuted, videoOff: isVideoOff },
    { id: '2', name: 'Alex Johnson', isLocal: false, speaking: false, muted: false, videoOff: false },
    { id: '3', name: 'Maria Garcia', isLocal: false, speaking: false, muted: true, videoOff: false },
    { id: '4', name: 'Kenji Sato', isLocal: false, speaking: false, muted: false, videoOff: true },
  ]);
  
  useEffect(() => {
    // 1. Establish connection to the NestJS Backend
    const socket = io(BACKEND_URL, {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('✅ Connected to LinguaVerse Backend Server!', socket.id);
      setBackendStatus('Connected to Backend');
      
      // 2. Join the specific Meeting Room
      socket.emit('join-room', { roomId: id });
    });

    socket.on('user-joined', (data) => {
      console.log('👤 Another user joined the room:', data.userId);
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from backend');
      setBackendStatus('Disconnected');
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [id]);

  // Sync local controls with state
  useEffect(() => {
    setParticipants(prev => prev.map(p => p.isLocal ? { ...p, muted: isMuted, videoOff: isVideoOff } : p));
  }, [isMuted, isVideoOff]);

  const toggleSidebar = (tab) => {
    if (isSidebarOpen && activeTab === tab) {
      setIsSidebarOpen(false);
    } else {
      setActiveTab(tab);
      setIsSidebarOpen(true);
    }
  };

  return (
    <div className="meeting-container">
      {/* Absolute positioned connection status indicator */}
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 100, background: 'rgba(0,0,0,0.5)', padding: '8px 12px', borderRadius: '12px', color: backendStatus === 'Connected to Backend' ? '#00FFA3' : '#FF4444', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: backendStatus === 'Connected to Backend' ? '#00FFA3' : '#FF4444' }}></div>
        {backendStatus}
      </div>

      {/* Background layer for cinematic feel */}
      <div className="meeting-bg"></div>

      <div className="meeting-main">
        {/* Main Video Area */}
        <div className={`main-stage ${isSidebarOpen ? 'sidebar-open' : ''}`}>
          <div className="room-header glass">
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
            activeTab={isSidebarOpen ? activeTab : null}
          />
        </div>

        {/* Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          activeTab={activeTab} 
          onClose={() => setIsSidebarOpen(false)} 
          participants={participants}
        />
      </div>
    </div>
  );
};

export default MeetingRoom;
