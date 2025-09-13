
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export const useLoanData = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['loan-data', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      console.log('Fetching loan data for user:', user.id);

      // Fetch user's loan applications
      const { data: loanApplications, error: loanError } = await supabase
        .from('chama_loans')
        .select(`
          id,
          amount,
          interest_rate,
          duration_months,
          repaid_amount,
          due_date,
          status,
          created_at,
          chamas (
            id,
            name
          )
        `)
        .eq('borrower_id', user.id)
        .order('created_at', { ascending: false });

      if (loanError) {
        console.error('Error fetching loans:', loanError);
        throw loanError;
      }

      // Fetch loan repayments
      const { data: repayments, error: repaymentError } = await supabase
        .from('chama_loan_repayments')
        .select(`
          id,
          loan_id,
          amount,
          payment_date,
          payment_method,
          status
        `)
        .in('loan_id', loanApplications?.map(loan => loan.id) || [])
        .order('payment_date', { ascending: false });

      if (repaymentError) {
        console.error('Error fetching repayments:', repaymentError);
      }

      // Calculate loan statistics
      const totalBorrowed = loanApplications?.reduce((sum, loan) => sum + loan.amount, 0) || 0;
      const totalRepaid = loanApplications?.reduce((sum, loan) => sum + (loan.repaid_amount || 0), 0) || 0;
      const activeLoans = loanApplications?.filter(loan => loan.status === 'active').length || 0;
      const overdueLoans = loanApplications?.filter(loan => 
        loan.status === 'active' && loan.due_date && new Date(loan.due_date) < new Date()
      ).length || 0;

      // Process loan history for chart
      const loanHistory = loanApplications?.map(loan => ({
        month: new Date(loan.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        amount: loan.amount,
        status: loan.status,
        chamaName: (loan.chamas as any)?.name || 'Unknown Chama'
      })) || [];

      // Recent loan activities
      const recentActivities = [
        ...(loanApplications?.slice(0, 3).map(loan => ({
          type: 'loan_application',
          description: `Applied for loan of KES ${loan.amount.toLocaleString()}`,
          amount: loan.amount,
          date: loan.created_at,
          status: loan.status
        })) || []),
        ...(repayments?.slice(0, 3).map(repayment => ({
          type: 'loan_repayment',
          description: `Loan repayment of KES ${repayment.amount.toLocaleString()}`,
          amount: repayment.amount,
          date: repayment.payment_date,
          status: repayment.status
        })) || [])
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

      return {
        loanApplications: loanApplications || [],
        repayments: repayments || [],
        statistics: {
          totalBorrowed,
          totalRepaid,
          activeLoans,
          overdueLoans,
          outstandingBalance: totalBorrowed - totalRepaid
        },
        loanHistory,
        recentActivities
      };
    },
    enabled: !!user,
  });
};
