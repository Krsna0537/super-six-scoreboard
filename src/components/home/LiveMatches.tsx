import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCricketAPI } from '../../hooks/useCricketAPI';

// Mock data for live matches as fallback
const mockLiveMatches = [
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
];

const LiveMatches = () => {
  const { sportmonks } = useCricketAPI();
  const [liveMatches, setLiveMatches] = useState(mockLiveMatches);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Function to fetch live matches
    const fetchLiveMatches = async () => {
      try {
        setLoading(true);
        const response = await sportmonks.getLiveMatches();
        
        // If we have API data, transform and use it
        if (response && response.data && response.data.length > 0) {
          const apiMatches = response.data.map((match: any) => ({
            id: match.id,
            tournamentName: match.league?.name || "T20 Match",
            team1: { 
              name: match.teams?.home?.name || "Home Team", 
              logo: match.teams?.home?.image_path || "https://placehold.co/100/0EA5E9/FFFFFF?text=HT",
              score: `${match.scores?.home?.score || 0}/${match.scores?.home?.wickets || 0}`,
              overs: `${match.scores?.home?.overs || 0}`
            },
            team2: { 
              name: match.teams?.away?.name || "Away Team", 
              logo: match.teams?.away?.image_path || "https://placehold.co/100/10B981/FFFFFF?text=AT",
              score: `${match.scores?.away?.score || 0}/${match.scores?.away?.wickets || 0}`,
              overs: `${match.scores?.away?.overs || 0}`
            },
            status: "Live",
            required: match.note || "Match in progress"
          }));
          setLiveMatches(apiMatches);
        } else {
          console.log("No live matches from API, using mock data");
          // Keep using mock data if API returns no matches
        }
      } catch (error) {
        console.error("Error fetching live matches:", error);
        setError("Failed to fetch live match data. Using demo data instead.");
        // Keep using mock data on error
      } finally {
        setLoading(false);
      }
    };

    fetchLiveMatches();
    // Refresh every 60 seconds
    const interval = setInterval(fetchLiveMatches, 60000);
    return () => clearInterval(interval);
  }, [sportmonks]);

  return (
    <section className="py-12 bg-gray-50">
      <div className="cricket-container">
        <div className="flex flex-wrap justify-between items-center mb-8">
          <h2 className="cricket-heading-2">Live Matches</h2>
          <Link to="/matches" className="text-cricket-blue hover:text-cricket-darkblue font-medium">
            View All Matches
          </Link>
        </div>
        
        {error && (
          <div className="mb-4 p-2 bg-yellow-50 text-yellow-700 rounded">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {liveMatches.map((match) => (
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
        </div>
        
        {liveMatches.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
            <p className="text-gray-500">No live matches at the moment.</p>
            <p className="mt-2">
              <Link to="/matches" className="text-cricket-blue hover:underline">
                View upcoming matches
              </Link>
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default LiveMatches;
