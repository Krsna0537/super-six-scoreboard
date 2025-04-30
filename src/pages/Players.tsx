
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreatePlayerDialog from "@/components/players/CreatePlayerDialog";
import useUserRole from "@/hooks/useUserRole";

const Players = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { isAdmin } = useUserRole();
  
  const { data: players, isLoading, refetch } = useQuery({
    queryKey: ["players"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("players")
        .select(`
          *,
          profile:profiles(*),
          team:teams(*)
        `);
      
      if (error) throw error;
      return data;
    },
  });

  const handlePlayerCreated = () => {
    refetch();
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
        {isAdmin && (
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="cricket-button-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Create Player
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {players?.map((player) => (
          <div key={player.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">
                {player.profile?.first_name} {player.profile?.last_name}
              </h2>
              {player.team && (
                <p className="text-gray-600 mb-2">Team: {player.team.name}</p>
              )}
              {player.jersey_number && (
                <p className="text-gray-600 mb-2">Jersey: #{player.jersey_number}</p>
              )}
              {player.batting_style && (
                <p className="text-gray-600">Batting: {player.batting_style}</p>
              )}
              {player.bowling_style && (
                <p className="text-gray-600">Bowling: {player.bowling_style}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {isAdmin && (
        <CreatePlayerDialog 
          open={isCreateDialogOpen} 
          onOpenChange={setIsCreateDialogOpen}
          onPlayerCreated={handlePlayerCreated}
        />
      )}
    </div>
  );
};

export default Players;
