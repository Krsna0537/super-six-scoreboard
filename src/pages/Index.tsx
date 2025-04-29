import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import Features from '@/components/home/Features';
import LiveMatches from '@/components/home/LiveMatches';
import FeaturedTournaments from '@/components/home/FeaturedTournaments';
import CallToAction from '@/components/home/CallToAction';
import { useAuthContext } from '@/contexts/AuthProvider';

const Index = () => {
  const { user } = useAuthContext();
  
  return (
    <div className="min-h-screen">
      <HeroSection />
      <Features />
      <LiveMatches />
      <FeaturedTournaments />
      <CallToAction />
    </div>
  );
};

export default Index;
