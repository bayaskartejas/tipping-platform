import React, { createContext, useContext, useReducer } from 'react';

const initialState = {
  signup: false,
  otpPage: false,
  signin: false,
  otp: '0',
  resend: false,
  otpAlert: false,
  signin2: false,
  selectedProfile: null,
  token: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_SIGNUP':
      return { ...state, signup: action.payload };
    case 'SET_OTP_PAGE':
      return { ...state, otpPage: action.payload };
    case 'SET_SIGNIN':
      return { ...state, signin: action.payload };
    case 'SET_OTP':
      return { ...state, otp: action.payload };
    case 'SET_RESEND':
      return { ...state, resend: action.payload };
    case 'SET_OTP_ALERT':
      return { ...state, otpAlert: action.payload };
    case 'SET_SIGNIN2':
      return { ...state, signin2: action.payload };
    case 'SET_SELECTED_PROFILE':
      return { ...state, selectedProfile: action.payload };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};


const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useStateContext must be used within a StateProvider');
  }
  return context;
};
