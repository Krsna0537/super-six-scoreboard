
import React, { useState } from 'react';
import TournamentsList from '@/components/tournaments/TournamentsList';
import TournamentFilters from '@/components/tournaments/TournamentFilters';
import { TournamentCardProps } from '@/components/tournaments/TournamentCard';

// Mock data for tournaments
const mockTournaments: TournamentCardProps[] = [
  {
    id: 1,
    name: "Premier League 2025",
    startDate: "May 15, 2025",
    endDate: "June 30, 2025",
    location: "Mumbai, India",
    teams: 12,
    status: "Upcoming",
    image: "https://placehold.co/400x225/0EA5E9/FFFFFF?text=Premier+League"
  },
  {
    id: 2,
    name: "T20 Championship",
    startDate: "April 10, 2025",
    endDate: "April 25, 2025",
    location: "London, UK",
    teams: 8,
    status: "Registration Open",
    image: "https://placehold.co/400x225/10B981/FFFFFF?text=T20+Championship"
  },
  {
    id: 3,
    name: "Corporate Cup 2025",
    startDate: "July 5, 2025",
    endDate: "July 25, 2025",
    location: "Sydney, Australia",
    teams: 16,
    status: "Upcoming",
    image: "https://placehold.co/400x225/0369A1/FFFFFF?text=Corporate+Cup"
  },
  {
    id: 4,
    name: "Winter Tournament 2025",
    startDate: "January 10, 2025",
    endDate: "February 15, 2025",
    location: "Auckland, New Zealand",
    teams: 10,
    status: "Completed",
    image: "https://placehold.co/400x225/1F2937/FFFFFF?text=Winter+Tournament"
  },
  {
    id: 5,
    name: "Summer Series 2024",
    startDate: "August 1, 2024",
    endDate: "August 30, 2024",
    location: "Cape Town, South Africa",
    teams: 6,
    status: "Completed",
    image: "https://placehold.co/400x225/10B981/FFFFFF?text=Summer+Series"
  },
  {
    id: 6,
    name: "World Championship 2025",
    startDate: "October 15, 2025",
    endDate: "November 20, 2025",
    location: "Melbourne, Australia",
    teams: 20,
    status: "Upcoming",
    image: "https://placehold.co/400x225/0EA5E9/FFFFFF?text=World+Championship"
  },
];

const Tournaments = () => {
  const [tournaments, setTournaments] = useState<TournamentCardProps[]>(mockTournaments);
  const [isLoading, setIsLoading] = useState(false);

  const handleFilter = (filters: any) => {
    setIsLoading(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      let filteredTournaments = [...mockTournaments];
      
      if (filters.status) {
        filteredTournaments = filteredTournaments.filter(
          (t) => t.status.toLowerCase() === filters.status
        );
      }
      
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filteredTournaments = filteredTournaments.filter(
          (t) => 
            t.name.toLowerCase().includes(searchLower) || 
            t.location.toLowerCase().includes(searchLower)
        );
      }
      
      setTournaments(filteredTournaments);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="cricket-container">
        <h1 className="cricket-heading-1 mb-8">Tournaments</h1>
        
        <TournamentFilters onFilter={handleFilter} />
        
        <TournamentsList tournaments={tournaments} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Tournaments;
