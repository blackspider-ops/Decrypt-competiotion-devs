import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { ChallengeCard } from "@/components/challenge/ChallengeCard";
import { useChallenges } from "@/hooks/useChallenges";
import { useAuth } from "@/hooks/useAuth";
import { useEventStatus } from "@/hooks/useEventStatus";
import { useEventInfo } from "@/hooks/useEventInfo";
import { ArrowLeft, CheckCircle2, Lock, LogOut, Pause, StopCircle, Clock } from "lucide-react";

const Play = () => {
  const { challenges, progress, loading, isChallengeUnlocked, getChallengeProgress, currentChallenge, refreshTrigger, calculatePoints } = useChallenges();
  const { profile, signOut } = useAuth();
  const { status: eventStatus, allowPlayAccess, loading: statusLoading } = useEventStatus();
  const { title } = useEventInfo();

  const solvedCount = progress.filter(p => p.status === 'solved').length;
  const progressPercentage = challenges.length > 0 ? (solvedCount / challenges.length) * 100 : 0;



  if (loading || statusLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading challenges...</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  // Show access denied if event doesn't allow play access
  if (!allowPlayAccess) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
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
                  <h1 className="text-2xl font-bold text-gradient-cyber">{title.split(' — ')[0] || title}</h1>
                </div>
              </div>
            </div>
          </header>

          <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto text-center">
              <Card className="card-cyber">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center mx-auto mb-4 border border-accent/30">
                    {eventStatus === 'not_started' ? (
                      <Clock className="w-8 h-8 text-accent" />
                    ) : eventStatus === 'ended' ? (
                      <StopCircle className="w-8 h-8 text-muted-foreground" />
                    ) : (
                      <Pause className="w-8 h-8 text-accent" />
                    )}
                  </div>
                  <CardTitle className="text-2xl mb-2">
                    {eventStatus === 'not_started' && 'Event Not Started'}
                    {eventStatus === 'ended' && 'Event Ended'}
                    {eventStatus === 'paused' && 'Event Paused'}
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {eventStatus === 'not_started' && 'The competition hasn\'t started yet. Please check back later!'}
                    {eventStatus === 'ended' && 'The competition has ended. Thank you for participating!'}
                    {eventStatus === 'paused' && 'The competition is temporarily paused. Please wait for further updates.'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center gap-4">
                    <Button asChild className="btn-neon">
                      <Link to="/">Return Home</Link>
                    </Button>
                    <Button asChild variant="outline" className="btn-cyber">
                      <Link to="/leaderboard">View Leaderboard</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
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
            <h1 className="text-2xl font-bold text-gradient-cyber">{title.split(' — ')[0] || title}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">
              Welcome, <span className="text-primary">{profile?.full_name}</span>
            </span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.location.href = '/me'}
            >
              My Profile
            </Button>
            <Button asChild variant="outline" size="sm" className="btn-cyber">
              <Link to="/leaderboard">Leaderboard</Link>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="btn-cyber"
              onClick={signOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress and Timer */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Progress</h2>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Challenges Progress</div>
                  <div className="font-medium">
                    {solvedCount} of {challenges.length} completed
                  </div>
                </div>
              </div>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>

          {/* Challenge Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-4">
              {challenges.map((_, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    index < (currentChallenge?.order_index || 1) - 1 
                      ? 'bg-primary border-primary text-background' 
                      : index === (currentChallenge?.order_index || 1) - 1 
                        ? 'border-primary text-primary bg-primary/10' 
                        : 'border-muted text-muted-foreground'
                  }`}>
                    {index < (currentChallenge?.order_index || 1) - 1 ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : index === (currentChallenge?.order_index || 1) - 1 ? (
                      <span className="text-sm font-bold">{index + 1}</span>
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                  </div>
                  {index < challenges.length - 1 && (
                    <div className={`w-12 h-0.5 mx-2 ${
                      index < (currentChallenge?.order_index || 1) - 1 ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Challenges */}
          <div className="space-y-6">
            {challenges.map((challenge, index) => {
              const challengeProgress = getChallengeProgress(challenge.id);
              const isUnlocked = isChallengeUnlocked(challenge);
              const isActive = isUnlocked && challengeProgress?.status !== 'solved';
              const totalHintsUsed = progress.reduce((total, p) => total + (p.hints_used || 0), 0);
              
              return (
                <ChallengeCard
                  key={`${challenge.id}-${refreshTrigger}`}
                  challenge={challenge}
                  progress={challengeProgress}
                  isUnlocked={isUnlocked}
                  isActive={isActive}
                  totalHintsUsed={totalHintsUsed}
                />
              );
            })}
          </div>

          {/* Completed State */}
          {solvedCount === challenges.length && challenges.length > 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">🎉</div>
              <h2 className="text-3xl font-bold text-gradient-cyber mb-4">
                Congratulations!
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                You've completed all {challenges.length} challenges!
              </p>
              <Button asChild className="btn-neon">
                <Link to="/leaderboard">View Final Leaderboard</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
    </AuthGuard>
  );
};

export default Play;