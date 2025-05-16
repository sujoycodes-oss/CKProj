export const SET_AUTH_DATA = 'SET_AUTH_DATA';
export const CLEAR_AUTH_DATA = 'CLEAR_AUTH_DATA';
export const UPDATE_CLOUD_ACCOUNTS = 'UPDATE_CLOUD_ACCOUNTS';
export const SET_CUSTOMERS = 'SET_CUSTOMERS';
export const UPDATE_SELECTED_ACCOUNT = 'UPDATE_SELECTED_ACCOUNT';
export const SET_IMPERSONATION_STATUS = 'SET_IMPERSONATION_STATUS';
export const STOP_IMPERSONATION = 'STOP_IMPERSONATION';

export const setCustomers = (customers) => ({
  type: SET_CUSTOMERS,
  payload: customers,
});

export const setAuthData = (payload) => ({
  type: SET_AUTH_DATA,
  payload,
});

export const clearAuthData = () => ({
  type: CLEAR_AUTH_DATA,
});

export const updateCloudAccounts = (cloudAccountIds) => ({
  type: UPDATE_CLOUD_ACCOUNTS,
  payload: cloudAccountIds
});

export const updateSelectedAccount = (accountId) => ({
  type: UPDATE_SELECTED_ACCOUNT,
  payload: accountId,
});

export const setImpersonationStatus = (status) => ({
  type: SET_IMPERSONATION_STATUS,
  payload: status
});