
import React from 'react';
import { Link } from 'react-router-dom';

// Mock data for featured tournaments
const featuredTournaments = [
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
];

const FeaturedTournaments = () => {
  return (
    <section className="py-12 bg-white">
      <div className="cricket-container">
        <div className="flex flex-wrap justify-between items-center mb-8">
          <h2 className="cricket-heading-2">Featured Tournaments</h2>
          <Link to="/tournaments" className="text-cricket-blue hover:text-cricket-darkblue font-medium">
            View All Tournaments
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTournaments.map((tournament) => (
            <div key={tournament.id} className="cricket-card group">
              <div className="relative overflow-hidden">
                <img 
                  src={tournament.image} 
                  alt={tournament.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-white py-1 px-3 rounded-full text-xs font-medium text-cricket-darkblue">
                  {tournament.status}
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="cricket-heading-4 mb-2">
                  <Link to={`/tournaments/${tournament.id}`} className="hover:text-cricket-blue transition">
                    {tournament.name}
                  </Link>
                </h3>
                
                <div className="space-y-2 text-gray-600 text-sm mb-4">
                  <p>
                    <span className="font-semibold">Date:</span> {tournament.startDate} - {tournament.endDate}
                  </p>
                  <p>
                    <span className="font-semibold">Location:</span> {tournament.location}
                  </p>
                  <p>
                    <span className="font-semibold">Teams:</span> {tournament.teams}
                  </p>
                </div>
                
                <Link 
                  to={`/tournaments/${tournament.id}`}
                  className="inline-block text-cricket-blue font-medium hover:text-cricket-darkblue"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedTournaments;
