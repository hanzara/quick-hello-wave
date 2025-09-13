
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const useAdminDashboard = (chamaId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all chama activities
  const activitiesQuery = useQuery({
    queryKey: ['admin-activities', chamaId],
    queryFn: async () => {
      console.log('Fetching admin activities for chama:', chamaId);

      const { data, error } = await supabase
        .from('chama_activities')
        .select(`
          *,
          chama_members!inner(
            id,
            user_id,
            profiles(full_name, email)
          )
        `)
        .eq('chama_id', chamaId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching activities:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!chamaId && !!user,
  });

  // Fetch wallet transactions
  const walletTransactionsQuery = useQuery({
    queryKey: ['admin-wallet-transactions', chamaId],
    queryFn: async () => {
      console.log('Fetching wallet transactions for chama:', chamaId);

      const { data, error } = await supabase
        .from('chama_wallet_transactions')
        .select(`
          *,
          chama_members!inner(profiles(full_name, email))
        `)
        .eq('chama_id', chamaId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching wallet transactions:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!chamaId && !!user,
  });

  // Fetch member statistics
  const memberStatsQuery = useQuery({
    queryKey: ['admin-member-stats', chamaId],
    queryFn: async () => {
      console.log('Fetching member stats for chama:', chamaId);

      const { data, error } = await supabase
        .from('chama_members')
        .select(`
          id,
          user_id,
          total_contributed,
          last_contribution_date,
          joined_at,
          is_active,
          role,
          profiles(full_name, email, phone_number)
        `)
        .eq('chama_id', chamaId)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching member stats:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!chamaId && !!user,
  });

  // Fetch financial metrics
  const financialMetricsQuery = useQuery({
    queryKey: ['admin-financial-metrics', chamaId],
    queryFn: async () => {
      console.log('Fetching financial metrics for chama:', chamaId);

      // Get contributions summary
      const { data: contributions, error: contribError } = await supabase
        .from('chama_contributions_new')
        .select('amount, contribution_date')
        .eq('chama_id', chamaId)
        .eq('status', 'completed');

      if (contribError) {
        console.error('Error fetching contributions:', contribError);
        throw contribError;
      }

      // Get loans summary
      const { data: loans, error: loansError } = await supabase
        .from('chama_loans')
        .select('amount, status, created_at')
        .eq('chama_id', chamaId);

      if (loansError) {
        console.error('Error fetching loans:', loansError);
        throw loansError;
      }

      // Calculate metrics
      const totalContributions = contributions?.reduce((sum, c) => sum + c.amount, 0) || 0;
      const totalLoans = loans?.reduce((sum, l) => sum + l.amount, 0) || 0;
      const activeLoans = loans?.filter(l => l.status === 'active').length || 0;
      
      // Monthly metrics
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const monthlyContributions = contributions?.filter(c => {
        const date = new Date(c.contribution_date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      }).reduce((sum, c) => sum + c.amount, 0) || 0;

      return {
        totalContributions,
        totalLoans,
        activeLoans,
        monthlyContributions,
        netWorth: totalContributions - totalLoans,
        growthRate: 8.2 // This would be calculated based on historical data
      };
    },
    enabled: !!chamaId && !!user,
  });

  // Fetch pending approvals
  const pendingApprovalsQuery = useQuery({
    queryKey: ['admin-pending-approvals', chamaId],
    queryFn: async () => {
      console.log('Fetching pending approvals for chama:', chamaId);

      const { data, error } = await supabase
        .from('chama_loan_requests')
        .select(`
          *,
          chama_members!inner(
            id,
            profiles(full_name, email)
          )
        `)
        .eq('chama_id', chamaId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching pending approvals:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!chamaId && !!user,
  });

  // Process payment mutation
  const processPaymentMutation = useMutation({
    mutationFn: async ({ amount, description }: { amount: number; description: string }) => {
      console.log('Processing payment:', { amount, description });

      const { data, error } = await supabase.rpc('process_payment', {
        p_chama_id: chamaId,
        p_amount: amount,
        p_description: description,
        p_payment_method: 'internal_transfer'
      });

      if (error) {
        console.error('Error processing payment:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-wallet-transactions', chamaId] });
      queryClient.invalidateQueries({ queryKey: ['admin-activities', chamaId] });
      toast({
        title: "Payment Processed",
        description: "Payment has been successfully processed",
      });
    },
    onError: (error: any) => {
      console.error('Payment processing failed:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to process payment",
        variant: "destructive",
      });
    },
  });

  // Record deposit mutation
  const recordDepositMutation = useMutation({
    mutationFn: async ({ amount, description }: { amount: number; description: string }) => {
      console.log('Recording deposit:', { amount, description });

      const { data, error } = await supabase.rpc('record_manual_deposit', {
        p_chama_id: chamaId,
        p_amount: amount,
        p_description: description,
        p_payment_method: 'manual_entry'
      });

      if (error) {
        console.error('Error recording deposit:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-wallet-transactions', chamaId] });
      queryClient.invalidateQueries({ queryKey: ['admin-activities', chamaId] });
      queryClient.invalidateQueries({ queryKey: ['admin-financial-metrics', chamaId] });
      toast({
        title: "Deposit Recorded",
        description: "Deposit has been successfully recorded",
      });
    },
    onError: (error: any) => {
      console.error('Deposit recording failed:', error);
      toast({
        title: "Deposit Failed",
        description: error.message || "Failed to record deposit",
        variant: "destructive",
      });
    },
  });

  // Approve loan mutation
  const approveLoanMutation = useMutation({
    mutationFn: async (loanRequestId: string) => {
      console.log('Approving loan request:', loanRequestId);

      const { data, error } = await supabase
        .from('chama_loan_requests')
        .update({
          status: 'approved',
          approved_by: user?.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', loanRequestId)
        .select()
        .single();

      if (error) {
        console.error('Error approving loan:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-approvals', chamaId] });
      queryClient.invalidateQueries({ queryKey: ['admin-activities', chamaId] });
      toast({
        title: "Loan Approved",
        description: "Loan request has been approved",
      });
    },
    onError: (error: any) => {
      console.error('Loan approval failed:', error);
      toast({
        title: "Approval Failed",
        description: error.message || "Failed to approve loan",
        variant: "destructive",
      });
    },
  });

  // Reject loan mutation
  const rejectLoanMutation = useMutation({
    mutationFn: async (loanRequestId: string) => {
      console.log('Rejecting loan request:', loanRequestId);

      const { data, error } = await supabase
        .from('chama_loan_requests')
        .update({
          status: 'rejected',
          approved_by: user?.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', loanRequestId)
        .select()
        .single();

      if (error) {
        console.error('Error rejecting loan:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-approvals', chamaId] });
      queryClient.invalidateQueries({ queryKey: ['admin-activities', chamaId] });
      toast({
        title: "Loan Rejected",
        description: "Loan request has been rejected",
      });
    },
    onError: (error: any) => {
      console.error('Loan rejection failed:', error);
      toast({
        title: "Rejection Failed",
        description: error.message || "Failed to reject loan",
        variant: "destructive",
      });
    },
  });

  return {
    // Data
    activities: activitiesQuery.data || [],
    walletTransactions: walletTransactionsQuery.data || [],
    memberStats: memberStatsQuery.data || [],
    financialMetrics: financialMetricsQuery.data || {},
    pendingApprovals: pendingApprovalsQuery.data || [],
    
    // Loading states
    isLoading: activitiesQuery.isLoading || walletTransactionsQuery.isLoading || 
               memberStatsQuery.isLoading || financialMetricsQuery.isLoading ||
               pendingApprovalsQuery.isLoading,
    
    // Mutations
    processPayment: processPaymentMutation.mutateAsync,
    recordDeposit: recordDepositMutation.mutateAsync,
    approveLoan: approveLoanMutation.mutateAsync,
    rejectLoan: rejectLoanMutation.mutateAsync,
    
    // Mutation states
    isProcessingPayment: processPaymentMutation.isPending,
    isRecordingDeposit: recordDepositMutation.isPending,
    isApprovingLoan: approveLoanMutation.isPending,
    isRejectingLoan: rejectLoanMutation.isPending,
  };
};
