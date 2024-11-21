import React from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from 'framer-motion';

const HelperSelection = ({ helpers, staffUrls, selectedHelper, onHelperSelect }) => {
  const sliderRef = React.useRef(null);

  const sliderSettings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 3,
    speed: 500,
    focusOnSelect: true,
    beforeChange: (current, next) => onHelperSelect(helpers[next]),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerPadding: "30px",
        }
      }
    ]
  };

  const nextSlide = () => {
    sliderRef.current.slickNext();
  };

  const prevSlide = () => {
    sliderRef.current.slickPrev();
  };

  return (
    <div className="relative">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Choose Helper ({selectedHelper ? helpers.indexOf(selectedHelper) + 1 : 0}/{helpers.length})</h3>
      <div className="relative">
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-white shadow-lg border border-gray-100"
        >
          <ChevronLeft size={20} />
        </button>
        <Slider ref={sliderRef} {...sliderSettings}>
          {helpers.map((helper) => (
            <div key={helper.id} className="px-2">
              <motion.div
                className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${
                  selectedHelper && selectedHelper.id === helper.id 
                    ? 'scale-105 bg-teal-50 ring-2 ring-teal-500' 
                    : 'scale-95 opacity-60'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative">
                  <img
                    src={staffUrls[helper.id] || '/placeholder.svg?height=64&width=64'}
                    alt={helper.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  {selectedHelper && selectedHelper.id === helper.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute -top-1 -right-1 bg-teal-500 text-white text-xs px-2 py-1 rounded-full"
                    >
                      Receiving Tip
                    </motion.div>
                  )}
                </div>
                <span className="mt-2 text-sm font-medium">{helper.name}</span>
                <div className="flex items-center mt-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="ml-1 text-xs text-gray-600">
                    {helper.avgRating ? helper.avgRating.toFixed(1) : 'N/A'}
                  </span>
                </div>
              </motion.div>
            </div>
          ))}
        </Slider>
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-white shadow-lg border border-gray-100"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default HelperSelection;