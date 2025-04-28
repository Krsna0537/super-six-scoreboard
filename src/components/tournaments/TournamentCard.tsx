
import React from 'react';
import { Link } from 'react-router-dom';

export interface TournamentCardProps {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  teams: number;
  status: string;
  image: string;
}

const TournamentCard = ({ id, name, startDate, endDate, location, teams, status, image }: TournamentCardProps) => {
  return (
    <div className="cricket-card group">
      <div className="relative overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-white py-1 px-3 rounded-full text-xs font-medium text-cricket-darkblue">
          {status}
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="cricket-heading-4 mb-2">
          <Link to={`/tournaments/${id}`} className="hover:text-cricket-blue transition">
            {name}
          </Link>
        </h3>
        
        <div className="space-y-2 text-gray-600 text-sm mb-4">
          <p>
            <span className="font-semibold">Date:</span> {startDate} - {endDate}
          </p>
          <p>
            <span className="font-semibold">Location:</span> {location}
          </p>
          <p>
            <span className="font-semibold">Teams:</span> {teams}
          </p>
        </div>
        
        <Link 
          to={`/tournaments/${id}`}
          className="inline-block text-cricket-blue font-medium hover:text-cricket-darkblue"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default TournamentCard;
