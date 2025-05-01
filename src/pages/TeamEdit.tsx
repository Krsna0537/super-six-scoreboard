
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TeamDetailsForm from '@/components/teams/TeamDetailsForm';
import PlayersList from '@/components/teams/PlayersList';
import SelectPlayersDialog from '@/components/teams/SelectPlayersDialog';
import { useTeamData } from '@/hooks/useTeamData';
import { useTeamSave } from '@/hooks/useTeamSave';
import { getPlayerFullName } from '@/utils/playerUtils';

const TeamEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSelectPlayersOpen, setIsSelectPlayersOpen] = useState(false);
  
  const {
    loading,
    team,
    setTeam,
    players,
    allPlayers,
    selectedPlayers,
    setSelectedPlayers,
    captain,
    setCaptain,
    viceCaptain,
    setViceCaptain,
    wicketKeeper,
    setWicketKeeper
  } = useTeamData(id);
  
  const { saving, handleSave } = useTeamSave(id);

  const handlePlayerSelect = (playerId: string) => {
    setSelectedPlayers(prev => 
      prev.includes(playerId)
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
  };

  const onSave = () => {
    handleSave(team, players, selectedPlayers, captain, viceCaptain, wicketKeeper);
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
                <Button onClick={onSave} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Loader className="mr-2 h-4 w-4" />
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
