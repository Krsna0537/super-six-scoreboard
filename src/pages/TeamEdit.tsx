import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader, Save, ArrowLeft, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';

// Extended team interface to include the missing fields
interface Team {
  id: string;
  name: string;
  logo_url: string | null;
  created_at: string | null;
  updated_at: string | null;
  captain_id: string | null;
  vice_captain_id?: string | null;
  wicket_keeper_id?: string | null;
  description?: string | null;
}

const TeamEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [allPlayers, setAllPlayers] = useState<any[]>([]);
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

  // Safe getter for player name with fallbacks
  const getPlayerInitials = (player: any) => {
    if (!player || !player.profiles) return "??";
    const firstName = player.profiles.first_name || "";
    const lastName = player.profiles.last_name || "";
    return (firstName[0] || "") + (lastName[0] || "");
  };

  const getPlayerFullName = (player: any) => {
    if (!player || !player.profiles) return "Unknown Player";
    return `${player.profiles.first_name || ""} ${player.profiles.last_name || ""}`.trim() || "Unknown Player";
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
              <div className="flex items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={team.logo_url || undefined} />
                  <AvatarFallback>{team.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Label>Team Logo URL</Label>
                  <Input
                    value={team.logo_url || ''}
                    onChange={(e) => setTeam({ ...team, logo_url: e.target.value })}
                    placeholder="Enter logo URL"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Team Name</Label>
                <Input
                  value={team.name}
                  onChange={(e) => setTeam({ ...team, name: e.target.value })}
                  placeholder="Enter team name"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={team.description || ''}
                  onChange={(e) => setTeam({ ...team, description: e.target.value })}
                  placeholder="Enter team description"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Captain</Label>
                  <Select value={captain || ''} onValueChange={setCaptain}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select captain" />
                    </SelectTrigger>
                    <SelectContent>
                      {players.map((player) => (
                        <SelectItem key={player.id} value={player.id}>
                          {getPlayerFullName(player)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Vice Captain</Label>
                  <Select value={viceCaptain || ''} onValueChange={setViceCaptain}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vice captain" />
                    </SelectTrigger>
                    <SelectContent>
                      {players.map((player) => (
                        <SelectItem key={player.id} value={player.id}>
                          {getPlayerFullName(player)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Wicket Keeper</Label>
                  <Select value={wicketKeeper || ''} onValueChange={setWicketKeeper}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select wicket keeper" />
                    </SelectTrigger>
                    <SelectContent>
                      {players.map((player) => (
                        <SelectItem key={player.id} value={player.id}>
                          {getPlayerFullName(player)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

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
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Current Players</h3>
                <Dialog open={isSelectPlayersOpen} onOpenChange={setIsSelectPlayersOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Users className="mr-2 h-4 w-4" />
                      Select Players
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Select Players</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-4">
                        {allPlayers.map((player) => (
                          <div
                            key={player.id}
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>
                                  {getPlayerInitials(player)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {getPlayerFullName(player)}
                                </p>
                              </div>
                            </div>
                            <Checkbox
                              checked={selectedPlayers.includes(player.id)}
                              onCheckedChange={() => handlePlayerSelect(player.id)}
                            />
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {getPlayerInitials(player)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {getPlayerFullName(player)}
                        </p>
                        <div className="flex gap-2 mt-1">
                          {player.id === captain && <Badge variant="secondary">Captain</Badge>}
                          {player.id === viceCaptain && <Badge variant="secondary">Vice Captain</Badge>}
                          {player.id === wicketKeeper && <Badge variant="secondary">WK</Badge>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamEdit;
