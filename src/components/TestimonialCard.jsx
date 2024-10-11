import React, { useState, useRef, useEffect } from 'react';
import { Star } from 'lucide-react';

const TestimonialCard = ({ review, star }) => (
  <div className="bg-white p-6 rounded-lg shadow-md sm:w-80 w-64 mx-4 flex flex-col">
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 bg-gray-200 rounded-full mr-4 flex items-center justify-center">
        <span className="text-xl font-bold">{review.name[0]}</span>
      </div>
      <div>
        <div className="flex">
          {[...Array(star)].map((_, i) => (
            <Star key={i} className="w-5 h-5 text-yellow-400" fill="#FACC15" />
          ))}
        </div>
      </div>
    </div>
    <p className="text-gray-600 mb-4 flex-grow">{review.text}</p>
    <div>
      <p className="font-bold text-[#229799]">{review.name}</p>
      <p className="text-gray-500 text-sm">{review.title}</p>
    </div>
  </div>
);

const TestimonialSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  
  const reviews = [
    {
      name: "Emma Thompson",
      title: "Restaurant Manager",
      text: "This app has revolutionized our tipping system. It's user-friendly and our staff loves the transparency it provides.",
      star: 4
    },
    {
      name: "Michael Chen",
      title: "Café Owner",
      text: "Implementing this solution was a breeze. It's made tip distribution so much easier and fairer for everyone involved.",
      star: 4
    },
    {
      name: "Sarah Johnson",
      title: "Bar Manager",
      text: "Our customers appreciate the ease of tipping digitally. It's increased our overall tips and staff satisfaction.",
      star: 5
    },
    {
      name: "David Rodriguez",
      title: "Restaurant Owner",
      text: "This platform has streamlined our operations and improved staff morale. Highly recommended for any hospitality business.",
      star: 3
    },
    {
      name: "Lisa Patel",
      title: "Hotel F&B Director",
      text: "The analytics provided by this app have given us valuable insights into our service quality and staff performance.",
      star: 5
    }
  ];

  useEffect(() => {
    const slider = sliderRef.current;
    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      isDown = true;
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
    };

    const handleMouseUp = () => {
      isDown = false;
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2;
      slider.scrollLeft = scrollLeft - walk;
    };

    const handleTouchStart = (e) => {
      isDown = true;
      startX = e.touches[0].pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };

    const handleTouchEnd = () => {
      isDown = false;
    };

    const handleTouchMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.touches[0].pageX - slider.offsetLeft;
      const walk = (x - startX) * 2;
      slider.scrollLeft = scrollLeft - walk;
    };

    slider.addEventListener('mousedown', handleMouseDown);
    slider.addEventListener('mouseleave', handleMouseLeave);
    slider.addEventListener('mouseup', handleMouseUp);
    slider.addEventListener('mousemove', handleMouseMove);

    slider.addEventListener('touchstart', handleTouchStart);
    slider.addEventListener('touchend', handleTouchEnd);
    slider.addEventListener('touchmove', handleTouchMove);

    return () => {
      slider.removeEventListener('mousedown', handleMouseDown);
      slider.removeEventListener('mouseleave', handleMouseLeave);
      slider.removeEventListener('mouseup', handleMouseUp);
      slider.removeEventListener('mousemove', handleMouseMove);

      slider.removeEventListener('touchstart', handleTouchStart);
      slider.removeEventListener('touchend', handleTouchEnd);
      slider.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [reviews.length]);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({
        left: currentIndex * 336, // Adjust this based on your card width
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);

  return (
    <div className="max-w-7xl mx-auto sm:py-16 py-10 px-4 sm:px-6">
      <h2 className="text-3xl font-extrabold text-white text-center mb-8">
        What Our Users Say
      </h2>
      <div 
        ref={sliderRef}
        className="flex overflow-x-auto snap-x snap-mandatory"
        style={{ scrollBehavior: 'smooth' }}
      >
        {reviews.map((review, index) => (
          <div key={index} className="snap-center">
            <TestimonialCard review={review} star={review.star} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialSlider;
