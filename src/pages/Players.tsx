
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader } from "lucide-react";

const Players = () => {
  const { data: players, isLoading } = useQuery({
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Players</h1>
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
    </div>
  );
};

export default Players;
