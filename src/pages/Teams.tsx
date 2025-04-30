
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateTeamDialog from "@/components/teams/CreateTeamDialog";
import useUserRole from "@/hooks/useUserRole";
import { useNavigate } from "react-router-dom";

const Teams = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { isAdmin } = useUserRole();
  const navigate = useNavigate();
  
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
          <div key={team.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <img
                src={team.logo_url || "https://placehold.co/100/0EA5E9/FFFFFF?text=Team"}
                alt={team.name}
                className="w-24 h-24 mx-auto mb-4 rounded-full"
              />
              <h2 className="text-xl font-semibold text-center mb-2">{team.name}</h2>
            </div>
          </div>
        ))}
      </div>

      {isAdmin && (
        <CreateTeamDialog 
          open={isCreateDialogOpen} 
          onOpenChange={setIsCreateDialogOpen}
          onTeamCreated={handleTeamCreated}
        />
      )}
    </div>
  );
};

export default Teams;
