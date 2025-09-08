import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy, Clock, Users, Zap, Pause, StopCircle } from "lucide-react";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useEventStatus } from "@/hooks/useEventStatus";
import { Skeleton } from "@/components/ui/skeleton";

const Leaderboard = () => {
  const { leaderboard, loading, formatTime } = useLeaderboard();
  const { status: eventStatus, allowPlayAccess } = useEventStatus();

  const getRankDisplay = (rank: number) => {
    if (rank === 1) return { icon: "🥇", color: "text-primary" };
    if (rank === 2) return { icon: "🥈", color: "text-accent" };
    if (rank === 3) return { icon: "🥉", color: "text-muted-foreground" };
    return { icon: rank.toString(), color: "text-muted-foreground" };
  };

  const totalParticipants = leaderboard.length;
  const maxChallengesSolved = Math.max(0, ...leaderboard.map(p => p.challenges_solved));
  const bestTime = leaderboard.find(p => p.challenges_solved === maxChallengesSolved)?.total_time_seconds;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-primary/20 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm" className="btn-cyber">
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Devs@PSU Logo" className="w-8 h-8" />
              <h1 className="text-2xl font-bold text-gradient-cyber">Live Leaderboard</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button asChild className="btn-neon">
              <Link to="/play">Join Competition</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <Card className="card-cyber">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  {loading ? (
                    <Skeleton className="h-8 w-16 mb-1" />
                  ) : (
                    <p className="text-2xl font-bold text-primary">{totalParticipants}</p>
                  )}
                  <p className="text-sm text-muted-foreground">Total Participants</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-cyber">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <div>
                  {loading ? (
                    <Skeleton className="h-8 w-8 mb-1" />
                  ) : (
                    <p className="text-2xl font-bold text-accent">{maxChallengesSolved}</p>
                  )}
                  <p className="text-sm text-muted-foreground">Max Challenges Solved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-cyber">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  {loading ? (
                    <Skeleton className="h-8 w-16 mb-1" />
                  ) : (
                    <p className="text-2xl font-bold text-primary font-mono">
                      {bestTime ? formatTime(bestTime) : "—"}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">Best Time ({maxChallengesSolved} solved)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard Table */}
        <Card className="card-cyber">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              <span className="text-gradient-cyber">Live Rankings</span>
              <Badge variant="outline" className="ml-auto text-primary border-primary/50 animate-pulse-cyber">
                Live
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-primary/20">
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Participant</TableHead>
                  <TableHead className="text-center">Solved</TableHead>
                  <TableHead className="text-center">Points</TableHead>
                  <TableHead className="text-center">Total Time</TableHead>
                  <TableHead className="text-center">Last Solve</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  // Loading skeleton
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index} className="border-primary/10">
                      <TableCell><Skeleton className="h-6 w-8" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                      <TableCell className="text-center"><Skeleton className="h-6 w-12 mx-auto" /></TableCell>
                      <TableCell className="text-center"><Skeleton className="h-6 w-16 mx-auto" /></TableCell>
                      <TableCell className="text-center"><Skeleton className="h-6 w-20 mx-auto" /></TableCell>
                      <TableCell className="text-center"><Skeleton className="h-6 w-24 mx-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : leaderboard.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No participants yet. Be the first to join the competition!
                    </TableCell>
                  </TableRow>
                ) : (
                  leaderboard.map((participant, index) => {
                    const rank = index + 1;
                    const rankDisplay = getRankDisplay(rank);
                    const lastSolveTime = participant.last_solve_at 
                      ? new Date(participant.last_solve_at).toLocaleString()
                      : "Never";
                    
                    return (
                      <TableRow 
                        key={participant.user_id} 
                        className="border-primary/10 hover:bg-primary/5 transition-colors"
                      >
                        <TableCell>
                          <div className={`flex items-center justify-center font-bold ${rankDisplay.color}`}>
                            {rank <= 3 ? (
                              <span className="text-2xl">{rankDisplay.icon}</span>
                            ) : (
                              <span className="text-lg">{rank}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{participant.full_name}</div>
                          <div className="text-xs text-muted-foreground">{participant.email}</div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge 
                            variant="outline" 
                            className="bg-primary/10 text-primary border-primary/30"
                          >
                            {participant.challenges_solved}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center font-mono font-medium">
                          {participant.total_points}
                        </TableCell>
                        <TableCell className="text-center font-mono">
                          {formatTime(participant.total_time_seconds)}
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground text-sm">
                          {lastSolveTime}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Event Status */}
        <Card className="card-cyber mt-8">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              {eventStatus === 'live' && (
                <>
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse-cyber"></div>
                  <span className="text-lg font-medium text-primary">Event Live</span>
                </>
              )}
              {eventStatus === 'paused' && (
                <>
                  <Pause className="w-5 h-5 text-accent" />
                  <span className="text-lg font-medium text-accent">Event Paused</span>
                </>
              )}
              {eventStatus === 'ended' && (
                <>
                  <StopCircle className="w-5 h-5 text-muted-foreground" />
                  <span className="text-lg font-medium text-muted-foreground">Event Ended</span>
                </>
              )}
              {eventStatus === 'not_started' && (
                <>
                  <Clock className="w-5 h-5 text-accent" />
                  <span className="text-lg font-medium text-accent">Event Not Started</span>
                </>
              )}
            </div>
            <p className="text-muted-foreground mb-4">
              {eventStatus === 'live' && 'Competition is currently active. Rankings update in real-time as participants solve challenges.'}
              {eventStatus === 'paused' && 'Competition is temporarily paused. Rankings show current standings.'}
              {eventStatus === 'ended' && 'Competition has ended. These are the final rankings.'}
              {eventStatus === 'not_started' && 'Competition hasn\'t started yet. Check back later!'}
            </p>
            {allowPlayAccess && (
              <Button asChild className="btn-neon">
                <Link to="/play">
                  {eventStatus === 'live' ? 'Join the Competition' : 'View Challenges'}
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;