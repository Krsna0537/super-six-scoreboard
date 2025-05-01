
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getPlayerInitials, getPlayerFullName } from '@/utils/playerUtils';
import { Player } from '@/types/team';

interface SelectPlayersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allPlayers: Player[];
  selectedPlayers: string[];
  handlePlayerSelect: (playerId: string) => void;
}

const SelectPlayersDialog: React.FC<SelectPlayersDialogProps> = ({
  open,
  onOpenChange,
  allPlayers,
  selectedPlayers,
  handlePlayerSelect
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
  );
};

export default SelectPlayersDialog;
