import React, { useEffect, useState } from 'react';
import { X, User, UserCog, Building2 } from 'lucide-react';
import WaiterSignup from './WaiterSignup';
import { div } from 'framer-motion/client';
import OwnerSignup from './OwnerSignup';
import CustomerSignup from './CustomerSignup';

const ProfileCard = ({ icon: Icon, title, description, onClick }) => (
    <a href="#continue">  <div
    className="bg-white p-6 rounded-lg shadow-md cursor-pointer transition-transform duration-300 hover:scale-105"
    onClick={onClick}
  >
    
    <Icon className="w-12 h-12 text-[#229799] mb-4" />
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div></a>

);

const SignupModal = ({ isOpen, onClose }) => {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showWaiterSignup, setShowWaiterSignup] = useState(false);
  const [showOwnerSignup, setShowOwnerSignup] = useState(false);
  const [showCustomerSignup, setShowCustomerSignup] = useState(false);
  const [showOtpVerify, setShowOtpVerify] = useState(false);

  const profiles = [
    {
      icon: User,
      title: "Customer",
      description: "Sign up to easily tip and rate your service experiences."
    },
    {
      icon: UserCog,
      title: "Waiter / Helper",
      description: "Join to receive tips and track your performance."
    },
    {
      icon: Building2,
      title: "Owner",
      description: "Register your business and manage tip distribution."
    }
  ];

  // If `showWaiterSignup` is true, show the WaiterSignup component
    if (showWaiterSignup) {
        return <div className='fixed z-50 top-0 left-0 right-0 inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300'><WaiterSignup setShowWaiterSignup={setShowWaiterSignup} onClose={onClose} /></div>
      }
      else if (showOwnerSignup){
        return <div className='fixed z-50 top-0 left-0 right-0 inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300'><OwnerSignup setShowOwnerSignup={setShowOwnerSignup} onClose={onClose} /></div>
      }
      else if (showCustomerSignup){
        return <div className='fixed z-50 top-0 left-0 right-0 inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300'><CustomerSignup setShowCustomerSignup={setShowCustomerSignup} onClose={onClose} /></div>
      }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-3 max-h-screen overflow-auto scroll-smooth">
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
              />
            ))}
          </div>
          {selectedProfile && (
            <div className="mt-8 text-center">
              <p id='continue' className="text-lg font-semibold text-[#229799]">
                You've selected: {selectedProfile}
              </p>
              <button 
                className="mt-4 bg-[#229799] text-white px-6 py-2 rounded-md hover:bg-[#1b7a7c] transition-colors duration-300"
                onClick={() => {
                  if (selectedProfile === 'Waiter / Helper') {
                    setShowWaiterSignup(true); // Show WaiterSignup if Waiter/Helper is selected
                  } 
                  if (selectedProfile === 'Customer') {
                    setShowCustomerSignup(true); // Show WaiterSignup if Waiter/Helper is selected
                  } 
                  if (selectedProfile === 'Owner') {
                    setShowOwnerSignup(true); // Show WaiterSignup if Waiter/Helper is selected
                  } 
                  else {
                    onClose();  // Close the modal if another profile is selected
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

export default SignupModal
