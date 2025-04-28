
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TournamentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock data for the tournament
  const tournament = {
    id: parseInt(id || "1"),
    name: "Premier League 2025",
    startDate: "May 15, 2025",
    endDate: "June 30, 2025",
    location: "Mumbai, India",
    format: "T20",
    status: "Upcoming",
    description: "The Premier League 2025 is the biggest cricket tournament of the year, featuring top teams from around the country competing in the T20 format.",
    organizer: "Cricket Association of India",
    image: "https://placehold.co/800x400/0EA5E9/FFFFFF?text=Premier+League+2025",
    teams: [
      { id: 101, name: "Royal Strikers", logo: "https://placehold.co/100/0EA5E9/FFFFFF?text=RS", location: "Mumbai", played: 0, won: 0, lost: 0, points: 0 },
      { id: 102, name: "Thunder Kings", logo: "https://placehold.co/100/10B981/FFFFFF?text=TK", location: "Delhi", played: 0, won: 0, lost: 0, points: 0 },
      { id: 103, name: "Metro Blazers", logo: "https://placehold.co/100/0369A1/FFFFFF?text=MB", location: "Bangalore", played: 0, won: 0, lost: 0, points: 0 },
      { id: 104, name: "City Warriors", logo: "https://placehold.co/100/1F2937/FFFFFF?text=CW", location: "Chennai", played: 0, won: 0, lost: 0, points: 0 },
    ],
    matches: [
      { id: 201, team1: "Royal Strikers", team2: "Thunder Kings", date: "May 15, 2025", time: "18:00", venue: "Mumbai Stadium" },
      { id: 202, team1: "Metro Blazers", team2: "City Warriors", date: "May 16, 2025", time: "18:00", venue: "Bangalore Stadium" },
      { id: 203, team1: "Royal Strikers", team2: "Metro Blazers", date: "May 18, 2025", time: "15:00", venue: "Mumbai Stadium" },
      { id: 204, team1: "Thunder Kings", team2: "City Warriors", date: "May 19, 2025", time: "18:00", venue: "Delhi Stadium" },
    ],
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="cricket-container">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="relative h-64 md:h-80">
            <img 
              src={tournament.image} 
              alt={tournament.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-6 text-white">
                <div className="mb-2 text-sm font-medium bg-cricket-blue inline-block px-3 py-1 rounded-full">
                  {tournament.format} • {tournament.status}
                </div>
                <h1 className="text-3xl font-bold mb-2">{tournament.name}</h1>
                <div className="flex items-center text-sm">
                  <span className="mr-4">{tournament.startDate} - {tournament.endDate}</span>
                  <span>{tournament.location}</span>
                </div>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="overview" className="p-6" onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="teams">Teams</TabsTrigger>
              <TabsTrigger value="matches">Matches</TabsTrigger>
              <TabsTrigger value="standings">Standings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <h2 className="text-2xl font-bold mb-4">Tournament Details</h2>
                  <p className="text-gray-700 mb-6">{tournament.description}</p>
                  
                  <h3 className="text-xl font-bold mb-3">Tournament Format</h3>
                  <p className="text-gray-700 mb-6">
                    This is a {tournament.format} format tournament with league stage followed by playoffs.
                    Each team will play against every other team once in the league stage. 
                    The top 4 teams will qualify for the playoffs consisting of two semifinals and a final match.
                  </p>
                  
                  <h3 className="text-xl font-bold mb-3">Prize Pool</h3>
                  <p className="text-gray-700">
                    Winner: $10,000<br />
                    Runner-up: $5,000<br />
                    Best Player of the Tournament: $1,000
                  </p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-xl font-bold mb-4">Tournament Info</h2>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Format</h4>
                      <p>{tournament.format}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Dates</h4>
                      <p>{tournament.startDate} - {tournament.endDate}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Location</h4>
                      <p>{tournament.location}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Status</h4>
                      <p>{tournament.status}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Teams</h4>
                      <p>{tournament.teams.length}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Organizer</h4>
                      <p>{tournament.organizer}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="teams" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tournament.teams.map((team) => (
                  <div key={team.id} className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-6 flex items-center">
                      <img src={team.logo} alt={team.name} className="w-16 h-16 object-contain mr-4" />
                      <div>
                        <h3 className="font-bold text-lg">
                          <Link to={`/teams/${team.id}`} className="hover:text-cricket-blue transition">
                            {team.name}
                          </Link>
                        </h3>
                        <p className="text-gray-600">{team.location}</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-3 text-sm border-t border-gray-100">
                      <Link to={`/teams/${team.id}`} className="text-cricket-blue hover:underline">
                        View Team
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="matches" className="animate-fade-in">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Match</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tournament.matches.map((match) => (
                      <tr key={match.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium">{match.team1} vs {match.team2}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {match.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {match.time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {match.venue}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link to={`/matches/${match.id}`} className="text-cricket-blue hover:text-cricket-darkblue">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="standings" className="animate-fade-in">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">P</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">W</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">L</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Points</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tournament.teams.map((team) => (
                      <tr key={team.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img src={team.logo} alt={team.name} className="w-8 h-8 mr-3" />
                            <div className="font-medium">{team.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {team.played}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {team.won}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {team.lost}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                          {team.points}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 text-sm text-gray-500">
                <p>* P: Played, W: Won, L: Lost</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TournamentDetail;
