import React from 'react';
import noon from "../assets/noon.jpg"; // Import the background image
import { Smartphone, DollarSign, Users, BarChart } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:scale-110 duration-200">
    <Icon className="w-12 h-12 text-[#229799] mb-4" />
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const Features = () => {
  const features = [
    {
      icon: Smartphone,
      title: "User-Friendly Mobile App",
      description: "Simplify tipping with our intuitive mobile application, designed for both customers and staff."
    },
    {
      icon: DollarSign,
      title: "Transparent Transactions",
      description: "Ensure fair and transparent tip distribution among your team members."
    },
    {
      icon: Users,
      title: "Boost Staff Morale",
      description: "Increase employee satisfaction and retention with a modern tipping solution."
    },
    {
      icon: BarChart,
      title: "Insightful Analytics",
      description: "Gain valuable insights into tipping patterns and staff performance."
    }
  ];

  return (
    <section  id='whytipnex'
      className="relative bg-cover bg-center bg-fixed min-h-screen py-16 px-6 flex items-center" 
      style={{ backgroundImage: `url(${noon})` }} // Set the background image for parallax effect
    >
      {/* Optional overlay for better contrast */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* Features Content */}
      <div className="relative max-w-7xl mx-auto z-10">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          Why Choose TipNex?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
