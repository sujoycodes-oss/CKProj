import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { performLogout } from './axiosConfig';
import '../../../styles/SessionTimeoutModal.css';

//1 minute = 60000
//warn user at 50 seconds = 50 * 1000
const SessionTimeoutModal = ({ warningTime = 840000, logoutTime = 900000 }) => {
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const token = useSelector(state => state.auth.token);
  const navigate = useNavigate();
  
  useEffect(() => {
    let warningTimer = null;
    let logoutTimer = null;
    let countdownInterval = null;
    
    const resetTimers = () => {
      clearTimeout(warningTimer);
      clearTimeout(logoutTimer);
      clearInterval(countdownInterval);
      
      setShowModal(false);
      setTimeLeft(Math.floor((logoutTime - warningTime) / 1000)); 
      
      if (token) {
        warningTimer = setTimeout(() => {
          setShowModal(true);
          
          countdownInterval = setInterval(() => {
            setTimeLeft(prev => {
              if (prev <= 1) {
                clearInterval(countdownInterval);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }, warningTime);
        
        logoutTimer = setTimeout(() => {
          performLogout(navigate);
        }, logoutTime);
      }
    };
    
    resetTimers();
    
    const activityEvents = [
    //   'mousedown', 'mousemove', 'keypress', 'scroll',
      'touchstart', 'click', 'keydown'
    ];
    
    const handleUserActivity = () => {
      resetTimers();
    };
    
    activityEvents.forEach(event => {
      document.addEventListener(event, handleUserActivity);
    });
    
    return () => {
      clearTimeout(warningTimer);
      clearTimeout(logoutTimer);
      clearInterval(countdownInterval);
      
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
    };
  }, [token, navigate, warningTime, logoutTime]);
  
  const handleContinue = () => {
    setShowModal(false);
    const event = new Event('mousedown');
    document.dispatchEvent(event);
  };
  
  if (!showModal) return null;
  
  return (
    <div className="session-timeout-overlay">
      <div className="session-timeout-modal">
        <h2>Session Timeout Warning</h2>
        <p>Your session is about to expire due to inactivity.</p>
        <p>You will be logged out in <strong>{timeLeft}</strong> seconds.</p>
        <div className="session-timeout-buttons">
          <button className="continue-button" onClick={handleContinue}>
            Continue Session
          </button>
          <button className="logout-button-session" onClick={() => performLogout(navigate)}>
            Logout Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeoutModal;