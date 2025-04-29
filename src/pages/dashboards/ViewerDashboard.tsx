
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from '@/contexts/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Loader } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Notification } from '@/types/notification';

const ViewerDashboard = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  // Fetch live matches
  const { data: liveMatches, isLoading: loadingMatches } = useQuery({
    queryKey: ['live-matches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          id,
          match_date,
          status,
          venue,
          team1:teams!team1_id(*),
          team2:teams!team2_id(*),
          match_scores(*)
        `)
        .eq('status', 'live')
        .order('match_date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 15000, // Refetch every 15 seconds for live updates
  });

  // Fetch recent notifications
  const { data: notifications, isLoading: loadingNotifications } = useQuery({
    queryKey: ['recent-notifications'],
    queryFn: async () => {
      // Use the edge function to get notifications
      const response = await supabase.functions.invoke('get_notifications_with_matches', {
        method: 'GET'
      });
      
      if (response.error) throw response.error;
      // We'll limit the notifications on the client side
      return (response.data as Notification[]).slice(0, 10);
    },
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  // Fetch upcoming tournaments
  const { data: upcomingTournaments, isLoading: loadingTournaments } = useQuery({
    queryKey: ['upcoming-tournaments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .eq('status', 'upcoming')
        .order('start_date', { ascending: true })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
  });

  if (loadingMatches || loadingNotifications || loadingTournaments) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Cricket Dashboard</h1>
      </div>

      {liveMatches && liveMatches.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Live Matches</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {liveMatches.map((match) => (
              <Card key={match.id} className="border-l-4 border-l-cricket-blue">
                <CardHeader className="pb-2">
                  <CardTitle>{match.team1.name} vs {match.team2.name}</CardTitle>
                  <CardDescription>{match.venue} • {new Date(match.match_date).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  {match.match_scores && match.match_scores.length > 0 ? (
                    <div className="space-y-2">
                      {match.match_scores.map((score) => (
                        <div key={score.id} className="flex justify-between">
                          <span>{score.team_id === match.team1.id ? match.team1.name : match.team2.name}</span>
                          <span className="font-bold">{score.runs}/{score.wickets} ({score.overs} overs)</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>Match in progress. Scoring not yet started.</p>
                  )}
                </CardContent>
                <CardFooter>
                  <button 
                    onClick={() => navigate(`/matches/${match.id}/live`)}
                    className="text-cricket-blue hover:underline text-sm"
                  >
                    View live scorecard
                  </button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Upcoming Tournaments</CardTitle>
              <CardDescription>Check out the upcoming tournaments</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingTournaments && upcomingTournaments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingTournaments.map((tournament) => (
                    <div key={tournament.id} className="flex justify-between items-center p-3 border-b last:border-b-0">
                      <div>
                        <h4 className="font-semibold text-lg">{tournament.name}</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(tournament.start_date).toLocaleDateString()} to {new Date(tournament.end_date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">{tournament.location}</p>
                      </div>
                      <button 
                        onClick={() => navigate(`/tournaments/${tournament.id}`)}
                        className="text-cricket-blue hover:underline"
                      >
                        Details
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No upcoming tournaments at the moment.</p>
              )}
            </CardContent>
            <CardFooter>
              <button 
                onClick={() => navigate('/tournaments')}
                className="cricket-button-secondary"
              >
                View All Tournaments
              </button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Live Updates</CardTitle>
              <CardDescription>Latest happenings in matches</CardDescription>
            </CardHeader>
            <CardContent className="max-h-96 overflow-y-auto">
              {notifications && notifications.length > 0 ? (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-3 border-l-4 border-cricket-blue bg-gray-50 rounded shadow-sm">
                      <p className="text-sm text-gray-500">
                        {notification.matches ? 
                          `${notification.matches.team1.name} vs ${notification.matches.team2.name}` : 
                          'Match Update'}
                      </p>
                      <p className="font-medium">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No recent updates.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewerDashboard;
