import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  PiggyBank, Target, TrendingUp, Calendar, DollarSign, 
  Download, Award, AlertCircle, BarChart3, PieChart, 
  Activity, Zap, Clock, CheckCircle
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, 
  Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  RadialBarChart, RadialBar 
} from 'recharts';
import CurrencyDisplay from '@/components/CurrencyDisplay';

interface SavingsAnalyticsProps {
  walletData: {
    balance: number;
    savingBalance: number;
    totalSavings: number;
    monthlyTarget: number;
    dailyTarget: number;
    currentStreak: number;
  };
  savingsGoals: Array<{
    id: string;
    goal_name: string;
    current_amount: number;
    target_amount: number;
    status: string;
    created_at: string;
    target_date?: string;
  }>;
  transfers: Array<{
    id: string;
    amount: number;
    source_of_funds: string;
    saving_category: string;
    frequency: string;
    created_at: string;
  }>;
}

const SavingsAnalytics: React.FC<SavingsAnalyticsProps> = ({
  walletData,
  savingsGoals,
  transfers
}) => {
  const [timeFilter, setTimeFilter] = useState('6months');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Calculate analytics data
  const completedGoals = savingsGoals.filter(g => g.status === 'completed').length;
  const activeGoals = savingsGoals.filter(g => g.status === 'active').length;
  const netSavings = transfers.reduce((sum, t) => sum + t.amount, 0);

  // Generate savings over time data
  const generateSavingsOverTime = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    return Array.from({ length: 6 }, (_, i) => {
      const monthIndex = (currentMonth - 5 + i + 12) % 12;
      const monthTransfers = transfers.filter(t => {
        const transferMonth = new Date(t.created_at).getMonth();
        return transferMonth === monthIndex;
      });
      
      const totalAmount = monthTransfers.reduce((sum, t) => sum + t.amount, 0);
      const recurringAmount = monthTransfers.filter(t => t.frequency !== 'one_time').reduce((sum, t) => sum + t.amount, 0);
      const oneTimeAmount = monthTransfers.filter(t => t.frequency === 'one_time').reduce((sum, t) => sum + t.amount, 0);
      
      return {
        month: months[monthIndex],
        total: totalAmount,
        recurring: recurringAmount,
        oneTime: oneTimeAmount,
        target: walletData.monthlyTarget
      };
    });
  };

  // Generate source of funds breakdown
  const generateSourceBreakdown = () => {
    const sourceMap = new Map();
    transfers.forEach(t => {
      sourceMap.set(t.source_of_funds, (sourceMap.get(t.source_of_funds) || 0) + t.amount);
    });
    
    const total = Array.from(sourceMap.values()).reduce((sum, val) => sum + val, 0);
    const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];
    
    return Array.from(sourceMap.entries()).map(([source, amount], index) => ({
      name: source,
      value: amount,
      percentage: ((amount / total) * 100).toFixed(1),
      color: colors[index % colors.length]
    }));
  };

  // Performance metrics
  const monthlyDeposits = transfers.filter(t => {
    const now = new Date();
    const transferDate = new Date(t.created_at);
    return transferDate.getMonth() === now.getMonth() && transferDate.getFullYear() === now.getFullYear();
  });
  
  const monthlyTotal = monthlyDeposits.reduce((sum, t) => sum + t.amount, 0);
  const monthlySavingRate = walletData.balance > 0 ? (monthlyTotal / walletData.balance * 100).toFixed(1) : '0';
  const averageDepositSize = transfers.length > 0 ? (netSavings / transfers.length).toFixed(0) : '0';
  
  const lastDepositDate = transfers.length > 0 ? new Date(transfers[0].created_at) : null;
  const daysSinceLastDeposit = lastDepositDate ? 
    Math.floor((new Date().getTime() - lastDepositDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;

  const savingsOverTime = generateSavingsOverTime();
  const sourceBreakdown = generateSourceBreakdown();

  // Smart insights
  const generateInsights = () => {
    const insights = [];
    
    if (walletData.currentStreak > 7) {
      insights.push({
        type: 'success',
        message: `Amazing ${walletData.currentStreak}-day saving streak! You're building excellent habits.`
      });
    }
    
    if (monthlyTotal > walletData.monthlyTarget) {
      const excess = ((monthlyTotal / walletData.monthlyTarget - 1) * 100).toFixed(0);
      insights.push({
        type: 'success',
        message: `You're ${excess}% ahead of your monthly target! Keep up the momentum.`
      });
    }
    
    const upcomingGoals = savingsGoals.filter(g => {
      if (!g.target_date) return false;
      const targetDate = new Date(g.target_date);
      const today = new Date();
      const diffMonths = (targetDate.getFullYear() - today.getFullYear()) * 12 + (targetDate.getMonth() - today.getMonth());
      return diffMonths <= 3 && diffMonths > 0;
    });
    
    upcomingGoals.forEach(goal => {
      const progress = (goal.current_amount / goal.target_amount) * 100;
      if (progress > 80) {
        insights.push({
          type: 'info',
          message: `You're ${progress.toFixed(0)}% towards your ${goal.goal_name} goal! Just KES ${(goal.target_amount - goal.current_amount).toLocaleString()} more to go.`
        });
      }
    });
    
    return insights;
  };

  const insights = generateInsights();

  return (
    <div className="space-y-6">
      {/* Overview Dashboard */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Saved</p>
                <CurrencyDisplay amount={walletData.savingBalance} className="text-2xl font-bold text-green-600" showToggle={false} />
                <p className="text-xs text-green-600">To date</p>
              </div>
              <PiggyBank className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Goals</p>
                <p className="text-2xl font-bold text-blue-600">{activeGoals}</p>
                <p className="text-xs text-blue-600">In progress</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed Goals</p>
                <p className="text-2xl font-bold text-purple-600">{completedGoals}</p>
                <p className="text-xs text-purple-600">Achieved</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Savings</p>
                <CurrencyDisplay amount={netSavings} className="text-2xl font-bold text-orange-600" showToggle={false} />
                <p className="text-xs text-orange-600">All deposits</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="goals">Goal Progress</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Savings Over Time</CardTitle>
                <div className="flex gap-2">
                  <Select value={timeFilter} onValueChange={setTimeFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">7 Days</SelectItem>
                      <SelectItem value="30days">30 Days</SelectItem>
                      <SelectItem value="6months">6 Months</SelectItem>
                      <SelectItem value="1year">1 Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={savingsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="total" 
                      stackId="1" 
                      stroke="#22c55e" 
                      fill="#22c55e" 
                      fillOpacity={0.8}
                      name="Total Saved"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="target" 
                      stroke="#94a3b8" 
                      fill="#94a3b8" 
                      fillOpacity={0.3}
                      name="Target"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <div className="space-y-4">
            {savingsGoals.map((goal) => {
              const progress = (goal.current_amount / goal.target_amount) * 100;
              const averageMonthly = monthlyTotal / new Date().getDate() * 30;
              const monthsToGoal = averageMonthly > 0 ? Math.ceil((goal.target_amount - goal.current_amount) / averageMonthly) : 0;
              
              return (
                <Card key={goal.id}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{goal.goal_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Created {new Date(goal.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={goal.status === 'completed' ? 'default' : 'secondary'}>
                          {goal.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">{progress.toFixed(1)}%</span>
                        </div>
                        <Progress value={progress} className="h-3" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>KES {goal.current_amount.toLocaleString()}</span>
                          <span>KES {goal.target_amount.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      {goal.status === 'active' && averageMonthly > 0 && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm text-blue-700">
                            <Clock className="h-4 w-4 inline mr-1" />
                            Estimated completion: {monthsToGoal} months at current rate
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Deposit Sources</CardTitle>
              </CardHeader>
              <CardContent>
                {sourceBreakdown.length > 0 ? (
                  <>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={sourceBreakdown}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            dataKey="value"
                          >
                            {sourceBreakdown.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-2">
                      {sourceBreakdown.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-sm">{item.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{item.percentage}%</p>
                            <CurrencyDisplay amount={item.value} className="text-xs text-muted-foreground" showToggle={false} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <PieChart className="h-12 w-12 mx-auto mb-4" />
                      <p>No data available</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="text-sm">Monthly Saving Rate</span>
                  <Badge variant="secondary">{monthlySavingRate}%</Badge>
                </div>
                
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="text-sm">Average Deposit Size</span>
                  <CurrencyDisplay amount={parseFloat(averageDepositSize)} className="text-sm font-medium" showToggle={false} />
                </div>
                
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="text-sm">Longest Saving Streak</span>
                  <Badge variant="secondary">{walletData.currentStreak} days</Badge>
                </div>
                
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="text-sm">Days Since Last Deposit</span>
                  <Badge variant={daysSinceLastDeposit <= 7 ? 'default' : 'destructive'}>
                    {daysSinceLastDeposit} days
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Smart Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {insights.length > 0 ? (
                insights.map((insight, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg border ${
                      insight.type === 'success' ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'
                    }`}
                  >
                    <p className={`text-sm ${
                      insight.type === 'success' ? 'text-green-700' : 'text-blue-700'
                    }`}>
                      {insight.message}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4" />
                  <p>Keep saving to unlock personalized insights!</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Achievements & Milestones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {walletData.savingBalance >= 10000 && (
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Award className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium">First KES 10,000 Saved!</p>
                      <p className="text-sm text-muted-foreground">A major milestone achieved</p>
                    </div>
                  </div>
                )}
                
                {completedGoals >= 1 && (
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Target className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Goal Achiever</p>
                      <p className="text-sm text-muted-foreground">{completedGoals} goal{completedGoals > 1 ? 's' : ''} completed</p>
                    </div>
                  </div>
                )}
                
                {walletData.currentStreak >= 30 && (
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Consistency Champion</p>
                      <p className="text-sm text-muted-foreground">30+ day saving streak</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Export & Reporting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF Report
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SavingsAnalytics;