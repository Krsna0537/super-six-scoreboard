import { useEffect, useState } from 'react';
import { useCricketAPI } from '../hooks/useCricketAPI';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { MatchDetails } from './MatchDetails';

interface Match {
  id: string;
  name: string;
  status: string;
  teams: {
    home: string;
    away: string;
  };
  score?: string;
}

export function LiveMatches() {
  const { sportmonks, cricapi } = useCricketAPI();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        // Fetch matches from both APIs
        const [sportmonksMatches, cricapiMatches] = await Promise.all([
          sportmonks.getLiveMatches(),
          cricapi.getLiveMatches(),
        ]);

        // Combine and transform the data
        const combinedMatches = [
          ...(sportmonksMatches.data || []).map((match: any) => ({
            id: match.id,
            name: match.name,
            status: match.status,
            teams: {
              home: match.teams.home.name,
              away: match.teams.away.name,
            },
          })),
          ...(cricapiMatches.matches || []).map((match: any) => ({
            id: match.unique_id,
            name: match.description,
            status: match.matchStarted ? 'In Progress' : 'Not Started',
            teams: {
              home: match['team-1'],
              away: match['team-2'],
            },
          })),
        ];

        // Remove duplicates based on match name
        const uniqueMatches = combinedMatches.filter(
          (match, index, self) =>
            index === self.findIndex((m) => m.name === match.name)
        );

        setMatches(uniqueMatches);
      } catch (err) {
        setError('Failed to fetch matches. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
    // Refresh every 30 seconds
    const interval = setInterval(fetchMatches, 30000);
    return () => clearInterval(interval);
  }, [sportmonks, cricapi]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-[250px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-[200px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        <p>No live matches available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {matches.map((match) => (
        <Dialog key={match.id}>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:bg-accent transition-colors">
              <CardHeader>
                <CardTitle className="text-lg">{match.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {match.teams.home} vs {match.teams.away}
                  </p>
                  <p className="text-sm font-medium">
                    Status: {match.status}
                  </p>
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <MatchDetails matchId={match.id} />
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
} 