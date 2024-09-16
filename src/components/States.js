import { atom } from "recoil";
export const Signup = atom({
    key: 'Signup',
    default: false,
  });
  export const OtpPage = atom({
    key: 'OtpPage',
    default: false,
  });
  export const Signin = atom({
    key: 'Signin',
    default: false,
  });
  export const Otp = atom({
    key: 'Otp',
    default: '0',
  });
  export const Resend = atom({
    key: "Resend",
    default: false
  })
  export const OtpAlert = atom({
    key:"OtpAlert",
    default: false  
  })
  export const SelectedProfile = atom({
    key: 'selectedProfile', // unique ID (with respect to other atoms/selectors)
    default: null, // default value (aka initial value)
  });
