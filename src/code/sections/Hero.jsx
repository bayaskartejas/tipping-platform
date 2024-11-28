import React, { useState } from 'react';
import SignupModal from '../popups/SignupModal';
import sunrise from "../../assets/sunrise.jpg"

const Hero = (token, setToken) => {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  

  return (
    <section 
      className="relative bg-cover bg-center bg-fixed min-h-screen flex items-center justify-center px-6 " 
      style={{ backgroundImage: `url(${sunrise})` }} // Set the background image with parallax effect
    >
      {/* Optional overlay for better contrast */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* Hero content */}
      <div className="relative max-w-7xl mx-auto text-center text-white z-10 mt-7 sm:mt-10">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
          Elevate staff satisfaction with the ultimate <span className="text-theme-col-2">digital gratuity platform</span> for restaurants and retail.
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-8">
          TipNex's innovative digital gratuity system streamlines and allocates tips equitably and openly for your complete restaurant or pub staff.
        </p>
        <button 
          className="bg-theme-col-2 text-white px-6 py-3 rounded-md hover:bg-theme-col-1 transition-colors duration-300 text-lg"
          onClick={() => setIsSignupModalOpen(true)}
        >
          Sign up for free!
        </button>
      </div>

      {/* Signup Modal */}
      <SignupModal 
        isOpen={isSignupModalOpen} 
        token={token}
        setToken={setToken}
        onClose={() => setIsSignupModalOpen(false)} 
      />
    </section>
  );
};

export default Hero;