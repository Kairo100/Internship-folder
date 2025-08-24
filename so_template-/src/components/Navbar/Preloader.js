import React, { useState, useEffect } from 'react';

const Preloader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); 

    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = keyframes;
    document.head.appendChild(styleSheet);
  }, []);
  
  if (loading) {
    return (
      <div style={styles.preloader}>
        <div style={styles.iconWrapper}>
          <i className="fa-solid fa-hand-holding-heart" style={styles.icon}></i> 
        </div>
      </div>
    );
  }

  return null;
};

const styles = {
  preloader: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  iconWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '60px', 
    animation: 'jump 1.2s ease-in-out infinite', 
  },
  icon: {
    color: '#00CC99', 
    animation: 'heartbeat 1.2s ease-in-out infinite', 
  },
};


const keyframes = `
  @keyframes jump {
    0% {
      transform: translateY(0); /* Start at normal position */
    }
    25% {
      transform: translateY(-30px); /* Jump up */
    }
    50% {
      transform: translateY(0); /* Return to original position */
    }
    75% {
      transform: translateY(-30px); /* Jump again */
    }
    100% {
      transform: translateY(0); /* Finish at normal position */
    }
  }
  
  @keyframes heartbeat {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1); /* Slightly grow the icon */
    }
    100% {
      transform: scale(1);
    }
  }
`;

export default Preloader;
