import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-r from-cricket-blue to-cricket-darkblue text-white py-16 md:py-24">
      <div className="cricket-container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="animate-fade-in">
            <h1 className="cricket-heading-1 mb-4">
              Manage Cricket Tournaments Like Never Before
            </h1>
            <p className="text-xl mb-6">
              Comprehensive cricket management platform for tournaments, teams, and live scoring.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="px-6 py-3 bg-white text-cricket-darkblue font-semibold rounded-md hover:bg-gray-100 transition">
                Get Started
              </Link>
              <Link to="/tournaments" className="px-6 py-3 bg-cricket-green text-white font-semibold rounded-md hover:bg-cricket-green/90 transition">
                View Tournaments
              </Link>
            </div>
          </div>
          <div className="hidden md:flex justify-center items-center rounded-lg shadow-xl animate-scale-in h-[400px]">
            <img
              src="/cricket-65.png"
              alt="Cricket Equipment"
              className="max-h-[90%] max-w-[90%] object-contain"
            />
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
    </div>
  );
};

export default HeroSection;
