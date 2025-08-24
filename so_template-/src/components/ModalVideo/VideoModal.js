import React, { useState } from 'react';
import ModalVideo from 'react-modal-video';
import '../../../node_modules/react-modal-video/scss/modal-video.scss';

const VideoModal = () => {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <ModalVideo
        channel="youtube"
        autoplay
        isOpen={isOpen}
        videoId="UC9Rl4uWU9g" 
        onClose={() => setOpen(false)}
      />
      <div
        onClick={() => setOpen(true)}
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '70px',
          height: '70px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          boxShadow: '0 8px 15px rgba(0, 0, 0, 0.15)',
          zIndex: 10,
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.color = '#2C3E50';
          e.currentTarget.style.backgroundColor = '#2C3E50';
         
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
          e.currentTarget.style.color = '#007bff';
        }}
      >
        <i className="fas fa-play" style={{ fontSize: '28px', color: '#00CC99' }}></i>
      </div>
    </>
  );
};

export default VideoModal;
