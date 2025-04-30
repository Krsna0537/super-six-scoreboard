import { useEffect, useState } from 'react';
import { useCricketAPI } from '../hooks/useCricketAPI';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

interface PlayerStatistics {
  id: string;
  name: string;
  fullName: string;
  dateOfBirth?: string;
  battingStyle?: string;
  bowlingStyle?: string;
  country?: string;
  stats?: {
    batting?: {
      matches: number;
      innings: number;
      runs: number;
      highestScore: string;
      average: number;
      strikeRate: number;
      hundreds: number;
      fifties: number;
    };
    bowling?: {
      matches: number;
      innings: number;
      wickets: number;
      bestBowling: string;
      average: number;
      economy: number;
      fiveWickets: number;
    };
  };
}

export function PlayerStats({ playerId }: { playerId: string }) {
  const { cricapi } = useCricketAPI();
  const [player, setPlayer] = useState<PlayerStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayerStats = async () => {
      try {
        setLoading(true);
        const playerData = await cricapi.getPlayerStats(playerId);

        if (playerData.data) {
          setPlayer({
            id: playerId,
            name: playerData.data.name,
            fullName: playerData.data.fullName,
            dateOfBirth: playerData.data.dateOfBirth,
            battingStyle: playerData.data.battingStyle,
            bowlingStyle: playerData.data.bowlingStyle,
            country: playerData.data.country,
            stats: {
              batting: {
                matches: playerData.data.stats?.batting?.matches || 0,
                innings: playerData.data.stats?.batting?.innings || 0,
                runs: playerData.data.stats?.batting?.runs || 0,
                highestScore: playerData.data.stats?.batting?.highestScore || '0',
                average: playerData.data.stats?.batting?.average || 0,
                strikeRate: playerData.data.stats?.batting?.strikeRate || 0,
                hundreds: playerData.data.stats?.batting?.hundreds || 0,
                fifties: playerData.data.stats?.batting?.fifties || 0,
              },
              bowling: {
                matches: playerData.data.stats?.bowling?.matches || 0,
                innings: playerData.data.stats?.bowling?.innings || 0,
                wickets: playerData.data.stats?.bowling?.wickets || 0,
                bestBowling: playerData.data.stats?.bowling?.bestBowling || '0/0',
                average: playerData.data.stats?.bowling?.average || 0,
                economy: playerData.data.stats?.bowling?.economy || 0,
                fiveWickets: playerData.data.stats?.bowling?.fiveWickets || 0,
              },
            },
          });
        }
      } catch (err) {
        setError('Failed to fetch player statistics. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerStats();
  }, [playerId, cricapi]);

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

  if (error || !player) {
    return (
      <Card>
        <CardContent className="text-center text-red-500 py-4">
          {error || 'Player statistics not found'}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{player.name}</CardTitle>
        <div className="text-sm text-muted-foreground">
          <p>Full Name: {player.fullName}</p>
          {player.dateOfBirth && <p>Date of Birth: {player.dateOfBirth}</p>}
          {player.country && <p>Country: {player.country}</p>}
          {player.battingStyle && <p>Batting Style: {player.battingStyle}</p>}
          {player.bowlingStyle && <p>Bowling Style: {player.bowlingStyle}</p>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {player.stats?.batting && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Batting Statistics</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matches</TableHead>
                    <TableHead>Innings</TableHead>
                    <TableHead>Runs</TableHead>
                    <TableHead>Highest</TableHead>
                    <TableHead>Average</TableHead>
                    <TableHead>Strike Rate</TableHead>
                    <TableHead>100s</TableHead>
                    <TableHead>50s</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>{player.stats.batting.matches}</TableCell>
                    <TableCell>{player.stats.batting.innings}</TableCell>
                    <TableCell>{player.stats.batting.runs}</TableCell>
                    <TableCell>{player.stats.batting.highestScore}</TableCell>
                    <TableCell>{player.stats.batting.average.toFixed(2)}</TableCell>
                    <TableCell>{player.stats.batting.strikeRate.toFixed(2)}</TableCell>
                    <TableCell>{player.stats.batting.hundreds}</TableCell>
                    <TableCell>{player.stats.batting.fifties}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}

          {player.stats?.bowling && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Bowling Statistics</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matches</TableHead>
                    <TableHead>Innings</TableHead>
                    <TableHead>Wickets</TableHead>
                    <TableHead>Best</TableHead>
                    <TableHead>Average</TableHead>
                    <TableHead>Economy</TableHead>
                    <TableHead>5W</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>{player.stats.bowling.matches}</TableCell>
                    <TableCell>{player.stats.bowling.innings}</TableCell>
                    <TableCell>{player.stats.bowling.wickets}</TableCell>
                    <TableCell>{player.stats.bowling.bestBowling}</TableCell>
                    <TableCell>{player.stats.bowling.average.toFixed(2)}</TableCell>
                    <TableCell>{player.stats.bowling.economy.toFixed(2)}</TableCell>
                    <TableCell>{player.stats.bowling.fiveWickets}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 