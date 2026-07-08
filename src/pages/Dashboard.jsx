import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Video, Calendar, Users, Clock, Settings, Search, Plus, Sparkles, Hash } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [joinCode, setJoinCode] = useState('');

  const handleCreateMeeting = () => {
    const randomId = Math.random().toString(36).substring(2, 9);
    navigate(`/meet/${randomId}`);
  };

  const handleJoinMeeting = (e) => {
    e.preventDefault();
    if (joinCode.trim()) {
      navigate(`/meet/${joinCode}`);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="dash-sidebar glass">
        <div className="dash-logo">
          <Sparkles className="text-primary" />
          <span>LinguaVerse</span>
        </div>
        
        <nav className="dash-nav">
          <button className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
            <Video size={20} /> Home
          </button>
          <button className={`nav-item ${activeTab === 'contacts' ? 'active' : ''}`} onClick={() => setActiveTab('contacts')}>
            <Users size={20} /> Contacts
          </button>
          <button className={`nav-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
            <Clock size={20} /> History
          </button>
          <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <Settings size={20} /> Settings
          </button>
        </nav>

        <div className="dash-user">
          <div className="avatar">P</div>
          <div className="user-info">
            <span className="name">Priya</span>
            <span className="plan">Pro Plan</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dash-main">
        <div className="dash-header">
          <div className="search-bar glass">
            <Search size={18} className="text-muted" />
            <input type="text" placeholder="Search meetings, contacts..." />
          </div>
          <div className="date-display">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>

        <div className="dash-content">
          <div className="dash-hero">
            <div className="time-greeting">
              <h1>Good Morning, Priya</h1>
              <p>Ready to connect with the world?</p>
            </div>
          </div>

          <div className="action-cards">
            <motion.div 
              className="action-card primary glass-card"
              whileHover={{ scale: 1.02 }}
              onClick={handleCreateMeeting}
            >
              <div className="icon-wrapper"><Video size={28} /></div>
              <h3>New Meeting</h3>
              <p>Start an instant AI translated meeting</p>
            </motion.div>

            <motion.div className="action-card join glass-card" whileHover={{ scale: 1.02 }}>
              <div className="icon-wrapper"><Hash size={28} /></div>
              <h3>Join Meeting</h3>
              <form onSubmit={handleJoinMeeting} className="join-form">
                <input 
                  type="text" 
                  placeholder="Enter code or link" 
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                />
                <button type="submit">Join</button>
              </form>
            </motion.div>

            <motion.div className="action-card schedule glass-card" whileHover={{ scale: 1.02 }}>
              <div className="icon-wrapper"><Calendar size={28} /></div>
              <h3>Schedule</h3>
              <p>Plan a meeting for later</p>
            </motion.div>
          </div>

          <div className="upcoming-meetings">
            <h2>Upcoming Meetings</h2>
            <div className="meeting-list">
              <div className="meeting-item glass">
                <div className="m-time">
                  <span className="m-hour">10:00 AM</span>
                  <span className="m-duration">45 Min</span>
                </div>
                <div className="m-details">
                  <h4>Global Marketing Sync</h4>
                  <p>English ➔ Japanese | 4 Participants</p>
                </div>
                <button className="btn-secondary small">Start</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
