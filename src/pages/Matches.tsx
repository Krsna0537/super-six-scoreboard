
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const matchesByStatus = {
  live: [
    {
      id: 101,
      tournamentName: "Premier League 2025",
      team1: { name: "Royal Strikers", logo: "https://placehold.co/100/0EA5E9/FFFFFF?text=RS", score: "156/6", overs: "19.2" },
      team2: { name: "Thunder Kings", logo: "https://placehold.co/100/10B981/FFFFFF?text=TK", score: "132/4", overs: "17.1" },
      status: "Live",
      required: "Thunder Kings need 25 runs in 17 balls"
    },
    {
      id: 102,
      tournamentName: "T20 Championship",
      team1: { name: "City Warriors", logo: "https://placehold.co/100/0EA5E9/FFFFFF?text=CW", score: "212/8", overs: "20.0" },
      team2: { name: "Metro Blazers", logo: "https://placehold.co/100/10B981/FFFFFF?text=MB", score: "118/3", overs: "12.4" },
      status: "Live",
      required: "Metro Blazers need 95 runs in 44 balls"
    },
  ],
  upcoming: [
    {
      id: 201,
      tournamentName: "Premier League 2025",
      team1: { name: "Royal Strikers", logo: "https://placehold.co/100/0EA5E9/FFFFFF?text=RS" },
      team2: { name: "Metro Blazers", logo: "https://placehold.co/100/10B981/FFFFFF?text=MB" },
      date: "May 18, 2025",
      time: "15:00",
      venue: "Mumbai Stadium"
    },
    {
      id: 202,
      tournamentName: "T20 Championship",
      team1: { name: "Thunder Kings", logo: "https://placehold.co/100/0EA5E9/FFFFFF?text=TK" },
      team2: { name: "City Warriors", logo: "https://placehold.co/100/10B981/FFFFFF?text=CW" },
      date: "May 19, 2025",
      time: "18:00",
      venue: "Delhi Stadium"
    },
    {
      id: 203,
      tournamentName: "Corporate Cup 2025",
      team1: { name: "Financial Giants", logo: "https://placehold.co/100/0EA5E9/FFFFFF?text=FG" },
      team2: { name: "Tech Titans", logo: "https://placehold.co/100/10B981/FFFFFF?text=TT" },
      date: "July 5, 2025",
      time: "14:00",
      venue: "Sydney International Ground"
    },
  ],
  completed: [
    {
      id: 301,
      tournamentName: "Winter Tournament 2025",
      team1: { name: "Southern Stars", logo: "https://placehold.co/100/0EA5E9/FFFFFF?text=SS", score: "187/7", overs: "20.0" },
      team2: { name: "Northern Lights", logo: "https://placehold.co/100/10B981/FFFFFF?text=NL", score: "190/4", overs: "19.2" },
      result: "Northern Lights won by 6 wickets",
      date: "Jan 15, 2025",
    },
    {
      id: 302,
      tournamentName: "Winter Tournament 2025",
      team1: { name: "Eastern Eagles", logo: "https://placehold.co/100/0EA5E9/FFFFFF?text=EE", score: "145/9", overs: "20.0" },
      team2: { name: "Western Wolves", logo: "https://placehold.co/100/10B981/FFFFFF?text=WW", score: "146/3", overs: "18.1" },
      result: "Western Wolves won by 7 wickets",
      date: "Jan 18, 2025",
    },
  ]
};

const Matches = () => {
  const [activeTab, setActiveTab] = useState("live");

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
          {/* Live Matches */}
          {activeTab === "live" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {matchesByStatus.live.map((match) => (
                <div key={match.id} className="cricket-card relative">
                  <div className="absolute top-4 right-4 flex items-center space-x-2">
                    <span className="animate-pulse w-2 h-2 bg-red-500 rounded-full"></span>
                    <span className="text-xs font-medium text-red-500">LIVE</span>
                  </div>
                  
                  <div className="p-6">
                    <div className="text-sm text-gray-500 mb-4">{match.tournamentName}</div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                      {/* Team 1 */}
                      <div className="md:col-span-3 flex items-center justify-center md:justify-end">
                        <div className="text-right mr-4">
                          <div className="font-bold text-lg">{match.team1.name}</div>
                          <div className="text-xl font-bold text-cricket-darkblue">{match.team1.score}</div>
                          <div className="text-sm text-gray-500">{match.team1.overs} overs</div>
                        </div>
                        <img src={match.team1.logo} alt={match.team1.name} className="w-16 h-16 object-contain" />
                      </div>
                      
                      {/* VS */}
                      <div className="md:col-span-1 flex justify-center items-center">
                        <div className="text-lg font-bold text-gray-400">VS</div>
                      </div>
                      
                      {/* Team 2 */}
                      <div className="md:col-span-3 flex items-center justify-center md:justify-start">
                        <img src={match.team2.logo} alt={match.team2.name} className="w-16 h-16 object-contain" />
                        <div className="ml-4">
                          <div className="font-bold text-lg">{match.team2.name}</div>
                          <div className="text-xl font-bold text-cricket-darkblue">{match.team2.score}</div>
                          <div className="text-sm text-gray-500">{match.team2.overs} overs</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-center">
                      <div className="text-sm font-medium text-gray-600">{match.required}</div>
                    </div>
                    
                    <div className="mt-6 flex justify-center">
                      <Link to={`/matches/${match.id}/live`} className="cricket-button-primary px-6 py-2">
                        Watch Live
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              
              {matchesByStatus.live.length === 0 && (
                <div className="col-span-full text-center py-12 bg-white rounded-lg border border-gray-100">
                  <p className="text-gray-500">No live matches at the moment.</p>
                  <p className="mt-2">
                    <Link to="/matches?tab=upcoming" className="text-cricket-blue hover:underline">
                      View upcoming matches
                    </Link>
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Upcoming Matches */}
          {activeTab === "upcoming" && (
            <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
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
                  {matchesByStatus.upcoming.map((match) => (
                    <tr key={match.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">{match.tournamentName}</div>
                          <div className="flex items-center">
                            <img src={match.team1.logo} alt={match.team1.name} className="w-8 h-8 mr-2" />
                            <span className="font-medium">{match.team1.name}</span>
                            <span className="mx-2 text-gray-400">vs</span>
                            <img src={match.team2.logo} alt={match.team2.name} className="w-8 h-8 mr-2" />
                            <span className="font-medium">{match.team2.name}</span>
                          </div>
                        </div>
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
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {matchesByStatus.upcoming.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No upcoming matches scheduled.</p>
                </div>
              )}
            </div>
          )}
          
          {/* Completed Matches */}
          {activeTab === "completed" && (
            <div className="space-y-4">
              {matchesByStatus.completed.map((match) => (
                <div key={match.id} className="cricket-card">
                  <div className="p-6">
                    <div className="text-sm text-gray-500 mb-4">
                      {match.tournamentName} • {match.date}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                      {/* Team 1 */}
                      <div className="md:col-span-3 flex items-center justify-center md:justify-end">
                        <div className="text-right mr-4">
                          <div className="font-bold text-lg">{match.team1.name}</div>
                          <div className="text-xl font-bold text-cricket-darkblue">{match.team1.score}</div>
                          <div className="text-sm text-gray-500">{match.team1.overs} overs</div>
                        </div>
                        <img src={match.team1.logo} alt={match.team1.name} className="w-16 h-16 object-contain" />
                      </div>
                      
                      {/* VS */}
                      <div className="md:col-span-1 flex justify-center items-center">
                        <div className="text-lg font-bold text-gray-400">VS</div>
                      </div>
                      
                      {/* Team 2 */}
                      <div className="md:col-span-3 flex items-center justify-center md:justify-start">
                        <img src={match.team2.logo} alt={match.team2.name} className="w-16 h-16 object-contain" />
                        <div className="ml-4">
                          <div className="font-bold text-lg">{match.team2.name}</div>
                          <div className="text-xl font-bold text-cricket-darkblue">{match.team2.score}</div>
                          <div className="text-sm text-gray-500">{match.team2.overs} overs</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-center">
                      <div className="text-sm font-medium text-cricket-green">{match.result}</div>
                    </div>
                    
                    <div className="mt-6 flex justify-center">
                      <Link to={`/matches/${match.id}`} className="text-cricket-blue hover:underline">
                        View Match Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              
              {matchesByStatus.completed.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
                  <p className="text-gray-500">No completed matches yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Matches;
