
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Team, Player } from '@/types/team';

export const useTeamData = (id: string | undefined) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [captain, setCaptain] = useState<string | null>(null);
  const [viceCaptain, setViceCaptain] = useState<string | null>(null);
  const [wicketKeeper, setWicketKeeper] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch team details
        const { data: teamData } = await supabase
          .from('teams')
          .select('*')
          .eq('id', id)
          .single();
        
        if (!teamData) throw new Error('Team not found');
        
        setTeam(teamData as Team);
        setCaptain(teamData.captain_id);
        setViceCaptain(teamData.vice_captain_id || null);
        setWicketKeeper(teamData.wicket_keeper_id || null);

        // Fetch all players
        const { data: allPlayersData } = await supabase
          .from('players')
          .select('id, profile_id, profiles(first_name, last_name)')
          .order('id');
        setAllPlayers(allPlayersData || []);

        // Fetch team players
        const { data: teamPlayersData } = await supabase
          .from('players')
          .select('id, profile_id, profiles(first_name, last_name)')
          .eq('team_id', id);
        setPlayers(teamPlayersData || []);
        setSelectedPlayers(teamPlayersData?.map(p => p.id) || []);
      } catch (error: any) {
        console.error("Error fetching data:", error.message);
        navigate('/teams');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, navigate]);

  return {
    loading,
    team,
    setTeam,
    players,
    setPlayers,
    allPlayers,
    selectedPlayers,
    setSelectedPlayers,
    captain,
    setCaptain,
    viceCaptain,
    setViceCaptain,
    wicketKeeper,
    setWicketKeeper
  };
};
