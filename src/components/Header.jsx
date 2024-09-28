import React, { useState } from 'react';
import { Menu, X, ChevronDown, ScanQrCode } from 'lucide-react';
import SignupModal from './SignupModal';
import { useRecoilState } from 'recoil';
import { Signin2 } from './States';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [signin, setSignin] = useRecoilState(Signin2)
  return (
    <header className="bg-white py-4 px-6 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        <div className="flex items-center">
        <img src="/placeholder-logo.png" alt="Logo" className="h-8 mr-2" />
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
          <button onClick={()=>{setSignin(true)}} className="text-gray-600 hover:text-gray-900">Login</button>
          <div className="flex items-center">
            <img src="" alt="Img" className="w-6 h-4 mr-1" />
            <ChevronDown size={16} />
          </div>
        </div>
        
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <div className="flex"><div className='mx-1 cursor-pointer'><ScanQrCode /></div><div className='mx-1'><Menu size={24} /></div></div>}
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
          <ScanQrCode />
            <button onClick={() => setIsSignupModalOpen(true)} className="w-full bg-[#229799] text-white px-4 py-2 rounded-md hover:bg-[#3DBFBD]">
              Sign up for free!
            </button>
            <button onClick={()=>{setSignin(true)}} className="w-full text-gray-600 hover:text-gray-900">Login</button>
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