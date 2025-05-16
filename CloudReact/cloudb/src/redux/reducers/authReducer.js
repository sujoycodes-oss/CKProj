import {
  SET_AUTH_DATA,
  CLEAR_AUTH_DATA,
  UPDATE_CLOUD_ACCOUNTS,
  SET_CUSTOMERS,
  UPDATE_SELECTED_ACCOUNT,
  SET_IMPERSONATION_STATUS,
} from '../actions/authActions';

// 2. Updated authReducer.js
const initialState = {
  token: null,
  email: null,
  firstName: null,
  lastName: null,
  role: null,
  cloudAccountIds: null,
  selectedAccount: null,
  customers: [],
  // New impersonation fields
  impersonating: false,
  impersonatedBy: null,
  actualRole: null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_AUTH_DATA:
      return {
        ...state,
        token: action.payload.token,
        email: action.payload.email,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        role: action.payload.role,
        cloudAccountIds: action.payload.cloudAccountIds || null,
        // Handle impersonation data if present
        impersonating: action.payload.impersonating || false,
        impersonatedBy: action.payload.impersonatedBy || null,
        actualRole: action.payload.actualRole || state.actualRole
      };

    case SET_IMPERSONATION_STATUS:
      return {
        ...state,
        impersonating: action.payload.impersonating,
        impersonatedBy: action.payload.impersonatedBy,
        actualRole: action.payload.actualRole || state.role
      };

    case UPDATE_CLOUD_ACCOUNTS:
      return {
        ...state,
        cloudAccountIds: action.payload
      };

    case SET_CUSTOMERS:
      return {
        ...state,
        customers: action.payload
      };

    case UPDATE_SELECTED_ACCOUNT:
      return {
        ...state,
        selectedAccount: action.payload
      };

    case CLEAR_AUTH_DATA:
      return initialState;

    default:
      return state;
  }
};

export default authReducer;