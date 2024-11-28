import React from 'react';
import Footer from './Footer';
import TestimonialSlider from './TestimonialCard'; 
import night from '../../assets/night.jpg'; 

const FooterSection = () => {
    return (
        <div
          className="relative bg-cover bg-center bg-fixed h-screen flex flex-col justify-between"
          style={{ backgroundImage: `url(${night})` }}
        >
          {/* Black Overlay */} 
          <div className="absolute inset-0 bg-black opacity-50"></div>
    
          {/* Content Container */}
          <div className="relative flex-grow flex flex-col">
            {/* Testimonial Slider */}
            <div className="">
              <TestimonialSlider />
            </div>
            <div className='absolute bottom-0 w-full'>
             <Footer />
            </div>
            {/* Footer (at the bottom) */}
            
          </div>
        </div>
      );
    };

export default FooterSection;
