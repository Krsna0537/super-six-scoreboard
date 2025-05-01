
import React from 'react';
import { Team } from '@/types/team';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TeamDetailsFormProps {
  team: Team;
  setTeam: React.Dispatch<React.SetStateAction<Team | null>>;
  players: any[];
  captain: string | null;
  setCaptain: (value: string | null) => void;
  viceCaptain: string | null;
  setViceCaptain: (value: string | null) => void;
  wicketKeeper: string | null;
  setWicketKeeper: (value: string | null) => void;
  getPlayerFullName: (player: any) => string;
}

const TeamDetailsForm: React.FC<TeamDetailsFormProps> = ({
  team,
  setTeam,
  players,
  captain,
  setCaptain,
  viceCaptain,
  setViceCaptain,
  wicketKeeper,
  setWicketKeeper,
  getPlayerFullName
}) => {
  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default TeamDetailsForm;
