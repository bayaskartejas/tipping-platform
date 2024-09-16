import React, { useState } from 'react';
import SignupModal from './SignupModal';

const Hero = () => {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  return (
    <section className="bg-[#F0F8FF] px-6 py-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl font-bold mb-4">
            Elevate staff satisfaction with the ultimate <span className="text-[#229799]">digital gratuity platform</span> for eateries and taverns
          </h1>
          <p className="text-gray-600 mb-6">
            EasyTip's innovative digital gratuity system streamlines and allocates tips equitably and openly for your complete restaurant or pub staff.
          </p>
          <button 
            className="bg-[#229799] text-white px-6 py-3 rounded-md hover:bg-[#1b7a7c] transition-colors duration-300 text-lg"
            onClick={() => setIsSignupModalOpen(true)}
          >
            Sign up for free!
          </button>
        </div>
        <div className="md:w-1/2 flex justify-end">
          <img src="/placeholder-app-screenshot.png" alt="EasyTip App Screenshots" className="max-w-full h-auto" />
        </div>
      </div>
      <SignupModal 
        isOpen={isSignupModalOpen} 
        onClose={() => setIsSignupModalOpen(false)} 
      />
    </section>
  );
};

export default Hero;