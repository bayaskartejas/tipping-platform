import React, { useState } from 'react';
import { X, User, UserCog, Building2 } from 'lucide-react';
import WaiterSignup from './WaiterSignup';
import OwnerSignup from './OwnerSignup';
import CustomerSignup from './CustomerSignup';
import OTPVerify from './OtpVerify';
import Login from './Login';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { Signin2 } from './States';

const ProfileCard = ({ icon: Icon, title, description, onClick, isSelected }) => (
  <a href="#continue">
    <div
      className={`relative overflow-hidden bg-white p-6 rounded-lg shadow-md cursor-pointer transition-all duration-300 hover:scale-105 ${
        isSelected ? 'text-white' : ''
      }`}
      onClick={onClick}
    >
      <div
        className={`absolute inset-0 bg-[#229799] transition-transform duration-300 ease-out ${
          isSelected ? 'scale-100' : 'scale-0'
        }`}
        style={{ transformOrigin: 'center' }}
      ></div>
      <div className="relative z-10">
        <Icon className={`w-12 h-12 mb-4 transition-colors duration-200 ${isSelected ? 'text-white' : 'text-[#229799]'}`} />
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className={`transition-colors duration-200 ${isSelected ? 'text-white' : 'text-gray-600'}`}>{description}</p>
      </div>
    </div>
  </a>
);

const SignupModal = ({ isOpen, token, setToken, onClose }) => {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showWaiterSignup, setShowWaiterSignup] = useState(false);
  const [showOwnerSignup, setShowOwnerSignup] = useState(false);
  const [showCustomerSignup, setShowCustomerSignup] = useState(false);
  const [showOtpVerify, setShowOtpVerify] = useState(false);
  const signin = useRecoilValue(Signin2);
  const setSignin = useSetRecoilState(Signin2);
  const [userType, setUserType] = useState("");
  const navigate = useNavigate()

  const profiles = [
    {
      icon: User,
      title: "Customer",
      description: "Sign up to easily tip and rate your service experiences."
    },
    {
      icon: UserCog,
      title: "Staff",
      description: "Join to receive tips and track your performance."
    },
    {
      icon: Building2,
      title: "Owner",
      description: "Register your business and manage tip distribution."
    }
  ];

  if (showWaiterSignup) {
    return <div className='fixed z-50 top-0 left-0 right-0 inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300'><WaiterSignup setShowWaiterSignup={setShowWaiterSignup}  setShowOtpVerify={setShowOtpVerify} setUserType={setUserType} token={token} setToken={setToken} onClose={onClose}/></div>
  }
  else if (showOwnerSignup){
    return <div className='fixed z-50 top-0 left-0 right-0 inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300'><OwnerSignup setShowOwnerSignup={setShowOwnerSignup} setShowOtpVerify={setShowOtpVerify} setUserType={setUserType} token={token} setToken={setToken} onClose={onClose} /></div>
  }
  else if (showCustomerSignup){
    return <div className='fixed z-50 top-0 left-0 right-0 inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300'><CustomerSignup setShowCustomerSignup={setShowCustomerSignup} setShowOtpVerify={setShowOtpVerify} setUserType={setUserType} token={token} setToken={setToken} onClose={onClose} /></div>
  }
  else if (showOtpVerify){
    return <div className='fixed z-50 top-0 left-0 right-0 inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300'><OTPVerify setShowOtpVerify={setShowOtpVerify} userType={userType} token={token} setToken={setToken}/></div>
  }
  else if (signin){
    navigate("/login")
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-3 max-h-screen overflow-auto scroll-smooth animate-popup">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Choose Your Profile</h2>
            <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
              <X size={24} />
            </button>
          </div>
          <p className="text-gray-600 mb-8">
            Select the profile that best describes your role to get started with our platform.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {profiles.map((profile, index) => (
              <ProfileCard
                key={index}
                {...profile}
                onClick={() => setSelectedProfile(profile.title)}
                isSelected={selectedProfile === profile.title}
              />
            ))}
          </div>
          {selectedProfile && (
            <div className="mt-8 text-center" id='continue'>
              <button 
                className="mt-4 bg-[#229799] text-white px-6 py-2 rounded-md hover:bg-[#1b7a7c] transition-colors duration-300"
                onClick={() => {
                  if (selectedProfile === 'Staff') {
                    setShowWaiterSignup(true);
                  } 
                  if (selectedProfile === 'Customer') {
                    setShowCustomerSignup(true);
                  } 
                  if (selectedProfile === 'Owner') {
                    setShowOwnerSignup(true);
                  } 
                  else {
                    onClose();
                  }
                }}
              >
                Continue Signup
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignupModal;