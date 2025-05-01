
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Team, Player } from '@/types/team';

export const useTeamSave = (id: string | undefined) => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const handleSave = async (
    team: Team | null,
    players: Player[],
    selectedPlayers: string[],
    captain: string | null,
    viceCaptain: string | null,
    wicketKeeper: string | null
  ) => {
    if (!team) return;
    
    setSaving(true);
    try {
      const updateData = {
        name: team.name,
        logo_url: team.logo_url,
        captain_id: captain,
        vice_captain_id: viceCaptain,
        wicket_keeper_id: wicketKeeper,
        description: team.description
      };
      
      // Update team details
      const { error: teamError } = await supabase
        .from('teams')
        .update(updateData)
        .eq('id', id);

      if (teamError) throw teamError;

      // Update player team assignments
      const playersToAdd = selectedPlayers.filter(id => !players.some(p => p.id === id));
      const playersToRemove = players.filter(p => !selectedPlayers.includes(p.id)).map(p => p.id);

      // Add new players to team
      if (playersToAdd.length > 0) {
        const { error: addError } = await supabase
          .from('players')
          .update({ team_id: id })
          .in('id', playersToAdd);
        
        if (addError) throw addError;
      }

      // Remove players from team
      if (playersToRemove.length > 0) {
        const { error: removeError } = await supabase
          .from('players')
          .update({ team_id: null })
          .in('id', playersToRemove);
        
        if (removeError) throw removeError;
      }

      navigate('/teams');
    } catch (error: any) {
      console.error("Error saving data:", error.message);
      alert(`Error saving team: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return { saving, handleSave };
};
