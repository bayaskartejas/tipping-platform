import React from 'react';
import logo from "../../assets/tipnex.png"
const Footer = () => {
  return (
    <footer className="text-white py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0 flex items-center">
          <img src={logo} alt="TipNex Logo" className="h-8 sm:h-16 sm:mr-4 mr-2" />
        </div>
        <nav className="flex flex-wrap justify-center md:justify-end space-x-6">
          <a href="#" className="hover:text-theme-col-2">Privacy Policy</a>
          <a href="#" className="hover:text-theme-col-2">Terms of Service</a>
          <a href="#" className="hover:text-theme-col-2">Contact Us</a>
        </nav>
      </div>
      <div className="max-w-7xl mx-auto mt-4 text-center text-sm text-gray-400">
        © 2024 TipNex. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
