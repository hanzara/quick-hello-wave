
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  PiggyBank, Target, Calendar, DollarSign, TrendingUp, 
  HandCoins, Users, Clock, AlertCircle, Plus, Minus,
  ArrowUpRight, ArrowDownRight, Wallet, Send, Loader2, ArrowRightLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { usePersonalSavings } from '@/hooks/usePersonalSavings';
import TransferToSavingModal from '@/components/savings/TransferToSavingModal';
import SavingsAnalytics from '@/components/savings/SavingsAnalytics';

const PersonalSavingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    walletData, 
    savingsGoals, 
    savingTransfers,
    isLoading, 
    transferToSavingWallet, 
    getSavingsBreakdown, 
    getSavingsData 
  } = usePersonalSavings();
  
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [lendAmount, setLendAmount] = useState('');
  const [borrowerDetails, setBorrowerDetails] = useState('');

  // Mock data for lending (keeping this as mock for now)
  const lendingHistory = [
    { id: 1, borrower: 'John Doe', amount: 5000, status: 'active', dueDate: '2024-02-15', interest: 10 },
    { id: 2, borrower: 'Jane Smith', amount: 8000, status: 'completed', dueDate: '2024-01-20', interest: 12 },
    { id: 3, borrower: 'Mike Johnson', amount: 3000, status: 'overdue', dueDate: '2024-01-30', interest: 15 },
  ];

  // Get real data from hook
  const savingsData = getSavingsData();
  const savingsBreakdown = getSavingsBreakdown();

  const handleTransfer = async (transferData: any) => {
    await transferToSavingWallet(transferData);
  };

  const handleLend = () => {
    if (!lendAmount || !borrowerDetails) {
      toast({
        title: "Error",
        description: "Please fill in all lending details",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Loan Offer Sent",
      description: `Loan offer of KES ${lendAmount} sent to ${borrowerDetails}`,
    });
    setLendAmount('');
    setBorrowerDetails('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
                <PiggyBank className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Personal Savings
                </h1>
                <p className="text-muted-foreground text-lg">
                  Build your wealth through consistent saving and smart lending
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="savings" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="savings">Savings Wallet</TabsTrigger>
              <TabsTrigger value="lending">Peer Lending</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="savings">
              <div className="grid gap-6">
                {/* Wallet Overview */}
                <div className="grid md:grid-cols-4 gap-6">
                  <Card className="relative overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Main Wallet</p>
                          <CurrencyDisplay amount={walletData.balance} className="text-2xl font-bold" showToggle={false} />
                          <p className="text-xs text-blue-600 flex items-center mt-1">
                            <Wallet className="h-3 w-3 mr-1" />
                            Available for transfer
                          </p>
                        </div>
                        <Wallet className="h-8 w-8 text-blue-500" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent" />
                    </CardContent>
                  </Card>

                  <Card className="relative overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Saving Wallet</p>
                          <CurrencyDisplay amount={walletData.savingBalance} className="text-2xl font-bold text-green-600" showToggle={false} />
                          <p className="text-xs text-green-600">Total saved</p>
                        </div>
                        <PiggyBank className="h-8 w-8 text-green-500" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent" />
                    </CardContent>
                  </Card>

                  <Card className="relative overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Active Goals</p>
                          <p className="text-2xl font-bold text-purple-600">{savingsGoals.filter(g => g.status === 'active').length}</p>
                          <p className="text-xs text-purple-600">In progress</p>
                        </div>
                        <Target className="h-8 w-8 text-purple-500" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent" />
                    </CardContent>
                  </Card>

                  <Card className="relative overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Saving Streak</p>
                          <p className="text-2xl font-bold text-orange-600">{walletData.currentStreak}</p>
                          <p className="text-xs text-orange-600">days in a row</p>
                        </div>
                        <Clock className="h-8 w-8 text-orange-500" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent" />
                    </CardContent>
                  </Card>
                </div>

                {/* Transfer Action */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ArrowRightLeft className="h-5 w-5" />
                      Transfer to Saving Wallet
                    </CardTitle>
                    <CardDescription>Move money from your Main Wallet to your Saving Wallet for specific goals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="text-center">
                          <Wallet className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                          <p className="text-sm font-medium">Main Wallet</p>
                          <CurrencyDisplay amount={walletData.balance} className="text-lg font-bold" showToggle={false} />
                        </div>
                        
                        <ArrowRightLeft className="h-6 w-6 text-muted-foreground" />
                        
                        <div className="text-center">
                          <PiggyBank className="h-8 w-8 text-green-500 mx-auto mb-2" />
                          <p className="text-sm font-medium">Saving Wallet</p>
                          <CurrencyDisplay amount={walletData.savingBalance} className="text-lg font-bold text-green-600" showToggle={false} />
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => setIsTransferModalOpen(true)} 
                        size="lg"
                        className="w-full sm:w-auto"
                        disabled={walletData.balance <= 0}
                      >
                        <ArrowRightLeft className="h-4 w-4 mr-2" />
                        Transfer Funds
                      </Button>
                    </div>
                    
                    {walletData.balance <= 0 && (
                      <Alert className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Your Main Wallet balance is empty. Add funds to start saving.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                {/* Savings Goals */}
                <div className="grid lg:grid-cols-2 gap-6">

                  <Card>
                    <CardHeader>
                      <CardTitle>Savings Goals Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="h-64 w-full flex items-center justify-center">
                          <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                      ) : savingsBreakdown.length > 0 ? (
                        <>
                          <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={savingsBreakdown}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={40}
                                  outerRadius={80}
                                  dataKey="value"
                                >
                                  {savingsBreakdown.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="mt-4 space-y-2">
                            {savingsBreakdown.map((item, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                  <span className="text-sm">{item.name}</span>
                                </div>
                                <CurrencyDisplay amount={item.value} className="text-sm font-medium" showToggle={false} />
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="h-64 w-full flex flex-col items-center justify-center text-muted-foreground">
                          <PiggyBank className="h-12 w-12 mb-4" />
                          <p className="text-center">No savings goals yet</p>
                          <p className="text-sm text-center">Create your first savings goal to see the breakdown</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="lending">
              <div className="grid gap-6">
                {/* Lending Stats */}
                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Lent</p>
                          <CurrencyDisplay amount={16000} className="text-2xl font-bold" showToggle={false} />
                        </div>
                        <ArrowUpRight className="h-8 w-8 text-red-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Expected Returns</p>
                          <CurrencyDisplay amount={18200} className="text-2xl font-bold text-green-600" showToggle={false} />
                        </div>
                        <ArrowDownRight className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Active Loans</p>
                          <p className="text-2xl font-bold">2</p>
                        </div>
                        <Users className="h-8 w-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Lending Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="h-5 w-5" />
                      Lend Money
                    </CardTitle>
                    <CardDescription>Offer loans to friends and family members</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="lendAmount">Amount to Lend</Label>
                        <Input
                          id="lendAmount"
                          type="number"
                          placeholder="Enter amount"
                          value={lendAmount}
                          onChange={(e) => setLendAmount(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="borrower">Borrower Details</Label>
                        <Input
                          id="borrower"
                          placeholder="Name or phone number"
                          value={borrowerDetails}
                          onChange={(e) => setBorrowerDetails(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button onClick={handleLend} className="w-full">
                      <HandCoins className="h-4 w-4 mr-2" />
                      Send Loan Offer
                    </Button>
                  </CardContent>
                </Card>

                {/* Lending History */}
                <Card>
                  <CardHeader>
                    <CardTitle>Lending History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {lendingHistory.map((loan) => (
                        <div key={loan.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{loan.borrower}</h4>
                            <p className="text-sm text-muted-foreground">Due: {loan.dueDate}</p>
                            <p className="text-sm">Interest: {loan.interest}%</p>
                          </div>
                          <div className="text-right">
                            <CurrencyDisplay amount={loan.amount} className="font-medium" showToggle={false} />
                            <Badge 
                              variant={
                                loan.status === 'completed' ? 'default' : 
                                loan.status === 'overdue' ? 'destructive' : 'secondary'
                              }
                            >
                              {loan.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <SavingsAnalytics 
                walletData={walletData}
                savingsGoals={savingsGoals}
                transfers={savingTransfers}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <TransferToSavingModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        mainWalletBalance={walletData.balance}
        savingGoals={savingsGoals}
        onTransfer={handleTransfer}
        isLoading={isLoading}
      />
    </div>
  );
};

export default PersonalSavingsPage;
