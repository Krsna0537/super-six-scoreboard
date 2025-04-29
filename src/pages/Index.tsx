
import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import Features from '@/components/home/Features';
import LiveMatches from '@/components/home/LiveMatches';
import FeaturedTournaments from '@/components/home/FeaturedTournaments';
import CallToAction from '@/components/home/CallToAction';
import AdminCreator from '@/components/admin/AdminCreator';
import { useAuthContext } from '@/contexts/AuthProvider';

const Index = () => {
  const { user } = useAuthContext();
  
  return (
    <div className="min-h-screen">
      {/* Admin Creator - Only visible temporarily */}
      <div className="container mx-auto mt-4">
        <AdminCreator />
      </div>
      
      <HeroSection />
      <Features />
      <LiveMatches />
      <FeaturedTournaments />
      <CallToAction />
    </div>
  );
};

export default Index;
