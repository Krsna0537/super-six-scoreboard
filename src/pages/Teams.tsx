import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader, Plus, MoreVertical, Trash2, Edit2, Users, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateTeamDialog from "@/components/teams/CreateTeamDialog";
import useUserRole from "@/hooks/useUserRole";
import { useNavigate } from "react-router-dom";
import ManageTeamPlayersDialog from '@/components/teams/ManageTeamPlayersDialog';

const Teams = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { isAdmin } = useUserRole();
  const navigate = useNavigate();
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [deletingTeam, setDeletingTeam] = useState<string | null>(null);
  
  const { data: teams, isLoading, refetch } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  const handleTeamCreated = () => {
    refetch();
  };

  const handleDeleteTeam = async (teamId: string) => {
    setDeletingTeam(teamId);
    try {
      // First remove all players from the team
      await supabase.from('players').update({ team_id: null }).eq('team_id', teamId);
      
      // Remove team from any tournaments
      await supabase.from('tournament_teams').delete().eq('team_id', teamId);
      
      // Remove any match scores for this team
      await supabase.from('match_scores').delete().eq('team_id', teamId);
      
      // Remove any matches where this team is team1 or team2
      await supabase.from('matches').delete().or(`team1_id.eq.${teamId},team2_id.eq.${teamId}`);
      
      // Finally delete the team
      const { error } = await supabase.from('teams').delete().eq('id', teamId);
      
      if (error) throw error;
      
      refetch();
    } catch (error: any) {
      alert('Failed to delete team: ' + error.message);
    } finally {
      setDeletingTeam(null);
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
        <h1 className="text-3xl font-bold">Teams</h1>
        {isAdmin && (
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="cricket-button-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Create Team
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {teams?.map((team) => (
          <div
            key={team.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition relative"
          >
            <div className="p-4">
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
                        onClick={() => navigate(`/teams/${team.id}/edit`)}
                        className="flex items-center gap-2"
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit Team
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
                            handleDeleteTeam(team.id);
                          }
                        }}
                        className="flex items-center gap-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                        disabled={deletingTeam === team.id}
                      >
                        {deletingTeam === team.id ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        Delete Team
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              <div className="flex flex-col items-center">
                <img
                  src={team.logo_url || "https://placehold.co/100/0EA5E9/FFFFFF?text=Team"}
                  alt={team.name}
                  className="w-24 h-24 mb-4 rounded-full"
                />
                <h2 className="text-xl font-semibold text-center mb-2">{team.name}</h2>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isAdmin && (
        <>
          <CreateTeamDialog 
            open={isCreateDialogOpen} 
            onOpenChange={setIsCreateDialogOpen}
            onTeamCreated={handleTeamCreated}
          />
          {selectedTeam && (
            <ManageTeamPlayersDialog
              open={!!selectedTeam}
              onOpenChange={(open) => { if (!open) setSelectedTeam(null); }}
              team={selectedTeam}
              onTeamUpdated={refetch}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Teams;
