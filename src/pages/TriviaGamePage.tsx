
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Gamepad2, 
  Clock, 
  Trophy, 
  Star, 
  Coins, 
  Target,
  Users,
  TrendingUp,
  Play,
  Crown,
  Zap
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import GameLobby from '@/components/game/GameLobby';
import TriviaQuestion from '@/components/game/TriviaQuestion';
import GameLeaderboard from '@/components/game/GameLeaderboard';
import GameWallet from '@/components/game/GameWallet';
import GameSubscription from '@/components/game/GameSubscription';
import HouseAnalytics from '@/components/game/HouseAnalytics';

const TriviaGamePage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('lobby');
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'finished'>('waiting');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [gameConfig, setGameConfig] = useState({ entryFee: 0, maxWinnings: 0 });
  const [playerStats, setPlayerStats] = useState({
    balance: 500,
    points: 0,
    gamesPlayed: 12,
    winRate: 75,
    totalEarnings: 2340,
    currentStreak: 3
  });

  const [nextGameTime] = useState(() => {
    const next = new Date();
    next.setHours(15, 52, 0, 0);
    if (next < new Date()) {
      next.setDate(next.getDate() + 1);
    }
    return next;
  });

  const [timeUntilGame, setTimeUntilGame] = useState('');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = nextGameTime.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeUntilGame('Game Starting Soon!');
        return;
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeUntilGame(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [nextGameTime]);

  const handleGameStart = (category: string) => {
    // Define category configurations
    const categoryConfigs = {
      finance: { entryFee: 20, maxWinnings: 80 },
      business: { entryFee: 50, maxWinnings: 200 },
      technology: { entryFee: 15, maxWinnings: 60 },
      general: { entryFee: 10, maxWinnings: 35 },
      premium: { entryFee: 100, maxWinnings: 350 }
    };
    
    const config = categoryConfigs[category as keyof typeof categoryConfigs] || categoryConfigs.general;
    
    // Deduct entry fee
    setPlayerStats(prev => ({ ...prev, balance: prev.balance - config.entryFee }));
    setSelectedCategory(category);
    setGameConfig(config);
    
    toast({
      title: "Game Starting!",
      description: `Get ready for ${category} trivia! Entry fee: KSh ${config.entryFee}`,
    });
    setGameState('playing');
    setActiveTab('game');
  };

  const handleGameEnd = (score: number, earnings: number) => {
    setPlayerStats(prev => ({
      ...prev,
      points: prev.points + score,
      balance: prev.balance + earnings,
      gamesPlayed: prev.gamesPlayed + 1,
      totalEarnings: prev.totalEarnings + earnings
    }));
    setGameState('finished');
    toast({
      title: "Game Complete!",
      description: `You earned ${score} points and KSh ${earnings}!`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
            Investment Trivia & Win
          </h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            Learn finance while earning real money through trivia challenges
          </p>
          <div className="flex items-center gap-4 mt-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Next Game: {timeUntilGame}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              234 Players Online
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Balance</CardTitle>
              <Coins className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">KSh {playerStats.balance}</div>
              <p className="text-xs text-green-600">Available funds</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Points</CardTitle>
              <Star className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">{playerStats.points.toLocaleString()}</div>
              <p className="text-xs text-blue-600">Game points</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Games Played</CardTitle>
              <Gamepad2 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">{playerStats.gamesPlayed}</div>
              <p className="text-xs text-purple-600">Total games</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
              <Trophy className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700">{playerStats.winRate}%</div>
              <p className="text-xs text-orange-600">Success rate</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-teal-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <TrendingUp className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-700">KSh {playerStats.totalEarnings}</div>
              <p className="text-xs text-teal-600">All time</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-50 to-pink-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Streak</CardTitle>
              <Crown className="h-4 w-4 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-700">{playerStats.currentStreak}</div>
              <p className="text-xs text-pink-600">Win streak</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 bg-white/50 backdrop-blur-sm mb-6">
            <TabsTrigger value="lobby" className="flex items-center gap-1">
              <Play className="h-3 w-3" />
              <span className="hidden sm:inline">Game Lobby</span>
            </TabsTrigger>
            <TabsTrigger value="game" className="flex items-center gap-1" disabled={gameState === 'waiting'}>
              <Target className="h-3 w-3" />
              <span className="hidden sm:inline">Play</span>
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-1">
              <Trophy className="h-3 w-3" />
              <span className="hidden sm:inline">Leaderboard</span>
            </TabsTrigger>
            <TabsTrigger value="wallet" className="flex items-center gap-1">
              <Coins className="h-3 w-3" />
              <span className="hidden sm:inline">Wallet</span>
            </TabsTrigger>
            <TabsTrigger value="premium" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              <span className="hidden sm:inline">Premium</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lobby">
            <GameLobby 
              nextGameTime={nextGameTime}
              onGameStart={handleGameStart}
              playerBalance={playerStats.balance}
            />
          </TabsContent>

          <TabsContent value="game">
            <TriviaQuestion 
              gameState={gameState}
              onGameEnd={handleGameEnd}
              playerBalance={playerStats.balance}
              category={selectedCategory}
              entryFee={gameConfig.entryFee}
              maxWinnings={gameConfig.maxWinnings}
            />
          </TabsContent>

          <TabsContent value="leaderboard">
            <GameLeaderboard />
          </TabsContent>

          <TabsContent value="wallet">
            <GameWallet 
              balance={playerStats.balance}
              points={playerStats.points}
              onBalanceUpdate={(newBalance) => setPlayerStats(prev => ({ ...prev, balance: newBalance }))}
            />
          </TabsContent>

          <TabsContent value="premium">
            <GameSubscription 
              currentBalance={playerStats.balance}
              onSubscribe={(cost) => {
                setPlayerStats(prev => ({ ...prev, balance: prev.balance - cost }));
                toast({
                  title: "Premium Activated!",
                  description: "You can now earn double points in games!",
                });
              }}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <HouseAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TriviaGamePage;
