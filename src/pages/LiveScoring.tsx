
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const LiveScoring = () => {
  const { id } = useParams<{ id: string }>();
  const [ballsInOver, setBallsInOver] = useState(1);
  
  // Mock match data
  const match = {
    id: parseInt(id || "101"),
    tournamentName: "Premier League 2025",
    team1: { 
      name: "Royal Strikers", 
      logo: "https://placehold.co/100/0EA5E9/FFFFFF?text=RS", 
      score: "156/6", 
      overs: "19.2",
      players: [
        { id: 1001, name: "A. Sharma", isBatting: true, runs: 45, balls: 32, fours: 4, sixes: 2 },
        { id: 1002, name: "R. Patel", isBatting: true, runs: 38, balls: 24, fours: 3, sixes: 1 },
        { id: 1003, name: "S. Kumar", isOut: true, runs: 28, balls: 22, fours: 3, sixes: 0 },
        { id: 1004, name: "V. Singh", isOut: true, runs: 15, balls: 12, fours: 2, sixes: 0 },
      ]
    },
    team2: { 
      name: "Thunder Kings", 
      logo: "https://placehold.co/100/10B981/FFFFFF?text=TK", 
      score: "132/4", 
      overs: "17.1",
      players: [
        { id: 2001, name: "K. Williams", isBowling: true, overs: "3.1", wickets: 2, runs: 24 },
        { id: 2002, name: "J. Smith", overs: "4.0", wickets: 1, runs: 32 },
        { id: 2003, name: "R. Johnson", overs: "4.0", wickets: 2, runs: 28 },
        { id: 2004, name: "M. Brown", overs: "4.0", wickets: 1, runs: 38 },
      ]
    },
    currentOver: [1, 0, 'W', 4, 6],
    status: "Live",
    required: "Thunder Kings need 25 runs in 17 balls",
    recentEvents: [
      { over: "17.1", description: "FOUR! Sharma hits a boundary through covers" },
      { over: "17.0", description: "Single taken, rotates the strike" },
      { over: "16.6", description: "No run, defended back to the bowler" },
      { over: "16.5", description: "WICKET! Singh caught at long-on" },
      { over: "16.4", description: "SIX! Massive hit over mid-wicket" },
    ]
  };

  // Mock scoring actions
  const handleScore = (runs: number) => {
    console.log(`Scored ${runs} run(s)`);
    // In a real app, this would update Supabase
    
    setBallsInOver((prev) => {
      if (prev === 6) return 1;
      return prev + 1;
    });
  };

  const handleWicket = () => {
    console.log("Wicket taken");
    // In a real app, this would update Supabase
    
    setBallsInOver((prev) => {
      if (prev === 6) return 1;
      return prev + 1;
    });
  };

  const handleExtra = (type: string) => {
    console.log(`Extra: ${type}`);
    // In a real app, this would update Supabase
  };

  return (
    <div className="py-6 bg-gray-50 min-h-screen">
      <div className="cricket-container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{match.team1.name} vs {match.team2.name}</h1>
          <Link to={`/matches/${match.id}`} className="text-cricket-blue hover:underline text-sm">
            Back to Match Details
          </Link>
        </div>
        
        {/* Match Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
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
                <div className="flex items-center justify-center mt-3 space-x-3">
                  <span className="flex items-center">
                    <span className="animate-pulse w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                    <span className="text-xs font-medium text-red-500">LIVE</span>
                  </span>
                  <span className="text-xs text-gray-500">Current Over: {match.team2.overs}</span>
                </div>
              </div>
            </div>
            
            {/* Current Over */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Current Over</h2>
              <div className="flex justify-center space-x-4 mb-4">
                {match.currentOver.map((ball, index) => (
                  <div key={index} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    ball === 'W' ? 'bg-red-500' : ball === 4 ? 'bg-cricket-blue' : ball === 6 ? 'bg-cricket-green' : 'bg-gray-500'
                  }`}>
                    {ball}
                  </div>
                ))}
                {/* Empty balls remaining in over */}
                {[...Array(6 - match.currentOver.length)].map((_, index) => (
                  <div key={`empty-${index}`} className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300"></div>
                ))}
              </div>
            </div>
            
            {/* Scoring Interface */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Scoring (Ball {match.team2.overs.split('.')[0]}.{ballsInOver})</h2>
              
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
                <button 
                  className="cricket-button bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-md font-medium"
                  onClick={() => handleScore(0)}
                >
                  0
                </button>
                <button 
                  className="cricket-button bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-md font-medium"
                  onClick={() => handleScore(1)}
                >
                  1
                </button>
                <button 
                  className="cricket-button bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-md font-medium"
                  onClick={() => handleScore(2)}
                >
                  2
                </button>
                <button 
                  className="cricket-button bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-md font-medium"
                  onClick={() => handleScore(3)}
                >
                  3
                </button>
                <button 
                  className="cricket-button bg-cricket-blue text-white hover:bg-cricket-darkblue py-3 rounded-md font-medium"
                  onClick={() => handleScore(4)}
                >
                  4
                </button>
                <button 
                  className="cricket-button bg-cricket-green text-white hover:bg-cricket-green/90 py-3 rounded-md font-medium"
                  onClick={() => handleScore(6)}
                >
                  6
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button 
                  className="cricket-button bg-red-500 text-white hover:bg-red-600 py-3 rounded-md font-medium"
                  onClick={handleWicket}
                >
                  WICKET
                </button>
                <button 
                  className="cricket-button bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-md font-medium"
                  onClick={() => handleExtra('Wide')}
                >
                  WIDE
                </button>
                <button 
                  className="cricket-button bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-md font-medium"
                  onClick={() => handleExtra('No Ball')}
                >
                  NO BALL
                </button>
                <button 
                  className="cricket-button bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-md font-medium"
                  onClick={() => handleExtra('Bye/Leg Bye')}
                >
                  BYE/LEG BYE
                </button>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Batsmen */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Batsmen</h2>
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-left text-gray-500">
                    <th className="pb-2">Batsman</th>
                    <th className="pb-2 text-center">R</th>
                    <th className="pb-2 text-center">B</th>
                    <th className="pb-2 text-center">4s</th>
                    <th className="pb-2 text-center">6s</th>
                    <th className="pb-2 text-center">SR</th>
                  </tr>
                </thead>
                <tbody>
                  {match.team1.players.filter(p => p.isBatting).map((player) => (
                    <tr key={player.id} className="border-t border-gray-100">
                      <td className="py-2">
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-cricket-green rounded-full mr-2"></span>
                          {player.name}
                        </div>
                      </td>
                      <td className="py-2 text-center font-medium">{player.runs}</td>
                      <td className="py-2 text-center">{player.balls}</td>
                      <td className="py-2 text-center">{player.fours}</td>
                      <td className="py-2 text-center">{player.sixes}</td>
                      <td className="py-2 text-center">{((player.runs / player.balls) * 100).toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Bowler */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Current Bowler</h2>
              {match.team2.players.filter(p => p.isBowling).map((player) => (
                <div key={player.id}>
                  <div className="text-lg font-medium">{player.name}</div>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div>
                      <div className="text-xs text-gray-500">Overs</div>
                      <div className="font-medium">{player.overs}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Wickets</div>
                      <div className="font-medium">{player.wickets}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Runs</div>
                      <div className="font-medium">{player.runs}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Recent Events */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Events</h2>
              <div className="space-y-3">
                {match.recentEvents.map((event, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium text-gray-700">{event.over}:</span>{" "}
                    <span className="text-gray-600">{event.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveScoring;
