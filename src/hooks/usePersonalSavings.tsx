import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SavingsGoal {
  id: string;
  user_id: string;
  goal_name: string;
  target_amount: number;
  current_amount: number;
  target_date?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface SavingsTransaction {
  id: string;
  user_id: string;
  savings_goal_id?: string;
  amount: number;
  transaction_type: string;
  frequency: string;
  payment_method: string;
  notes?: string;
  created_at: string;
}

interface PersonalWallet {
  balance: number;
  savingBalance: number;
  totalSavings: number;
  monthlyTarget: number;
  dailyTarget: number;
  currentStreak: number;
}

interface SavingTransfer {
  id: string;
  user_id: string;
  amount: number;
  source_of_funds: string;
  saving_category: string;
  notes?: string;
  frequency: string;
  start_date?: string;
  created_at: string;
}

export const usePersonalSavings = () => {
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [savingsTransactions, setSavingsTransactions] = useState<SavingsTransaction[]>([]);
  const [savingTransfers, setSavingTransfers] = useState<SavingTransfer[]>([]);
  const [walletData, setWalletData] = useState<PersonalWallet>({
    balance: 0,
    savingBalance: 0,
    totalSavings: 0,
    monthlyTarget: 15000,
    dailyTarget: 500,
    currentStreak: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchWalletData = async () => {
    try {
      const { data: wallet, error: walletError } = await supabase
        .from('user_wallets')
        .select('*')
        .maybeSingle();

      if (walletError) {
        console.error('Error fetching wallet:', walletError);
        return;
      }

      if (wallet) {
        setWalletData(prev => ({
          ...prev,
          balance: wallet.balance || 0,
          savingBalance: wallet.saving_balance || 0
        }));
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    }
  };

  const fetchSavingsGoals = async () => {
    try {
      const { data: goals, error } = await supabase
        .from('personal_savings_goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching savings goals:', error);
        return;
      }

      setSavingsGoals(goals || []);
      
      // Calculate total savings from goals
      const totalSavings = goals?.reduce((sum, goal) => sum + (goal.current_amount || 0), 0) || 0;
      setWalletData(prev => ({
        ...prev,
        totalSavings
      }));
    } catch (error) {
      console.error('Error fetching savings goals:', error);
    }
  };

  const fetchSavingsTransactions = async () => {
    try {
      const { data: transactions, error } = await supabase
        .from('personal_savings_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching savings transactions:', error);
        return;
      }

      setSavingsTransactions(transactions || []);
      
      // Calculate current streak (simplified - consecutive days with deposits)
      const recentTransactions = transactions?.filter(t => t.transaction_type === 'deposit') || [];
      const today = new Date();
      let streak = 0;
      
      for (let i = 0; i < recentTransactions.length; i++) {
        const transactionDate = new Date(recentTransactions[i].created_at);
        const daysDiff = Math.floor((today.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff <= streak) {
          streak++;
        } else {
          break;
        }
      }
      
      setWalletData(prev => ({
        ...prev,
        currentStreak: streak
      }));
    } catch (error) {
      console.error('Error fetching savings transactions:', error);
    }
  };

  const fetchSavingTransfers = async () => {
    try {
      const { data: transfers, error } = await supabase
        .from('saving_wallet_transfers')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching saving transfers:', error);
        return;
      }

      setSavingTransfers(transfers || []);
      
      // Calculate current streak from transfers
      const recentTransfers = transfers?.filter(t => t.frequency === 'one_time' || t.frequency === 'daily') || [];
      const today = new Date();
      let streak = 0;
      
      for (let i = 0; i < recentTransfers.length; i++) {
        const transferDate = new Date(recentTransfers[i].created_at);
        const daysDiff = Math.floor((today.getTime() - transferDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff <= streak) {
          streak++;
        } else {
          break;
        }
      }
      
      setWalletData(prev => ({
        ...prev,
        currentStreak: streak
      }));
    } catch (error) {
      console.error('Error fetching saving transfers:', error);
    }
  };

  const transferToSavingWallet = async (transferData: {
    amount: number;
    sourceOfFunds: string;
    savingCategory: string;
    notes?: string;
    frequency: string;
    startDate?: Date;
  }) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.rpc('transfer_to_saving_wallet', {
        p_amount: transferData.amount,
        p_source_of_funds: transferData.sourceOfFunds,
        p_saving_category: transferData.savingCategory,
        p_notes: transferData.notes || null,
        p_frequency: transferData.frequency,
        p_start_date: transferData.startDate?.toISOString().split('T')[0] || null
      });

      if (error) {
        throw error;
      }

      // Refresh all data
      await Promise.all([
        fetchWalletData(),
        fetchSavingsGoals(),
        fetchSavingsTransactions(),
        fetchSavingTransfers()
      ]);

      toast({
        title: "Transfer Successful!",
        description: `KES ${transferData.amount} transferred to Saving Wallet for ${transferData.savingCategory}.`,
      });

      return data;
    } catch (error: any) {
      console.error('Error transferring to saving wallet:', error);
      toast({
        title: "Transfer Failed",
        description: error.message || "Failed to transfer funds. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getSavingsBreakdown = () => {
    return savingsGoals.map((goal, index) => ({
      name: goal.goal_name,
      value: goal.current_amount,
      color: ['#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'][index % 6]
    }));
  };

  const getSavingsData = () => {
    // Generate mock monthly data for now - could be enhanced with real historical data
    const currentMonth = new Date().getMonth();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return Array.from({ length: 6 }, (_, i) => {
      const monthIndex = (currentMonth - 5 + i + 12) % 12;
      const monthTransactions = savingsTransactions.filter(t => {
        const transactionMonth = new Date(t.created_at).getMonth();
        return transactionMonth === monthIndex && t.transaction_type === 'deposit';
      });
      
      const amount = monthTransactions.reduce((sum, t) => sum + t.amount, 0);
      
      return {
        month: months[monthIndex],
        amount,
        target: walletData.monthlyTarget
      };
    });
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchWalletData(),
        fetchSavingsGoals(),
        fetchSavingsTransactions(),
        fetchSavingTransfers()
      ]);
      setIsLoading(false);
    };

    loadData();
  }, []);

  return {
    savingsGoals,
    savingsTransactions,
    savingTransfers,
    walletData,
    isLoading,
    transferToSavingWallet,
    getSavingsBreakdown,
    getSavingsData,
    refreshData: () => Promise.all([
      fetchWalletData(),
      fetchSavingsGoals(),
      fetchSavingsTransactions(),
      fetchSavingTransfers()
    ])
  };
};