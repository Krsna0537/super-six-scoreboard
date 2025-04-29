
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from '@/contexts/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Loader, Plus, Calendar, Users, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const AdminDashboard = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  // Fetch profile data to check role
  const { data: profile, isLoading: loadingProfile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Redirect if not admin
  useEffect(() => {
    if (profile && profile.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [profile, navigate]);

  // Get counts for dashboard cards
  const { data: counts, isLoading: loadingCounts } = useQuery({
    queryKey: ['admin-counts'],
    queryFn: async () => {
      const [tournaments, teams, players, matches] = await Promise.all([
        supabase.from('tournaments').select('id', { count: 'exact', head: true }),
        supabase.from('teams').select('id', { count: 'exact', head: true }),
        supabase.from('players').select('id', { count: 'exact', head: true }),
        supabase.from('matches').select('id', { count: 'exact', head: true }),
      ]);
      
      return {
        tournaments: tournaments.count || 0,
        teams: teams.count || 0,
        players: players.count || 0,
        matches: matches.count || 0,
      };
    },
    enabled: !!user?.id,
  });

  if (loadingProfile || loadingCounts) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button 
          onClick={() => navigate('/tournaments/create')}
          className="cricket-button-primary flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Create Tournament
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between items-center">
              <span>Tournaments</span>
              <Calendar className="text-cricket-blue" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{counts?.tournaments || 0}</p>
          </CardContent>
          <CardFooter>
            <button 
              onClick={() => navigate('/tournaments')}
              className="text-cricket-blue hover:underline text-sm"
            >
              View all tournaments
            </button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between items-center">
              <span>Teams</span>
              <Shield className="text-cricket-blue" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{counts?.teams || 0}</p>
          </CardContent>
          <CardFooter>
            <button 
              onClick={() => navigate('/teams')}
              className="text-cricket-blue hover:underline text-sm"
            >
              Manage teams
            </button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between items-center">
              <span>Players</span>
              <Users className="text-cricket-blue" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{counts?.players || 0}</p>
          </CardContent>
          <CardFooter>
            <button 
              onClick={() => navigate('/players')}
              className="text-cricket-blue hover:underline text-sm"
            >
              Manage players
            </button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between items-center">
              <span>Matches</span>
              <Calendar className="text-cricket-blue" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{counts?.matches || 0}</p>
          </CardContent>
          <CardFooter>
            <button 
              onClick={() => navigate('/matches')}
              className="text-cricket-blue hover:underline text-sm"
            >
              Schedule & manage
            </button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Matches</CardTitle>
            <CardDescription>Recent and upcoming matches</CardDescription>
          </CardHeader>
          <CardContent>
            <p>View and manage recent matches</p>
            {/* We'll implement the match list component here */}
          </CardContent>
          <CardFooter>
            <button 
              onClick={() => navigate('/matches/create')}
              className="cricket-button-primary"
            >
              Schedule New Match
            </button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administration tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4">
            <button 
              onClick={() => navigate('/teams/create')}
              className="cricket-button-secondary"
            >
              Register New Team
            </button>
            <button 
              onClick={() => navigate('/players/create')}
              className="cricket-button-secondary"
            >
              Add New Player
            </button>
            <button 
              onClick={() => navigate('/officials/manage')}
              className="cricket-button-secondary"
            >
              Manage Officials
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
