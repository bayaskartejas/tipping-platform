import React from 'react';
import Header from '../components/Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="font-sans min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

export default Layout;