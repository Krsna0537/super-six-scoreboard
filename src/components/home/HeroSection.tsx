import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthProvider';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const { user } = useAuthContext();
  
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
              {user ? (
                <Button asChild>
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
              )}
              <Button variant="secondary" asChild>
                <Link to="/tournaments">View Tournaments</Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:flex justify-center items-center rounded-lg shadow-xl animate-scale-in h-[400px] group">
            <img
              src="/vk1.jpg"
              alt="Cricket Equipment"
              className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl"
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
