export const SET_AUTH_DATA = 'SET_AUTH_DATA';
export const CLEAR_AUTH_DATA = 'CLEAR_AUTH_DATA';

export const setAuthData = (payload) => ({
  type: SET_AUTH_DATA,
  payload,
});

export const clearAuthData = () => ({
  type: CLEAR_AUTH_DATA,
});


