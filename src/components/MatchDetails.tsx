import { useEffect, useState } from 'react';
import { useCricketAPI } from '../hooks/useCricketAPI';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface MatchScore {
  team: string;
  inning: string;
  score: string;
  wickets: number;
  overs: string;
}

interface DetailedMatch {
  id: string;
  name: string;
  status: string;
  venue: string;
  date: string;
  teams: {
    home: {
      name: string;
      score?: MatchScore;
    };
    away: {
      name: string;
      score?: MatchScore;
    };
  };
  toss?: {
    winner: string;
    decision: string;
  };
  scorecard?: any;
}

export function MatchDetails({ matchId }: { matchId: string }) {
  const { sportmonks, cricapi } = useCricketAPI();
  const [match, setMatch] = useState<DetailedMatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        setLoading(true);
        // Try SportMonks API first
        const sportmonksData = await sportmonks.getMatchDetails(matchId);
        const scorecardData = await sportmonks.getMatchScorecard(matchId);

        // If SportMonks data is available, use it
        if (sportmonksData.data) {
          const matchData = sportmonksData.data;
          setMatch({
            id: matchData.id,
            name: matchData.name,
            status: matchData.status,
            venue: matchData.venue?.name || 'TBD',
            date: new Date(matchData.starting_at).toLocaleDateString(),
            teams: {
              home: {
                name: matchData.teams.home.name,
                score: scorecardData.data?.innings?.find((i: any) => i.team_id === matchData.teams.home.id),
              },
              away: {
                name: matchData.teams.away.name,
                score: scorecardData.data?.innings?.find((i: any) => i.team_id === matchData.teams.away.id),
              },
            },
            toss: matchData.toss,
            scorecard: scorecardData.data,
          });
        } else {
          // Fallback to CricAPI
          const cricapiData = await cricapi.getMatchScore(matchId);
          if (cricapiData.data) {
            setMatch({
              id: matchId,
              name: cricapiData.data.description,
              status: cricapiData.data.matchStarted ? 'Live' : 'Not Started',
              venue: cricapiData.data.venue || 'TBD',
              date: new Date(cricapiData.data.date).toLocaleDateString(),
              teams: {
                home: {
                  name: cricapiData.data['team-1'],
                  score: cricapiData.data.score?.[0] ? {
                    team: cricapiData.data['team-1'],
                    inning: '1st',
                    score: cricapiData.data.score[0],
                    wickets: 0,
                    overs: '',
                  } : undefined,
                },
                away: {
                  name: cricapiData.data['team-2'],
                  score: cricapiData.data.score?.[1] ? {
                    team: cricapiData.data['team-2'],
                    inning: '1st',
                    score: cricapiData.data.score[1],
                    wickets: 0,
                    overs: '',
                  } : undefined,
                },
              },
            });
          }
        }
      } catch (err) {
        setError('Failed to fetch match details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchDetails();
    // Refresh every minute for live matches
    const interval = setInterval(fetchMatchDetails, 60000);
    return () => clearInterval(interval);
  }, [matchId, sportmonks, cricapi]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-[250px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[180px]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !match) {
    return (
      <Card>
        <CardContent className="text-center text-red-500 py-4">
          {error || 'Match details not found'}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{match.name}</span>
          <Badge variant={match.status === 'Live' ? 'destructive' : 'secondary'}>
            {match.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary">
          <TabsList className="mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="scorecard">Scorecard</TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Match Info</h3>
                <p className="text-sm text-muted-foreground">Venue: {match.venue}</p>
                <p className="text-sm text-muted-foreground">Date: {match.date}</p>
                {match.toss && (
                  <p className="text-sm text-muted-foreground">
                    Toss: {match.toss.winner} won and chose to {match.toss.decision}
                  </p>
                )}
              </div>

              <div>
                <h3 className="font-semibold mb-2">Scores</h3>
                <div className="space-y-2">
                  <div>
                    <p className="font-medium">{match.teams.home.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {match.teams.home.score?.score || 'Yet to bat'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">{match.teams.away.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {match.teams.away.score?.score || 'Yet to bat'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scorecard">
            {match.scorecard ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Scorecard data will be displayed here when available
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Scorecard not available for this match
              </p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 