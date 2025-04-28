
import React from 'react';
import TournamentCard, { TournamentCardProps } from './TournamentCard';

interface TournamentsListProps {
  tournaments: TournamentCardProps[];
  isLoading?: boolean;
}

const TournamentsList = ({ tournaments, isLoading = false }: TournamentsListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="cricket-card animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-5">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tournaments.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
        <p className="text-gray-500">No tournaments found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tournaments.map((tournament) => (
        <TournamentCard key={tournament.id} {...tournament} />
      ))}
    </div>
  );
};

export default TournamentsList;
