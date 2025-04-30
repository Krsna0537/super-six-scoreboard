import { useEffect, useState } from 'react';
import { useCricketAPI } from '../hooks/useCricketAPI';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';

interface Match {
  id: string;
  name: string;
  date: string;
  teams: {
    home: string;
    away: string;
  };
  result?: string;
}

export function CompletedMatches() {
  const { sportmonks, cricapi } = useCricketAPI();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        // Fetch completed matches from both APIs
        const [sportmonksMatches, cricapiMatches] = await Promise.all([
          sportmonks.getCompletedMatches(),
          cricapi.getCompletedMatches(),
        ]);
        // Combine and transform the data
        const combinedMatches = [
          ...(sportmonksMatches.data || []).map((match: any) => ({
            id: match.id,
            name: match.name,
            date: match.starting_at ? new Date(match.starting_at).toLocaleString() : '',
            teams: {
              home: match.teams.home.name,
              away: match.teams.away.name,
            },
            result: match.result || match.status,
          })),
          ...(cricapiMatches.matches || []).map((match: any) => ({
            id: match.unique_id,
            name: match.description,
            date: match.date || '',
            teams: {
              home: match['team-1'],
              away: match['team-2'],
            },
            result: match['winner_team'] ? `${match['winner_team']} won` : '',
          })),
        ];
        // Remove duplicates based on match name
        const uniqueMatches = combinedMatches.filter(
          (match, index, self) =>
            index === self.findIndex((m) => m.name === match.name)
        );
        setMatches(uniqueMatches);
      } catch (err) {
        setError('Failed to fetch completed matches. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
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
    return <div className="text-center text-red-500">{error}</div>;
  }
  if (matches.length === 0) {
    return <div className="text-center text-muted-foreground">No completed matches available.</div>;
  }
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {matches.map((match) => (
        <Card key={match.id}>
          <CardHeader>
            <CardTitle className="text-lg">{match.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {match.teams.home} vs {match.teams.away}
              </p>
              <p className="text-sm font-medium">Date: {match.date}</p>
              {match.result && <p className="text-sm text-green-600">{match.result}</p>}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 