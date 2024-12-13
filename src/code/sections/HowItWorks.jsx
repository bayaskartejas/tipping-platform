import React, { useState, useEffect, useRef } from 'react';
import sunset from "../../assets/sunset.jpg";
import { motion } from 'framer-motion';

function HowItWorks() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startX, setStartX] = useState(null);
  const autoSlideInterval = useRef(null);

  const steps = [
    {
      title: 'Scan',
      description: 'Customers simply scan a QR code from their mobile phone camera to access our tipping platform. No app required!',
      image: '/placeholder.svg?height=500&width=250'
    },
    {
      title: 'Tip',
      description: 'They then choose how much tip they would like to leave and can also leave a review and rating at the same time.',
      image: '/placeholder.svg?height=500&width=250'
    },
    {
      title: 'Pay',
      description: 'The tip is sent directly to the staff member(s) with real-time notifications, and they can track and view all tip transactions for full transparency.',
      image: '/placeholder.svg?height=500&width=250'
    }
  ];

  useEffect(() => {
    const startAutoSlide = () => {
      autoSlideInterval.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % steps.length);
      }, 10000);
    };

    const stopAutoSlide = () => {
      if (autoSlideInterval.current) {
        clearInterval(autoSlideInterval.current);
      }
    };

    const handleResize = () => {
      if (window.innerWidth < 768) {
        startAutoSlide();
      } else {
        stopAutoSlide();
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      stopAutoSlide();
      window.removeEventListener('resize', handleResize);
    };
  }, [steps.length]);

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (startX === null) return;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left
        setCurrentIndex((prevIndex) => (prevIndex + 1) % steps.length);
      } else {
        // Swipe right
        setCurrentIndex((prevIndex) => (prevIndex - 1 + steps.length) % steps.length);
      }
    }

    setStartX(null);
  };

  return (
    <section 
      id="howitworks" 
      className="relative bg-cover bg-fixed bg-center bg-no-repeat min-h-screen flex items-center justify-center px-6"
      style={{ backgroundImage: `url(${sunset})` }}
    >
      {/* Black overlay */}
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

      {/* Content on top of the overlay */}
      <div className="relative z-10 container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-6 text-white">
          How does <span className="text-theme-col-2">cashless tipping</span> work?
        </h2>
        <p className="text-center text-gray-200 mb-12 max-w-3xl mx-auto hidden sm:flex">
          If your business accepts tips, TipNex's cashless tipping platform is for you! Customers simply scan a
          QR code with their smartphone to leave a contactless tip, rating, and review.
        </p>
        <div 
          className="flex flex-col md:flex-row justify-center items-start space-y-8 md:space-y-0 md:space-x-8"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className={`flex flex-col items-center max-w-xs ${index === currentIndex ? 'md:block' : 'md:block hidden'}`}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <img src={step.image} alt={`${step.title} process`} className="w-full h-auto mb-4 rounded-lg shadow-lg" />
              <h3 className="text-2xl font-bold text-theme-col-2 mb-2">{step.title}</h3>
              <p className="text-center text-gray-200">{step.description}</p>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-center mt-4 md:hidden">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full mx-1 ${
                index === currentIndex ? 'bg-theme-col-2' : 'bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;