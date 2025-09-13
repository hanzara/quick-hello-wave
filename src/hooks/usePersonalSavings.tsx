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
  totalSavings: number;
  monthlyTarget: number;
  dailyTarget: number;
  currentStreak: number;
}

export const usePersonalSavings = () => {
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [savingsTransactions, setSavingsTransactions] = useState<SavingsTransaction[]>([]);
  const [walletData, setWalletData] = useState<PersonalWallet>({
    balance: 0,
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
        .single();

      if (walletError && walletError.code !== 'PGRST116') {
        console.error('Error fetching wallet:', walletError);
        return;
      }

      if (wallet) {
        setWalletData(prev => ({
          ...prev,
          balance: wallet.balance || 0
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

  const addSavings = async (amount: number, goalName?: string, frequency = 'one_time', notes?: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.rpc('add_personal_savings', {
        p_amount: amount,
        p_goal_name: goalName || null,
        p_frequency: frequency,
        p_notes: notes || null
      });

      if (error) {
        throw error;
      }

      // Refresh all data
      await Promise.all([
        fetchWalletData(),
        fetchSavingsGoals(),
        fetchSavingsTransactions()
      ]);

      toast({
        title: "Savings Added Successfully!",
        description: `KES ${amount} has been saved${goalName ? ` to your ${goalName} goal` : ''}.`,
      });

      return data;
    } catch (error: any) {
      console.error('Error adding savings:', error);
      toast({
        title: "Error Adding Savings",
        description: error.message || "Failed to add savings. Please try again.",
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
        fetchSavingsTransactions()
      ]);
      setIsLoading(false);
    };

    loadData();
  }, []);

  return {
    savingsGoals,
    savingsTransactions,
    walletData,
    isLoading,
    addSavings,
    getSavingsBreakdown,
    getSavingsData,
    refreshData: () => Promise.all([
      fetchWalletData(),
      fetchSavingsGoals(),
      fetchSavingsTransactions()
    ])
  };
};