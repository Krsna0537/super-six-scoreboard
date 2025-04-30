import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<string>('');
  const [tournamentInfo, setTournamentInfo] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch all tournaments
    const fetchTournaments = async () => {
      const { data } = await supabase.from('tournaments').select('id, name');
      if (data) setTournaments(data);
    };
    fetchTournaments();
  }, []);

  useEffect(() => {
    if (!selectedTournament) return;
    setLoading(true);
    // Fetch tournament info
    supabase.from('tournaments').select('*').eq('id', selectedTournament).single().then(({ data }) => setTournamentInfo(data));
    // Fetch matches
    supabase.from('matches').select('*').eq('tournament_id', selectedTournament).order('match_date', { ascending: true }).then(({ data }) => setMatches(data || []));
    // Fetch leaderboard (teams in tournament)
    supabase.from('tournament_teams').select('team_id, teams(name)').eq('tournament_id', selectedTournament).then(({ data }) => setLeaderboard(data || []));
    setLoading(false);
  }, [selectedTournament]);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="mb-8">
        <label htmlFor="tournament-select" className="block mb-2 font-medium">Select Tournament</label>
        <select
          id="tournament-select"
          className="cricket-input w-full max-w-md"
          value={selectedTournament}
          onChange={e => setSelectedTournament(e.target.value)}
        >
          <option value="">-- Choose a tournament --</option>
          {tournaments.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>
      {selectedTournament && tournamentInfo && (
        <div className="space-y-8">
          <section className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-2">{tournamentInfo.name}</h2>
            <p className="text-gray-600 mb-2">{tournamentInfo.location}</p>
            <p className="text-gray-600 mb-2">{tournamentInfo.format} | {tournamentInfo.status}</p>
            <p className="text-gray-600 mb-2">{new Date(tournamentInfo.start_date).toLocaleDateString()} - {new Date(tournamentInfo.end_date).toLocaleDateString()}</p>
            <p className="text-gray-700">{tournamentInfo.description}</p>
          </section>
          <section className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">Scheduled Matches</h3>
            {matches.length === 0 ? (
              <p className="text-gray-500">No matches scheduled for this tournament.</p>
            ) : (
              <ul className="divide-y">
                {matches.map(match => (
                  <li key={match.id} className="py-2 flex justify-between items-center">
                    <span>{match.team1_id} vs {match.team2_id}</span>
                    <span>{new Date(match.match_date).toLocaleDateString()}</span>
                    <span className="text-sm text-gray-500">{match.venue}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">Leaderboard / Teams</h3>
            {leaderboard.length === 0 ? (
              <p className="text-gray-500">No teams found for this tournament.</p>
            ) : (
              <ul className="divide-y">
                {leaderboard.map((entry, idx) => (
                  <li key={entry.team_id} className="py-2 flex items-center">
                    <span className="font-medium mr-2">{idx + 1}.</span>
                    <span>{entry.teams?.name || 'Team'}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
      {loading && <div className="text-center py-8">Loading...</div>}
    </div>
  );
}
