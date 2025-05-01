
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Users } from 'lucide-react';
import { Player } from '@/types/team';
import { getPlayerInitials, getPlayerFullName } from '@/utils/playerUtils';

interface PlayersListProps {
  players: Player[];
  captain: string | null;
  viceCaptain: string | null;
  wicketKeeper: string | null;
  setIsSelectPlayersOpen: (open: boolean) => void;
}

const PlayersList: React.FC<PlayersListProps> = ({
  players,
  captain,
  viceCaptain,
  wicketKeeper,
  setIsSelectPlayersOpen
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Current Players</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={() => setIsSelectPlayersOpen(true)}>
              <Users className="mr-2 h-4 w-4" />
              Select Players
            </Button>
          </DialogTrigger>
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
    </div>
  );
};

export default PlayersList;
