
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export const useAnalyticsData = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['analytics-data', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      console.log('Fetching analytics data for user:', user.id);

      // Fetch user's chamas
      const { data: chamaMembers, error: chamaError } = await supabase
        .from('chama_members')
        .select(`
          chama_id,
          total_contributed,
          last_contribution_date,
          chamas (
            id,
            name,
            total_savings,
            current_members
          )
        `)
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (chamaError) {
        console.error('Error fetching chamas:', chamaError);
        throw chamaError;
      }

      // Fetch contribution history for the last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const { data: contributions, error: contributionError } = await supabase
        .from('chama_contributions_new')
        .select(`
          amount,
          contribution_date,
          chama_id,
          chamas (name)
        `)
        .eq('member_id', chamaMembers?.[0]?.chama_id ? 
          (chamaMembers.find(m => m.chama_id === chamaMembers[0].chama_id) as any)?.id : 
          null)
        .gte('contribution_date', sixMonthsAgo.toISOString().split('T')[0])
        .order('contribution_date', { ascending: true });

      // Calculate total savings across all chamas
      const totalSavings = chamaMembers?.reduce((sum, member) => 
        sum + (member.total_contributed || 0), 0) || 0;

      // Calculate monthly growth (simplified)
      const currentMonth = new Date().getMonth();
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const currentMonthContributions = contributions?.filter(c => 
        new Date(c.contribution_date).getMonth() === currentMonth) || [];
      const lastMonthContributions = contributions?.filter(c => 
        new Date(c.contribution_date).getMonth() === lastMonth) || [];
      
      const currentMonthTotal = currentMonthContributions.reduce((sum, c) => sum + c.amount, 0);
      const lastMonthTotal = lastMonthContributions.reduce((sum, c) => sum + c.amount, 0);
      const monthlyGrowth = lastMonthTotal > 0 ? 
        ((currentMonthTotal - lastMonthTotal) / lastMonthTotal * 100) : 0;

      // Process contribution trends for chart
      const contributionTrends = [];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthIndex = date.getMonth();
        const monthContributions = contributions?.filter(c => 
          new Date(c.contribution_date).getMonth() === monthIndex) || [];
        const monthTotal = monthContributions.reduce((sum, c) => sum + c.amount, 0);
        
        contributionTrends.push({
          month: months[monthIndex],
          amount: monthTotal
        });
      }

      // Process chama performance data
      const chamaPerformance = chamaMembers?.map(member => ({
        name: (member.chamas as any)?.name || 'Unknown Chama',
        contributions: member.total_contributed || 0,
        members: (member.chamas as any)?.current_members || 0
      })) || [];

      // Recent activities
      const recentActivities = contributions?.slice(-5).reverse().map(c => ({
        type: 'contribution',
        description: `Contribution to ${(c.chamas as any)?.name || 'Unknown Chama'}`,
        amount: c.amount,
        date: c.contribution_date
      })) || [];

      return {
        totalSavings,
        monthlyGrowth,
        activeChamasCount: chamaMembers?.length || 0,
        contributionTrends,
        chamaPerformance,
        recentActivities
      };
    },
    enabled: !!user,
  });
};
