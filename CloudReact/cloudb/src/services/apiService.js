// src/services/api.js
import axios from 'axios';

// Set default base URL
axios.defaults.baseURL = 'http://localhost:8080';

// API service with common methods
const apiService = {
  // Method to get cloud accounts
  getCloudAccounts: async (token) => {
    const response = await axios.get('/auth/cloudAccounts', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Method to get ASG instances
  getASGInstances: async (cloudAccountId, token) => {
    const response = await axios.get(`/api/aws/asg/${cloudAccountId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return Array.isArray(response.data) ? response.data : [];
  },

  // Method to get EC2 instances
  getEC2Instances: async (cloudAccountId, token) => {
    const response = await axios.get(`/api/aws/ec2/${cloudAccountId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return Array.isArray(response.data) ? response.data : [];
  },

  // Method to get RDS instances
  getRDSInstances: async (cloudAccountId, token) => {
    const response = await axios.get(`/api/aws/rds/${cloudAccountId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return Array.isArray(response.data) ? response.data : [];
  }
};

export default apiService;