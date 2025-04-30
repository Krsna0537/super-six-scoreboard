import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LiveMatches } from '../components/LiveMatches';
import { UpcomingMatches } from '../components/UpcomingMatches';
import { CompletedMatches } from '../components/CompletedMatches';
// You can create similar components for CompletedMatches if needed

const Matches = () => {
  const [activeTab, setActiveTab] = useState('live');

  return (
    <div className="py-12 bg-gray-50">
      <div className="cricket-container">
        <h1 className="cricket-heading-1 mb-8">Matches</h1>
        <Tabs defaultValue="live" className="mb-8" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="live">Live</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="animate-fade-in">
          {activeTab === 'live' && <LiveMatches />}
          {activeTab === 'upcoming' && <UpcomingMatches />}
          {activeTab === 'completed' && <CompletedMatches />}
        </div>
      </div>
    </div>
  );
};

export default Matches;
