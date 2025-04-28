
import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import FeaturedTournaments from '@/components/home/FeaturedTournaments';
import LiveMatches from '@/components/home/LiveMatches';
import Features from '@/components/home/Features';
import CallToAction from '@/components/home/CallToAction';

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedTournaments />
      <LiveMatches />
      <Features />
      <CallToAction />
    </div>
  );
};

export default Index;
