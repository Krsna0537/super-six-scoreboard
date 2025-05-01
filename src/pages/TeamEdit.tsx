
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader, Save, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TeamDetailsForm from '@/components/teams/TeamDetailsForm';
import PlayersList from '@/components/teams/PlayersList';
import SelectPlayersDialog from '@/components/teams/SelectPlayersDialog';
import { Team, Player } from '@/types/team';
import { getPlayerFullName } from '@/utils/playerUtils';

const TeamEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [isSelectPlayersOpen, setIsSelectPlayersOpen] = useState(false);
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
        
        // Initialize the team with default values for the missing fields
        const extendedTeam: Team = {
          ...teamData,
          vice_captain_id: teamData.vice_captain_id || null,
          wicket_keeper_id: teamData.wicket_keeper_id || null,
          description: teamData.description || '',
        };
        
        setTeam(extendedTeam);
        setCaptain(extendedTeam.captain_id);
        setViceCaptain(extendedTeam.vice_captain_id);
        setWicketKeeper(extendedTeam.wicket_keeper_id);

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

  const handleSave = async () => {
    if (!team) return;
    
    setSaving(true);
    try {
      // We'll be updating only the fields we know exist in the table
      // The API will ignore fields that don't exist in the table
      const updateData: any = {
        name: team.name,
        logo_url: team.logo_url,
        captain_id: captain,
      };
      
      // Only add these fields if they exist on the team object
      // (they may have been added to the DB in a later version)
      if ('description' in team) updateData.description = team.description;
      if ('vice_captain_id' in team) updateData.vice_captain_id = viceCaptain;
      if ('wicket_keeper_id' in team) updateData.wicket_keeper_id = wicketKeeper;

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

  const handlePlayerSelect = (playerId: string) => {
    setSelectedPlayers(prev => 
      prev.includes(playerId)
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (!team) {
    return <div className="text-center text-red-500">Team not found</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" onClick={() => navigate('/teams')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Teams
        </Button>
        <h1 className="text-3xl font-bold">Edit Team: {team.name}</h1>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Team Details</TabsTrigger>
          <TabsTrigger value="players">Players</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Team Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <TeamDetailsForm
                team={team}
                setTeam={setTeam}
                players={players}
                captain={captain}
                setCaptain={setCaptain}
                viceCaptain={viceCaptain}
                setViceCaptain={setViceCaptain}
                wicketKeeper={wicketKeeper}
                setWicketKeeper={setWicketKeeper}
                getPlayerFullName={getPlayerFullName}
              />

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="players">
          <Card>
            <CardHeader>
              <CardTitle>Team Players</CardTitle>
            </CardHeader>
            <CardContent>
              <PlayersList 
                players={players}
                captain={captain}
                viceCaptain={viceCaptain}
                wicketKeeper={wicketKeeper}
                setIsSelectPlayersOpen={setIsSelectPlayersOpen}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <SelectPlayersDialog
        open={isSelectPlayersOpen}
        onOpenChange={setIsSelectPlayersOpen}
        allPlayers={allPlayers}
        selectedPlayers={selectedPlayers}
        handlePlayerSelect={handlePlayerSelect}
      />
    </div>
  );
};

export default TeamEdit;
