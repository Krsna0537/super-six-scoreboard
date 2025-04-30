import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface ManageTeamPlayersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team: any;
  onTeamUpdated?: () => void;
}

const ManageTeamPlayersDialog: React.FC<ManageTeamPlayersDialogProps> = ({ open, onOpenChange, team, onTeamUpdated }) => {
  const [allPlayers, setAllPlayers] = useState<any[]>([]);
  const [teamPlayers, setTeamPlayers] = useState<string[]>([]);
  const [captain, setCaptain] = useState<string | null>(null);
  const [viceCaptain, setViceCaptain] = useState<string | null>(null);
  const [wicketKeeper, setWicketKeeper] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // New player form state
  const [newPlayer, setNewPlayer] = useState({ first_name: '', last_name: '' });
  const [addingPlayer, setAddingPlayer] = useState(false);

  useEffect(() => {
    if (open && team) {
      // Fetch all players
      supabase.from('players').select('id, profile_id, profiles(first_name, last_name)').then(({ data }) => {
        setAllPlayers(data || []);
      });
      // Fetch team players
      supabase.from('players').select('id').eq('team_id', team.id).then(({ data }) => {
        setTeamPlayers((data || []).map((p: any) => p.id));
      });
      // Fetch team roles
      setCaptain(team.captain_id || null);
      setViceCaptain(team.vice_captain_id || null);
      setWicketKeeper(team.wicket_keeper_id || null);
    }
  }, [open, team]);

  const handleAddPlayer = async () => {
    setAddingPlayer(true);
    // Create a new profile for the player (with browser UUID)
    const profileId = crypto.randomUUID();
    const { data: profile, error: profileError } = await supabase.from('profiles').insert({ id: profileId, first_name: newPlayer.first_name, last_name: newPlayer.last_name }).select().single();
    if (profileError || !profile) {
      setAddingPlayer(false);
      return;
    }
    // Create the player and assign to this team
    const { data: player, error: playerError } = await supabase.from('players').insert({ profile_id: profile.id, team_id: team.id }).select().single();
    if (!playerError && player) {
      setAllPlayers((prev) => [...prev, { ...player, profiles: profile }]);
      setTeamPlayers((prev) => [...prev, player.id]);
      setNewPlayer({ first_name: '', last_name: '' });
    }
    setAddingPlayer(false);
  };

  const handleSave = async () => {
    setLoading(true);
    // Update team players
    await supabase.from('players').update({ team_id: null }).eq('team_id', team.id); // Remove all
    if (teamPlayers.length > 0) {
      await Promise.all(teamPlayers.map(pid =>
        supabase.from('players').update({ team_id: team.id }).eq('id', pid)
      ));
    }
    // Update team roles
    await supabase.from('teams').update({
      captain_id: captain,
      vice_captain_id: viceCaptain,
      wicket_keeper_id: wicketKeeper,
    }).eq('id', team.id);
    setLoading(false);
    onOpenChange(false);
    if (onTeamUpdated) onTeamUpdated();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Players for {team.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <div className="font-semibold mb-2">Add/Remove Players</div>
            <div className="max-h-48 overflow-y-auto border rounded p-2 bg-gray-50">
              {allPlayers.map(player => {
                const name = player.profiles ? `${player.profiles.first_name || ''} ${player.profiles.last_name || ''}`.trim() : player.id;
                return (
                  <label key={player.id} className="flex items-center gap-2 mb-1">
                    <input
                      type="checkbox"
                      checked={teamPlayers.includes(player.id)}
                      onChange={e => {
                        if (e.target.checked) setTeamPlayers([...teamPlayers, player.id]);
                        else setTeamPlayers(teamPlayers.filter(id => id !== player.id));
                      }}
                    />
                    <span>{name || player.id}</span>
                  </label>
                );
              })}
            </div>
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
            <div>
              <label className="block font-medium mb-1">Vice Captain</label>
              <select className="cricket-input w-full" value={viceCaptain || ''} onChange={e => setViceCaptain(e.target.value)}>
                <option value="">None</option>
                {teamPlayers.map(pid => {
                  const player = allPlayers.find(p => p.id === pid);
                  const name = player?.profiles ? `${player.profiles.first_name || ''} ${player.profiles.last_name || ''}`.trim() : pid;
                  return <option key={pid} value={pid}>{name || pid}</option>;
                })}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Wicket Keeper</label>
              <select className="cricket-input w-full" value={wicketKeeper || ''} onChange={e => setWicketKeeper(e.target.value)}>
                <option value="">None</option>
                {teamPlayers.map(pid => {
                  const player = allPlayers.find(p => p.id === pid);
                  const name = player?.profiles ? `${player.profiles.first_name || ''} ${player.profiles.last_name || ''}`.trim() : pid;
                  return <option key={pid} value={pid}>{name || pid}</option>;
                })}
              </select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
          <Button onClick={handleSave} disabled={loading}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManageTeamPlayersDialog; 