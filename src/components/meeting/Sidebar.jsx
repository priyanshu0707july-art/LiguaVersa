import React from 'react';
import { X, Send, UserMinus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isOpen, activeTab, onClose, participants }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="meeting-sidebar glass"
          initial={{ x: 350, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 350, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="sidebar-header">
            <h3>{activeTab === 'chat' ? 'In-call Messages' : 'Participants'}</h3>
            <button className="close-btn" onClick={onClose}><X size={20} /></button>
          </div>

          <div className="sidebar-content">
            {activeTab === 'chat' && (
              <div className="chat-container">
                <div className="messages-area">
                  <div className="message received">
                    <span className="sender">Alex Johnson</span>
                    <p>Can everyone hear the translated audio clearly?</p>
                    <span className="time">10:02 AM</span>
                  </div>
                  <div className="message sent">
                    <span className="sender">You</span>
                    <p>Yes, the Japanese translation is incredibly fast!</p>
                    <span className="time">10:03 AM</span>
                  </div>
                </div>
                <div className="chat-input-area">
                  <input type="text" placeholder="Send a message..." className="glass-input" />
                  <button className="send-btn"><Send size={18} /></button>
                </div>
              </div>
            )}

            {activeTab === 'participants' && (
              <div className="participants-container">
                <div className="participants-list">
                  {participants.map(p => (
                    <div key={p.id} className="participant-row">
                      <div className="p-info">
                        <div className="p-avatar">{p.name.charAt(0)}</div>
                        <span>{p.name} {p.isLocal && '(You)'}</span>
                      </div>
                      {!p.isLocal && (
                        <div className="p-actions">
                           <UserMinus size={16} className="text-muted cursor-pointer" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <button className="btn-secondary mute-all-btn">Mute All</button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
