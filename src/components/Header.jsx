import React, { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import SignupModal from './SignupModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  return (
    <header className="bg-white py-4 px-6 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        <div className="flex items-center">
          <svg className="w-8 h-8 mr-2" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" fill="#229799"/>
            <rect x="4" y="4" width="8" height="8" fill="white"/>
            <rect x="20" y="4" width="8" height="8" fill="white"/>
            <rect x="4" y="20" width="8" height="8" fill="white"/>
            <rect x="20" y="20" width="8" height="8" fill="white"/>
          </svg>
          <span className="text-2xl font-bold">TIPNEX</span>
        </div>
        <nav className="hidden md:flex space-x-6">
          <a href="#howitworks" className="text-gray-600 hover:text-gray-900">How it works</a>
          <a href="#whytipnex" className="text-gray-600 hover:text-gray-900">Why TipNex</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Contact Us</a>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <button onClick={() => setIsSignupModalOpen(true)} className="bg-[#229799] text-white px-4 py-2 duration-200 rounded-md hover:bg-[#3DBFBD]">
            Sign up for free!
          </button>
          <button className="text-gray-600 hover:text-gray-900">Login</button>
          <div className="flex items-center">
            <img src="" alt="Img" className="w-6 h-4 mr-1" />
            <ChevronDown size={16} />
          </div>
        </div>
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden mt-4">
          <nav className="flex flex-col space-y-2">
            <a href="#howitworks" className="text-gray-600 hover:text-gray-900">How it works</a>
            <a href="#whytipnex" className="text-gray-600 hover:text-gray-900">Why TipNex</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Contact Us</a>
          </nav>
          <div className="mt-4 space-y-2">
            <button onClick={() => setIsSignupModalOpen(true)} className="w-full bg-[#229799] text-white px-4 py-2 rounded-md hover:bg-[#3DBFBD]">
              Sign up for free!
            </button>
            <button className="w-full text-gray-600 hover:text-gray-900">Login</button>
          </div>
        </div>
      )}
      <SignupModal 
        isOpen={isSignupModalOpen} 
        onClose={() => setIsSignupModalOpen(false)} 
      />
    </header>
  );
};

export default Header;