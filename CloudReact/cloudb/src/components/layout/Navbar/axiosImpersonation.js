import axios from 'axios';
import store from '../store'; // Adjust path as needed
import { setAuthData, clearAuthData } from '../../../redux/actions/authActions'; // Adjust path as needed

// Fetch customers for impersonation (used by admins)
export const fetchCustomers = async () => {
  try {
    const state = store.getState();
    const token = state.auth.token;
    
    const response = await axios.get('http://localhost:8080/auth/admin/users/customers', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    store.dispatch({
      type: 'SET_CUSTOMERS',
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
};

// Start impersonation
export const startImpersonation = async (targetEmail) => {
  try {
    const state = store.getState();
    const token = state.auth.token;
    
    const response = await axios.post('http://localhost:8080/auth/impersonate', null, {
      params: { targetEmail },
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // Update auth state with new token and impersonation data
    store.dispatch(setAuthData({
      ...response.data,
      impersonating: true,
      impersonatedBy: state.auth.email,
      actualRole: state.auth.role
    }));
    
    // Update axios default header with new token
    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    
    return response.data;
  } catch (error) {
    console.error('Impersonation failed:', error);
    throw error;
  }
};

// Stop impersonation
export const stopImpersonation = async () => {
  try {
    const state = store.getState();
    const token = state.auth.token;
    
    const response = await axios.post('http://localhost:8080/auth/stop-impersonation', null, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // Update auth state with original admin data
    store.dispatch(setAuthData(response.data));
    
    // Update axios default header with new token
    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    
    return response.data;
  } catch (error) {
    console.error('Stop impersonation failed:', error);
    throw error;
  }
};

// Add JWT token interceptor to handle the impersonation flag
export const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(
    config => {
      const state = store.getState();
      const token = state.auth.token;
      
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );
  
  // Handle responses for impersonation-related issues
  axios.interceptors.response.use(
    response => response,
    error => {
      // Handle token expiration or blacklisting
      if (error.response && error.response.status === 401) {
        // Check if we're impersonating and this is a token issue
        const state = store.getState();
        if (state.auth.impersonating) {
          // Try to stop impersonation automatically
          stopImpersonation().catch(() => {
            // If that fails too, just logout
            store.dispatch(clearAuthData());
            window.location.href = '/login';
          });
        }
      }
      return Promise.reject(error);
    }
  );
};