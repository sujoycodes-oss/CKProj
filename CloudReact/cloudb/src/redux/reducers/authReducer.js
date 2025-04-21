import { SET_AUTH_DATA, CLEAR_AUTH_DATA } from "../actions/authActions";

const initialState = {
  token: null,
  email: null,
  firstName: null,
  lastName: null,
  role: null
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
        role: action.payload.role
      };
    
    case CLEAR_AUTH_DATA:
      return initialState;
    
    default:
      return state;
  }
};

export default authReducer;