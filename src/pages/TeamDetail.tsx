import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

const TeamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState<any>(null);
  const [allPlayers, setAllPlayers] = useState<any[]>([]);
  const [teamPlayers, setTeamPlayers] = useState<string[]>([]);
  const [captain, setCaptain] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: teamData } = await supabase.from('teams').select('*').eq('id', id).single();
      setTeam(teamData);
      const { data: playersData } = await supabase.from('players').select('id, profile_id, profiles(first_name, last_name)').order('id');
      setAllPlayers(playersData || []);
      const { data: teamPlayersData } = await supabase.from('players').select('id').eq('team_id', id);
      setTeamPlayers((teamPlayersData || []).map((p: any) => p.id));
      setCaptain(teamData?.captain_id || null);
      setLoading(false);
    };
    if (id) fetchData();
  }, [id]);

  const handleSave = async () => {
    setLoading(true);
    await supabase.from('players').update({ team_id: null }).eq('team_id', id); // Remove all
    if (teamPlayers.length > 0) {
      await Promise.all(teamPlayers.map(pid =>
        supabase.from('players').update({ team_id: id }).eq('id', pid)
      ));
    }
    await supabase.from('teams').update({
      captain_id: captain,
    }).eq('id', id);
    setLoading(false);
    navigate('/teams');
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      // First remove all players from the team
      await supabase.from('players').update({ team_id: null }).eq('team_id', id);
      
      // Remove team from any tournaments
      await supabase.from('tournament_teams').delete().eq('team_id', id);
      
      // Remove any match scores for this team
      await supabase.from('match_scores').delete().eq('team_id', id);
      
      // Remove any matches where this team is team1 or team2
      await supabase.from('matches').delete().or(`team1_id.eq.${id},team2_id.eq.${id}`);
      
      // Finally delete the team
      const { error } = await supabase.from('teams').delete().eq('id', id);
      
      if (error) throw error;
      
      navigate('/teams');
    } catch (error: any) {
      alert('Failed to delete team: ' + error.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!team) return <div className="text-center py-12 text-red-500">Team not found.</div>;

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Button variant="outline" onClick={() => navigate('/teams')} className="mb-6">Back to Teams</Button>
      <div className="flex justify-end mb-4">
        <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)} disabled={deleting}>Delete Team</Button>
      </div>
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Delete Team?</h2>
            <p className="mb-4">Are you sure you want to delete this team? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} disabled={deleting}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete} disabled={deleting}>{deleting ? 'Deleting...' : 'Delete'}</Button>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col items-center mb-4">
          <img
            src={team.logo_url || 'https://placehold.co/100/0EA5E9/FFFFFF?text=Team'}
            alt={team.name}
            className="w-24 h-24 rounded-full mb-2"
          />
          <h1 className="text-2xl font-bold mb-1">{team.name}</h1>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add/Remove Players</h2>
        <div className="max-h-48 overflow-y-auto border rounded p-2 bg-gray-50 mb-4">
          {allPlayers.map(player => {
            const name = player.profiles ? `${player.profiles.first_name || ''} ${player.profiles.last_name || ''}`.trim() : player.id;
            return (
              <label key={player.id} className="flex items-center gap-2 mb-1">
                <input
                  type="checkbox"
                  checked={teamPlayers.includes(player.id)}
                  onChange={e => {
                    if (e.target.checked) setTeamPlayers([...teamPlayers, player.id]);
                    else setTeamPlayers(teamPlayers.filter(pid => pid !== player.id));
                  }}
                />
                <span>{name || player.id}</span>
              </label>
            );
          })}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium mb-1">Captain</label>
            <select className="cricket-input w-full" value={captain || ''} onChange={e => setCaptain(e.target.value)}>
              <option value="">None</option>
              {teamPlayers.map(pid => {
                const player = allPlayers.find(p => p.id === pid);
                const name = player?.profiles ? `${player.profiles.first_name || ''} ${player.profiles.last_name || ''}`.trim() : pid;
                return <option key={pid} value={pid}>{name || pid}</option>;
              })}
            </select>
          </div>
        </div>
        <div className="flex justify-end mt-6 gap-2">
          <Button variant="outline" onClick={() => navigate('/teams')}>Cancel</Button>
          <Button onClick={handleSave} disabled={loading}>Save</Button>
        </div>
      </div>
    </div>
  );
};

export default TeamDetail; 