import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader, Plus, MoreVertical, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreatePlayerDialog from "@/components/players/CreatePlayerDialog";
import useUserRole from "@/hooks/useUserRole";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Players = () => {
  const { isAdmin } = useUserRole();
  const [deletingPlayer, setDeletingPlayer] = useState<string | null>(null);
  const [editingPlayer, setEditingPlayer] = useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { data: players, isLoading, refetch } = useQuery({
    queryKey: ["players"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("players")
        .select("id, first_name, last_name, image_url, jersey_number, batting_style, bowling_style, player_type, about")
        .order('id');
      if (error) throw error;
      return data;
    },
  });

  const handlePlayerCreated = () => {
    refetch();
  };

  const handleDeletePlayer = async (playerId: string) => {
    setDeletingPlayer(playerId);
    try {
      const { error } = await supabase.from('players').delete().eq('id', playerId);
      if (error) throw error;
      refetch();
    } catch (error: any) {
      alert('Failed to delete player: ' + error.message);
    } finally {
      setDeletingPlayer(null);
    }
  };

  const handleEditPlayer = (player: any) => {
    setEditingPlayer(player);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlayer) return;
    try {
      const { error } = await supabase.from('players').update({
        first_name: editingPlayer.first_name,
        last_name: editingPlayer.last_name,
        image_url: editingPlayer.image_url,
        jersey_number: editingPlayer.jersey_number,
        batting_style: editingPlayer.batting_style,
        bowling_style: editingPlayer.bowling_style,
        player_type: editingPlayer.player_type,
        about: editingPlayer.about,
      }).eq('id', editingPlayer.id);
      if (error) throw error;
      setEditDialogOpen(false);
      setEditingPlayer(null);
      refetch();
    } catch (error: any) {
      alert('Failed to update player: ' + error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Players</h1>
        {isAdmin && <CreatePlayerDialog onPlayerCreated={handlePlayerCreated} />}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {players?.map((player) => (
          <div
            key={player.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition relative flex flex-col items-center p-4"
          >
            {isAdmin && (
              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleEditPlayer(player)}
                      className="flex items-center gap-2"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit Player
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this player? This action cannot be undone.')) {
                          handleDeletePlayer(player.id);
                        }
                      }}
                      className="flex items-center gap-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                      disabled={deletingPlayer === player.id}
                    >
                      {deletingPlayer === player.id ? (
                        <Loader className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      Delete Player
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            <img
              src={player.image_url || '/default-avatar.png'}
              alt={`${player.first_name} ${player.last_name}`}
              className="w-24 h-24 rounded-full object-cover mb-4 border"
            />
            <h2 className="text-xl font-semibold mb-2 text-center">
              {player.first_name} {player.last_name}
            </h2>
            {player.jersey_number && (
              <p className="text-gray-600 mb-2">Jersey: #{player.jersey_number}</p>
            )}
            {player.batting_style && (
              <p className="text-gray-600">Batting: {player.batting_style}</p>
            )}
            {player.bowling_style && (
              <p className="text-gray-600">Bowling: {player.bowling_style}</p>
            )}
            {player.about && (
              <p className="text-gray-500 text-sm mt-2 text-center">{player.about}</p>
            )}
          </div>
        ))}
      </div>

      {/* Edit Player Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Player</DialogTitle>
          </DialogHeader>
          {editingPlayer && (
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="flex flex-col items-center gap-4">
                <img
                  src={editingPlayer.image_url || '/default-avatar.png'}
                  alt="Player Avatar"
                  className="w-24 h-24 rounded-full object-cover border"
                />
                <div className="w-full">
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    type="url"
                    value={editingPlayer.image_url || ''}
                    onChange={e => setEditingPlayer({ ...editingPlayer, image_url: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={editingPlayer.first_name || ''}
                    onChange={e => setEditingPlayer({ ...editingPlayer, first_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={editingPlayer.last_name || ''}
                    onChange={e => setEditingPlayer({ ...editingPlayer, last_name: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="about">About / Description</Label>
                <Textarea
                  id="about"
                  value={editingPlayer.about || ''}
                  onChange={e => setEditingPlayer({ ...editingPlayer, about: e.target.value })}
                  placeholder="Describe the player..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jersey_number">Jersey Number</Label>
                  <Input
                    id="jersey_number"
                    type="number"
                    value={editingPlayer.jersey_number || ''}
                    onChange={e => setEditingPlayer({ ...editingPlayer, jersey_number: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="player_type">Player Type</Label>
                  <Input
                    id="player_type"
                    value={editingPlayer.player_type || ''}
                    onChange={e => setEditingPlayer({ ...editingPlayer, player_type: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="batting_style">Batting Style</Label>
                  <Input
                    id="batting_style"
                    value={editingPlayer.batting_style || ''}
                    onChange={e => setEditingPlayer({ ...editingPlayer, batting_style: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bowling_style">Bowling Style</Label>
                  <Input
                    id="bowling_style"
                    value={editingPlayer.bowling_style || ''}
                    onChange={e => setEditingPlayer({ ...editingPlayer, bowling_style: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Players;
