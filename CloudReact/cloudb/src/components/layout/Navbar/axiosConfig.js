import axios from 'axios';
import { store } from '../../../redux/store';
import { CLEAR_AUTH_DATA } from '../../../redux/actions/authActions';

const BASE_URL = 'http://localhost:8080';

let isLoggingOut = false;

const getAuthHeaders = () => {
  const token = store.getState().auth.token;
  return token ? {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  } : {
    'Content-Type': 'application/json'
  };
};

export const performLogout = (navigate) => {
  if (isLoggingOut) return;
  isLoggingOut = true;

  // Get token from store
  const token = store.getState().auth.token;
  
  // If we have a token, try to logout on server
  if (token) {
    axios.post(
      `${BASE_URL}/auth/logout`,
      {},
      { headers: getAuthHeaders() }
    )
    .catch(error => {
      // Ignore 401 errors as they're expected if token expired
      if (error.response && error.response.status === 401) {
        console.log('Token already expired on server');
      } else {
        console.error('Error logging out on server:', error);
      }
    })
    .finally(() => {
      // Always clear local state
      store.dispatch({ type: CLEAR_AUTH_DATA });
      localStorage.clear();
      
      if (navigate && typeof navigate === 'function') {
        navigate('/');
      } else if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
      
      isLoggingOut = false;
    });
  } else {
    // No token, just clear local state
    store.dispatch({ type: CLEAR_AUTH_DATA });
    localStorage.clear();
    
    if (navigate && typeof navigate === 'function') {
      navigate('/');
    } else if (window.location.pathname !== '/') {
      window.location.href = '/';
    }
    
    isLoggingOut = false;
  }
};

// Handle 401 responses manually in each request
const handleUnauthorized = (error) => {
  if (error.response && error.response.status === 401) {
    console.log('Session expired or unauthorized');
    
    // Don't logout if we're already trying to logout or already on login page
    if (!window.location.pathname.includes('/auth/logout') && window.location.pathname !== '/') {
      performLogout();
    }
  }
  return Promise.reject(error);
};

const api = {
  get: (url, config = {}) => {
    return axios.get(`${BASE_URL}${url}`, {
      ...config,
      headers: { ...getAuthHeaders(), ...(config.headers || {}) }
    }).catch(handleUnauthorized);
  },
  
  post: (url, data, config = {}) => {
    return axios.post(`${BASE_URL}${url}`, data, {
      ...config,
      headers: { ...getAuthHeaders(), ...(config.headers || {}) }
    }).catch(handleUnauthorized);
  },
  
  put: (url, data, config = {}) => {
    return axios.put(`${BASE_URL}${url}`, data, {
      ...config,
      headers: { ...getAuthHeaders(), ...(config.headers || {}) }
    }).catch(handleUnauthorized);
  },
  
  delete: (url, config = {}) => {
    return axios.delete(`${BASE_URL}${url}`, {
      ...config,
      headers: { ...getAuthHeaders(), ...(config.headers || {}) }
    }).catch(handleUnauthorized);
  },
  
  patch: (url, data, config = {}) => {
    return axios.patch(`${BASE_URL}${url}`, data, {
      ...config,
      headers: { ...getAuthHeaders(), ...(config.headers || {}) }
    }).catch(handleUnauthorized);
  }
};

export default api;