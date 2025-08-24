import React, { useEffect, useState } from 'react';
import { Link} from 'react-router-dom';
import axios from 'axios';
import { useProjects } from '../../api/ProjectsContext';
const BackersModal = ({ show, handleClose, causeId }) => {
  

   const {projectDetails:causesData, setProjectDetails:setCausesData } = useProjects();

  const [backers, setBackers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('newest');

  useEffect(() => {
    if (show && causeId) {
      setLoading(true);
      const cause = causesData;

      if (cause && cause.transactions) {
        const fakeDelay = setTimeout(() => {
          const backersList = cause.transactions.map((t) => ({
            name: t.Narration,
            amount: parseFloat(t.TranAmt),
            date: t.TranDate, // or skip it if no date
          }));
          console.log("Backers list:", backersList);

          setBackers(backersList);
          setLoading(false);
        }, 500);
        return () => clearTimeout(fakeDelay);
      } else {
        setBackers([]);
        setLoading(false);
      }
    }
  }, [show, causeId]);

  const timeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'week', seconds: 604800 },
      { label: 'day', seconds: 86400 },
      { label: 'hr', seconds: 3600 },
      { label: 'min', seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(diff / interval.seconds);
      if (count >= 1) return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }

    return '';
  };

  const newestBackers = [...backers].sort((a, b) => new Date(b.date) - new Date(a.date));
  const topBackers = [...backers].sort((a, b) => b.amount - a.amount);
  const displayBackers = selectedTab === 'top' ? topBackers : newestBackers;
// LOGIC FOR DONATE BUTTON (End Date Only)
const getDonateButtonText = () => {
  const now = new Date();
  const endDate = new Date(causesData.end_date);

  if (endDate < now) {
    return "Campaign Ended"; // Or "Past Deadline"
  }
  return "Donate Now";
};

const isDonateButtonDisabled = () => {
  const now = new Date();
  const endDate = new Date(causesData.end_date);

  // Disable if end date has passed
  return endDate < now;
};
  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '100vw',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '20px',
          width: '95%',
          maxWidth: '480px',
          maxHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 12px 50px rgba(0,0,0,0.2)',
          animation: 'slideDown 0.4s ease',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
      
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h5 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>
            <i
              className='bx bxs-donate-heart'
              style={{ color: '#f47373', marginRight: '10px' }}
            ></i>
            Donations <span style={{ color: '#00CC99' }}>({backers.length})</span>
          </h5>
          <button
            onClick={handleClose}
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: '24px',
              cursor: 'pointer',
              lineHeight: 1,
            }}
          >
            &times;
          </button>
        </div>

     
        <div
          style={{
            display: 'flex',
            gap: '16px',
            padding: '12px 24px',
            borderBottom: '1px solid #eee',
          }}
        >
          <button
            onClick={() => setSelectedTab('newest')}
            style={{
              padding: '6px 20px',
              borderRadius: '4px',
              fontWeight: 600,
              backgroundColor: selectedTab === 'newest' ? '#2C3E50' : 'transparent',
              color: selectedTab === 'newest' ? '#fff' : '#555',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Newest
          </button>
          <button
            onClick={() => setSelectedTab('top')}
            style={{
              padding: '6px 20px',
              borderRadius: '4px',
              fontWeight: 600,
              backgroundColor: selectedTab === 'top' ? '#2C3E50' : 'transparent',
              color: selectedTab === 'top' ? '#fff' : '#555',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Top
          </button>
        </div>

     
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 24px',
          }}
        >
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div className='spinner-border' role='status'></div>
            </div>
          ) : displayBackers.length ? (
            displayBackers.map((backer, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '18px' }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                    fontSize: 18,
                    color: '#00CC99',
                  }}
                >
                  <i className='fas fa-hand-holding-heart'></i>
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{backer.name}</div>
                  <div style={{ color: '#333', fontSize: '15px' }}>
                    ${backer.amount} 
                     · {timeAgo(backer.date)} 
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No backers found yet.</p>
          )}
        </div>

       
        <div
          style={{
            padding: '12px 24px',
            // background: 'linear-gradient(to right, #00CC99,rgba(0, 204, 153, 0.63))',
            color: '#222',
            fontWeight: 600,
            textAlign: 'center',
            cursor: 'pointer',
            borderRadius: '10px',
            margin: '20px',
          }}
        >
          {/* <Link to={`/donate/${causeId}`} style={{ color: '#fff' }}>
            Donate now
          </Link> */}
           <Link
                                to={isDonateButtonDisabled() ? "#" : `/donate/${causeId}`}
                                className={`text-decoration-none ${isDonateButtonDisabled() ? 'disabled-link' : ''}`} // Add a class for disabled state if needed for styling
                              >
                                <button
                                  className="btnActions d-block w-100 px-4 py-2 mt-2 text-white fw-bold"
                                  disabled={isDonateButtonDisabled()}
                                  style={{
                                    backgroundColor: isDonateButtonDisabled() ? '#cccccc' : '#00CC99', // Gray out when disabled
                                    cursor: isDonateButtonDisabled() ? 'not-allowed' : 'pointer'
                                  }}
                                >
                                  {getDonateButtonText()}
                                </button>
                              </Link>
        </div>
      </div>
    </div>
  );
};

export default BackersModal;
