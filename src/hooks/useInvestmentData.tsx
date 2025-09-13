
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const useInvestmentData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const investmentsQuery = useQuery({
    queryKey: ['investment-data', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      console.log('Fetching investment data for user:', user.id);

      // Fetch user's investments
      const { data: investments, error: investmentError } = await supabase
        .from('user_investments')
        .select(`
          id,
          amount_invested,
          shares_percentage,
          returns_earned,
          last_return_date,
          exit_date,
          status,
          created_at,
          investment_projects (
            id,
            title,
            category,
            projected_roi,
            risk_score,
            current_funding,
            target_amount
          )
        `)
        .eq('investor_id', user.id)
        .order('created_at', { ascending: false });

      if (investmentError) {
        console.error('Error fetching investments:', investmentError);
        throw investmentError;
      }

      // Fetch available investment projects
      const { data: availableProjects, error: projectsError } = await supabase
        .from('investment_projects')
        .select(`
          id,
          title,
          description,
          category,
          target_amount,
          minimum_investment,
          current_funding,
          projected_roi,
          risk_score,
          duration_months,
          status,
          funding_deadline
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(6);

      if (projectsError) {
        console.error('Error fetching projects:', projectsError);
      }

      // Calculate portfolio statistics
      const totalInvested = investments?.reduce((sum, inv) => sum + inv.amount_invested, 0) || 0;
      const totalReturns = investments?.reduce((sum, inv) => sum + (inv.returns_earned || 0), 0) || 0;
      const activeInvestments = investments?.filter(inv => inv.status === 'active').length || 0;
      const portfolioValue = totalInvested + totalReturns;
      const overallROI = totalInvested > 0 ? ((totalReturns / totalInvested) * 100) : 0;

      // Portfolio distribution by category
      const categoryDistribution = {};
      investments?.forEach(inv => {
        const category = (inv.investment_projects as any)?.category || 'Other';
        categoryDistribution[category] = (categoryDistribution[category] || 0) + inv.amount_invested;
      });

      // Investment performance over time
      const performanceData = investments?.map(inv => ({
        month: new Date(inv.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        invested: inv.amount_invested,
        returns: inv.returns_earned || 0,
        roi: inv.amount_invested > 0 ? ((inv.returns_earned || 0) / inv.amount_invested * 100) : 0
      })) || [];

      return {
        investments: investments || [],
        availableProjects: availableProjects || [],
        statistics: {
          totalInvested,
          totalReturns,
          activeInvestments,
          portfolioValue,
          overallROI
        },
        categoryDistribution,
        performanceData
      };
    },
    enabled: !!user,
  });

  const investMutation = useMutation({
    mutationFn: async ({ projectId, amount }: { projectId: string; amount: number }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_investments')
        .insert({
          project_id: projectId,
          investor_id: user.id,
          amount_invested: amount,
          shares_percentage: 0, // This would be calculated based on project logic
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investment-data'] });
      toast({
        title: "Investment Successful",
        description: "Your investment has been recorded successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Investment Failed",
        description: error.message || "Failed to process investment",
        variant: "destructive",
      });
    },
  });

  return {
    ...investmentsQuery,
    investMutation,
    isInvesting: investMutation.isPending
  };
};
