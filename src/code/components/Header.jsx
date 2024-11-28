import React, { useState } from 'react';
import { Menu, X, ChevronDown, ScanQrCode } from 'lucide-react';
import SignupModal from '../popups/SignupModal';
import { useRecoilState } from 'recoil';
import { Signin2 } from '../States';
import logo from "../../assets/tipnex.png"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [signin, setSignin] = useRecoilState(Signin2)

  return (
    // Added absolute positioning to overlay the header on the parallax background and made it transparent
    <header className="absolute top-0 left-0 w-full bg-transparent py-4 px-6 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        <div className="flex items-center">
          <img src={logo} alt="Logo" className="sm:h-12 sm:mr-4 h-8 mr-3" />
        </div>

        <nav className="hidden md:flex space-x-6">
          <a href="#howitworks" className="text-white hover:text-gray-300">How it works</a> {/* Text is white for visibility */}
          <a href="#whytipnex" className="text-white hover:text-gray-300">Why TipNex</a>
          <a href="#" className="text-white hover:text-gray-300">Contact Us</a>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <button onClick={() => setIsSignupModalOpen(true)} className="bg-theme-col-2 text-white px-4 py-2 duration-200 rounded-md hover:bg-theme-col-1">
            Sign up for free!
          </button>
          <button onClick={()=>{setSignin(true)}} className="text-white hover:text-gray-300">Login</button> {/* Text is white */}
          <div className="flex items-center">
            <img src="" alt="Img" className="w-6 h-4 mr-1" />
            <ChevronDown size={16} className="text-white" />
          </div>
        </div>

        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} className="text-white" /> : <div className="flex text-white"><div className='mx-1 cursor-pointer'><ScanQrCode /></div><div className='mx-1'><Menu size={24} /></div></div>}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden mt-4 bg-slate-900 p-4 rounded-xl">
          <nav className="flex flex-col space-y-2">
            <a href="#howitworks" className="text-white hover:text-gray-300">How it works</a>
            <a href="#whytipnex" className="text-white hover:text-gray-300">Why TipNex</a>
            <a href="#" className="text-white hover:text-gray-300">Contact Us</a>
          </nav>
          <div className="mt-4 space-y-2">
            <ScanQrCode className="text-white" />
            <button onClick={() => setIsSignupModalOpen(true)} className="w-full bg-[#6d8ce7] text-white px-4 py-2 rounded-md hover:bg-[#1a3ba2]">
              Sign up for free!
            </button>
            <button onClick={() => setSignin(true)} className="w-full text-white hover:text-gray-300">Login</button>
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
