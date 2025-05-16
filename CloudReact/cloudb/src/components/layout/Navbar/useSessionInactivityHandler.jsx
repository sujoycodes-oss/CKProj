import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { performLogout } from './axiosConfig'; 

const useSessionInactivityHandler = (inactivityTimeout = 900000) => { 
  const inactivityTimer = useRef(null);
  const navigate = useNavigate();
  const token = useSelector(state => state.auth.token);
  
  const resetInactivityTimer = () => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
    
    if (token) {
      inactivityTimer.current = setTimeout(() => {
        performLogout(navigate);
      }, inactivityTimeout);
    }
  };

  useEffect(() => {
    if (!token) return; 
    
    const activityEvents = [
      // 'mousedown', 'mousemove', 'keypress', 
      'scroll', 'touchstart', 'click', 'keydown'
    ];
    
    resetInactivityTimer();
    
    const resetTimerOnActivity = () => resetInactivityTimer();
    activityEvents.forEach(event => {
      document.addEventListener(event, resetTimerOnActivity);
    });
    
    return () => {
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
      activityEvents.forEach(event => {
        document.removeEventListener(event, resetTimerOnActivity);
      });
    };
  }, [token, inactivityTimeout]);

  return { resetInactivityTimer };
};

export default useSessionInactivityHandler;