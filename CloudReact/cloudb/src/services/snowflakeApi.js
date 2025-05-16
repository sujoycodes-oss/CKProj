import axios from 'axios';

const API_BASE_URL = '/api/snowflake';

export const fetchGroupableColumns = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/columns`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching groupable columns:', error);
    throw error;
  }
};

export const fetchColumnValues = async (column, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/column-values?column=${column}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching values for column ${column}:`, error);
    throw error;
  }
};

export const fetchCostData = async (accountId, requestData, token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/query/${accountId}`, requestData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching cost data:', error);
    throw error;
  }
};