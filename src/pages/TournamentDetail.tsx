import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import useUserRole from '@/hooks/useUserRole';
import EditTournamentDialog from '@/components/tournaments/EditTournamentDialog';

const TournamentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("overview");
  const [tournament, setTournament] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { isAdmin } = useUserRole();

  useEffect(() => {
    const fetchTournament = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.from('tournaments').select('*').eq('id', id).single();
      if (error) {
        setError('Tournament not found.');
        setTournament(null);
      } else {
        setTournament(data);
      }
      setLoading(false);
    };
    if (id) fetchTournament();
  }, [id]);

  useEffect(() => {
    const fetchMatches = async () => {
      if (!id) return;
      const { data, error } = await supabase.from('matches').select('*').eq('tournament_id', id).order('match_date', { ascending: true });
      if (!error && data) setMatches(data);
    };
    fetchMatches();
  }, [id]);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }
  if (error || !tournament) {
    return <div className="text-center py-12 text-red-500">{error || 'Tournament not found.'}</div>;
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="cricket-container">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="relative h-64 md:h-80">
            <img 
              src={tournament.image || 'https://placehold.co/800x400/0EA5E9/FFFFFF?text=Tournament'}
              alt={tournament.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-6 text-white">
                <div className="mb-2 text-sm font-medium bg-cricket-blue inline-block px-3 py-1 rounded-full">
                  {tournament.format} • {tournament.status}
                </div>
                <h1 className="text-3xl font-bold mb-2">{tournament.name}</h1>
                <div className="flex items-center text-sm">
                  <span className="mr-4">{new Date(tournament.start_date).toLocaleDateString()} - {new Date(tournament.end_date).toLocaleDateString()}</span>
                  <span>{tournament.location}</span>
                </div>
              </div>
            </div>
            {isAdmin && (
              <div className="absolute top-4 right-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit Tournament
                </Button>
              </div>
            )}
          </div>
          <Tabs defaultValue="overview" className="p-6" onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="matches">Matches</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="animate-fade-in overflow-y-auto max-h-[calc(100vh-24rem)]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <h2 className="text-2xl font-bold mb-4">Tournament Details</h2>
                  <p className="text-gray-700 mb-6">{tournament.description || 'No description provided.'}</p>
                  <h3 className="text-xl font-bold mb-3">Tournament Format</h3>
                  <p className="text-gray-700 mb-6">
                    {tournament.format ? `This is a ${tournament.format} format tournament.` : 'Format not specified.'}
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-xl font-bold mb-4">Tournament Info</h2>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Format</h4>
                      <p>{tournament.format}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Dates</h4>
                      <p>{new Date(tournament.start_date).toLocaleDateString()} - {new Date(tournament.end_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Location</h4>
                      <p>{tournament.location}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Status</h4>
                      <p>{tournament.status}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="matches" className="animate-fade-in overflow-y-auto max-h-[calc(100vh-24rem)]">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Team 1</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Team 2</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {matches.length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-6 text-gray-500">No matches scheduled.</td></tr>
                    ) : matches.map((match) => (
                      <tr key={match.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{new Date(match.match_date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{match.team1_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{match.team2_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{match.venue}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{match.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {isAdmin && (
        <EditTournamentDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          tournament={tournament}
          onTournamentUpdated={() => {
            // Refresh tournament data
            const fetchTournament = async () => {
              const { data, error } = await supabase.from('tournaments').select('*').eq('id', id).single();
              if (!error && data) {
                setTournament(data);
              }
            };
            fetchTournament();
          }}
        />
      )}
    </div>
  );
};

export default TournamentDetail;
