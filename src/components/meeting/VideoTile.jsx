import React from 'react';
import { MicOff, User } from 'lucide-react';
import { motion } from 'framer-motion';

const VideoTile = ({ participant }) => {
  return (
    <motion.div 
      className={`video-tile ${participant.speaking ? 'speaking' : ''}`}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      {participant.videoOff ? (
        <div className="video-placeholder">
          <div className="avatar-circle">
            <User size={40} />
          </div>
        </div>
      ) : (
        <video 
          className="video-stream"
          autoPlay 
          playsInline 
          muted={participant.isLocal}
          // srcObject would be attached here via a ref in a real WebRTC implementation
        />
      )}

      <div className="tile-overlay">
        <span className="participant-name">
          {participant.name}
          {participant.isLocal && " (You)"}
        </span>
        {participant.muted && (
          <div className="mute-indicator">
            <MicOff size={14} color="#ff4b4b" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default VideoTile;
