
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Activity, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  Settings,
  FileText,
  Send,
  Minus
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { useToast } from '@/hooks/use-toast';

interface AdminDashboardProps {
  chamaData: any;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ chamaData }) => {
  const { 
    activities, 
    walletTransactions, 
    memberStats, 
    financialMetrics,
    pendingApprovals,
    isLoading,
    processPayment,
    recordDeposit,
    approveLoan,
    rejectLoan
  } = useAdminDashboard(chamaData.id);
  
  const { toast } = useToast();
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [depositDescription, setDepositDescription] = useState('');

  // Mock data for charts
  const activityTrends = [
    { month: 'Jan', contributions: 180000, loans: 50000, expenses: 15000 },
    { month: 'Feb', contributions: 220000, loans: 75000, expenses: 18000 },
    { month: 'Mar', contributions: 210000, loans: 60000, expenses: 12000 },
    { month: 'Apr', contributions: 240000, loans: 90000, expenses: 20000 },
    { month: 'May', contributions: 235000, loans: 65000, expenses: 16000 },
    { month: 'Jun', contributions: 260000, loans: 85000, expenses: 22000 }
  ];

  const transactionTypes = [
    { name: 'Contributions', value: 1450000, color: '#22c55e' },
    { name: 'Loan Disbursements', value: 425000, color: '#3b82f6' },
    { name: 'Expenses', value: 103000, color: '#ef4444' },
    { name: 'Investments', value: 200000, color: '#8b5cf6' }
  ];

  const recentActivities = [
    { id: '1', type: 'contribution', member: 'John Doe', amount: 15000, time: '2 hours ago', status: 'completed' },
    { id: '2', type: 'loan_request', member: 'Jane Smith', amount: 50000, time: '4 hours ago', status: 'pending' },
    { id: '3', type: 'payment', member: 'System', amount: 25000, time: '6 hours ago', status: 'completed' },
    { id: '4', type: 'investment', member: 'Michael Brown', amount: 100000, time: '1 day ago', status: 'pending' },
    { id: '5', type: 'expense', member: 'Admin', amount: 5000, time: '1 day ago', status: 'completed' }
  ];

  const walletBalance = chamaData.totalSavings || 0;
  const pendingTransactions = 3;
  const monthlyInflow = 260000;
  const monthlyOutflow = 107000;

  const handleProcessPayment = async () => {
    if (!paymentAmount || !paymentDescription) {
      toast({
        title: "Missing Information",
        description: "Please enter both amount and description",
        variant: "destructive",
      });
      return;
    }

    try {
      await processPayment({
        amount: parseFloat(paymentAmount),
        description: paymentDescription
      });
      setPaymentAmount('');
      setPaymentDescription('');
      toast({
        title: "Payment Processed",
        description: "Payment has been successfully processed",
      });
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Failed to process payment",
        variant: "destructive",
      });
    }
  };

  const handleRecordDeposit = async () => {
    if (!depositAmount || !depositDescription) {
      toast({
        title: "Missing Information",
        description: "Please enter both amount and description",
        variant: "destructive",
      });
      return;
    }

    try {
      await recordDeposit({
        amount: parseFloat(depositAmount),
        description: depositDescription
      });
      setDepositAmount('');
      setDepositDescription('');
      toast({
        title: "Deposit Recorded",
        description: "Deposit has been successfully recorded",
      });
    } catch (error) {
      toast({
        title: "Deposit Failed",
        description: "Failed to record deposit",
        variant: "destructive",
      });
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'contribution': return <ArrowUpRight className="h-4 w-4 text-green-600" />;
      case 'loan_request': return <FileText className="h-4 w-4 text-blue-600" />;
      case 'payment': return <ArrowDownRight className="h-4 w-4 text-red-600" />;
      case 'investment': return <TrendingUp className="h-4 w-4 text-purple-600" />;
      case 'expense': return <Minus className="h-4 w-4 text-orange-600" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <p className="text-muted-foreground">Comprehensive oversight of {chamaData.name}</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Central Wallet Balance</CardTitle>
            <Wallet className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              <CurrencyDisplay amount={walletBalance} />
            </div>
            <p className="text-xs text-green-600">
              Available for disbursement
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Inflow</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              <CurrencyDisplay amount={monthlyInflow} />
            </div>
            <p className="text-xs text-blue-600">
              +8.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Outflow</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">
              <CurrencyDisplay amount={monthlyOutflow} />
            </div>
            <p className="text-xs text-red-600">
              Loans & Expenses
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{pendingTransactions}</div>
            <p className="text-xs text-yellow-600">
              Require approval
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Financial Overview */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Activity Trends</CardTitle>
                <CardDescription>Monthly financial activities overview</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={activityTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`KES ${value.toLocaleString()}`, 'Amount']} />
                    <Line type="monotone" dataKey="contributions" stroke="#22c55e" strokeWidth={2} name="Contributions" />
                    <Line type="monotone" dataKey="loans" stroke="#3b82f6" strokeWidth={2} name="Loans" />
                    <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Transaction Distribution</CardTitle>
                <CardDescription>Breakdown of financial activities</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={transactionTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {transactionTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`KES ${value.toLocaleString()}`, 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities Preview */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest transactions and activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getActivityIcon(activity.type)}
                      <div>
                        <p className="font-medium text-sm">{activity.member}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="font-medium text-sm">
                          <CurrencyDisplay amount={activity.amount} />
                        </p>
                        <p className="text-xs capitalize text-muted-foreground">{activity.type.replace('_', ' ')}</p>
                      </div>
                      {getStatusBadge(activity.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wallet" className="space-y-6">
          {/* Wallet Management */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Process Payment</CardTitle>
                <CardDescription>Disburse funds from central wallet</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="payment-amount">Amount (KES)</Label>
                  <Input
                    id="payment-amount"
                    type="number"
                    placeholder="Enter amount"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="payment-description">Description</Label>
                  <Input
                    id="payment-description"
                    placeholder="Payment description"
                    value={paymentDescription}
                    onChange={(e) => setPaymentDescription(e.target.value)}
                  />
                </div>
                <Button onClick={handleProcessPayment} className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Process Payment
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Record Deposit</CardTitle>
                <CardDescription>Add funds to central wallet</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="deposit-amount">Amount (KES)</Label>
                  <Input
                    id="deposit-amount"
                    type="number"
                    placeholder="Enter amount"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="deposit-description">Description</Label>
                  <Input
                    id="deposit-description"
                    placeholder="Deposit description"
                    value={depositDescription}
                    onChange={(e) => setDepositDescription(e.target.value)}
                  />
                </div>
                <Button onClick={handleRecordDeposit} className="w-full" variant="outline">
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Record Deposit
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Wallet Transactions */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Recent Wallet Transactions</CardTitle>
              <CardDescription>All deposits and payments from central wallet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: '1', type: 'deposit', description: 'Member contributions', amount: 45000, date: '2024-01-15', processor: 'System' },
                  { id: '2', type: 'payment', description: 'Loan disbursement to John Doe', amount: -25000, date: '2024-01-14', processor: 'Admin' },
                  { id: '3', type: 'deposit', description: 'External investment', amount: 100000, date: '2024-01-13', processor: 'Treasurer' },
                  { id: '4', type: 'payment', description: 'Office rent payment', amount: -15000, date: '2024-01-12', processor: 'Admin' }
                ].map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {transaction.type === 'deposit' ? 
                        <ArrowUpRight className="h-4 w-4 text-green-600" /> : 
                        <ArrowDownRight className="h-4 w-4 text-red-600" />
                      }
                      <div>
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {transaction.date} • Processed by {transaction.processor}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-sm ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.amount > 0 ? '+' : ''}
                        <CurrencyDisplay amount={Math.abs(transaction.amount)} />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>All Activities</CardTitle>
              <CardDescription>Complete history of chama activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      {getActivityIcon(activity.type)}
                      <div>
                        <p className="font-medium">{activity.member}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {activity.type.replace('_', ' ')} • {activity.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-bold">
                          <CurrencyDisplay amount={activity.amount} />
                        </p>
                      </div>
                      {getStatusBadge(activity.status)}
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Items requiring admin approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: '1', type: 'Loan Request', member: 'Jane Smith', amount: 50000, date: '4 hours ago', details: 'Business expansion loan' },
                  { id: '2', type: 'Investment Proposal', member: 'Michael Brown', amount: 100000, date: '1 day ago', details: 'Real estate investment' },
                  { id: '3', type: 'Expense Request', member: 'Sarah Wilson', amount: 8000, date: '2 days ago', details: 'Office supplies' }
                ].map((item) => (
                  <div key={item.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium">{item.type}</p>
                        <p className="text-sm text-muted-foreground">{item.member} • {item.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">
                          <CurrencyDisplay amount={item.amount} />
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{item.details}</p>
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Member Performance</CardTitle>
                <CardDescription>Contribution consistency by member</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'John Doe', consistency: 95, totalContributed: 180000 },
                    { name: 'Jane Smith', consistency: 88, totalContributed: 165000 },
                    { name: 'Michael Brown', consistency: 92, totalContributed: 172000 },
                    { name: 'Sarah Wilson', consistency: 85, totalContributed: 158000 }
                  ].map((member, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{member.name}</span>
                        <span>
                          <CurrencyDisplay amount={member.totalContributed} />
                        </span>
                      </div>
                      <Progress value={member.consistency} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {member.consistency}% consistency rate
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Financial Health</CardTitle>
                <CardDescription>Key financial indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Liquidity Ratio</span>
                    <span className="font-bold text-green-600">2.4:1</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Loan Default Rate</span>
                    <span className="font-bold text-yellow-600">2.1%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Growth Rate (Monthly)</span>
                    <span className="font-bold text-blue-600">8.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Member Retention</span>
                    <span className="font-bold text-green-600">96.8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average ROI</span>
                    <span className="font-bold text-purple-600">15.3%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
