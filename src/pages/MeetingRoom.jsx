import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import { Buffer } from 'buffer';
globalThis.Buffer = Buffer; // Polyfill for simple-peer

import VideoGrid from '../components/meeting/VideoGrid';
import ControlBar from '../components/meeting/ControlBar';
import Sidebar from '../components/meeting/Sidebar';
import { BACKEND_URL } from '../config';
import '../components/meeting/Meeting.css';

const MeetingRoom = () => {
  const { id } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');
  const [backendStatus, setBackendStatus] = useState('Connecting...');
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [participants, setParticipants] = useState([]);
  
  const socketRef = useRef();
  const peersRef = useRef([]); // Stores peer instances
  const streamRef = useRef();

  useEffect(() => {
    socketRef.current = io(BACKEND_URL, {
      transports: ['websocket'],
    });

    socketRef.current.on('connect', () => {
      console.log('✅ Connected to Backend!', socketRef.current.id);
      setBackendStatus('Connected to Backend');
      
      // Request Camera and Mic permissions
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        streamRef.current = stream;
        
        // Add self to participants
        setParticipants([{
          id: socketRef.current.id,
          name: 'You',
          isLocal: true,
          speaking: false,
          muted: false,
          videoOff: false,
          stream: stream
        }]);

        socketRef.current.emit('join-room', { roomId: id });
        
        // When someone else joins, WE initiate the call to them
        socketRef.current.on('user-joined', (data) => {
          console.log('👤 User joined, initiating call:', data.userId);
          const peer = createPeer(data.userId, socketRef.current.id, stream);
          peersRef.current.push({ peerID: data.userId, peer });
        });

        // When we receive an offer from an initiator, we answer it
        socketRef.current.on('offer', (data) => {
          console.log('📥 Received offer from:', data.callerId);
          const peer = addPeer(data.offer, data.callerId, stream);
          peersRef.current.push({ peerID: data.callerId, peer });
        });

        // When we receive an answer to our offer
        socketRef.current.on('answer', (data) => {
          console.log('📥 Received answer from:', data.callerId);
          const item = peersRef.current.find(p => p.peerID === data.callerId);
          if (item) {
            item.peer.signal(data.answer);
          }
        });

      }).catch(err => {
        console.error("Failed to get media devices:", err);
        setBackendStatus('Camera/Mic Blocked');
      });
    });

    socketRef.current.on('disconnect', () => {
      setBackendStatus('Disconnected');
    });

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      socketRef.current.disconnect();
    };
  }, [id]);

  // Create a peer (Initiator)
  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false, // We'll just send the full SDP for simplicity in prototype
      stream,
      config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
    });

    peer.on('signal', signal => {
      socketRef.current.emit('offer', {
        targetUserId: userToSignal,
        callerId: callerID,
        offer: signal,
        roomId: id
      });
    });

    peer.on('stream', (remoteStream) => {
      setParticipants(prev => [...prev.filter(p => p.id !== userToSignal), {
        id: userToSignal,
        name: 'Remote User',
        isLocal: false,
        speaking: false,
        muted: false,
        videoOff: false,
        stream: remoteStream
      }]);
    });

    return peer;
  }

  // Answer a peer (Receiver)
  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
      config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
    });

    peer.on('signal', signal => {
      socketRef.current.emit('answer', {
        targetUserId: callerID,
        callerId: socketRef.current.id,
        answer: signal,
        roomId: id
      });
    });

    peer.on('stream', (remoteStream) => {
      setParticipants(prev => [...prev.filter(p => p.id !== callerID), {
        id: callerID,
        name: 'Remote User',
        isLocal: false,
        speaking: false,
        muted: false,
        videoOff: false,
        stream: remoteStream
      }]);
    });

    peer.signal(incomingSignal);
    return peer;
  }

  // Toggle Mute
  useEffect(() => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMuted;
      }
    }
    setParticipants(prev => prev.map(p => p.isLocal ? { ...p, muted: isMuted } : p));
  }, [isMuted]);

  // Toggle Video
  useEffect(() => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOff;
      }
    }
    setParticipants(prev => prev.map(p => p.isLocal ? { ...p, videoOff: isVideoOff } : p));
  }, [isVideoOff]);

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
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 100, background: 'rgba(0,0,0,0.5)', padding: '8px 12px', borderRadius: '12px', color: backendStatus === 'Connected to Backend' ? '#00FFA3' : '#FF4444', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: backendStatus === 'Connected to Backend' ? '#00FFA3' : '#FF4444' }}></div>
        {backendStatus}
      </div>

      <div className="meeting-bg"></div>

      <div className="meeting-main">
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
