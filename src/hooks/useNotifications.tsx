
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export const useNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const notificationsQuery = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      console.log('=== Fetching Notifications ===');
      console.log('User ID:', user.id);

      // First get the chama IDs where the user is a member
      const { data: memberChamas, error: memberError } = await supabase
        .from('chama_members')
        .select('chama_id')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (memberError) {
        console.error('Error fetching member chamas:', memberError);
        throw memberError;
      }

      const chamaIds = memberChamas?.map(m => m.chama_id) || [];
      console.log('User is member of chamas:', chamaIds);

      if (chamaIds.length === 0) {
        return [];
      }

      // Get activities and announcements from chamas the user is a member of
      const { data: activities, error: activitiesError } = await supabase
        .from('chama_activities')
        .select(`
          id,
          activity_type,
          description,
          amount,
          created_at,
          chamas (
            id,
            name
          )
        `)
        .in('chama_id', chamaIds)
        .order('created_at', { ascending: false })
        .limit(20);

      if (activitiesError) {
        console.error('Error fetching activities:', activitiesError);
        throw activitiesError;
      }

      console.log('Activities fetched:', activities?.length || 0);

      // Convert activities to notifications format
      const notifications = activities?.map(activity => ({
        id: activity.id,
        type: activity.activity_type,
        title: getNotificationTitle(activity.activity_type),
        message: activity.description,
        amount: activity.amount,
        timestamp: activity.created_at,
        chamaName: (activity.chamas as any)?.name,
        isRead: false,
        priority: getNotificationPriority(activity.activity_type)
      })) || [];

      console.log('Notifications processed:', notifications.length);
      return notifications;
    },
    enabled: !!user,
    refetchInterval: 30000, // Refresh every 30 seconds for real-time feel
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      console.log('=== Marking notification as read ===');
      console.log('Notification ID:', notificationId);
      // In a real app, you'd update a notifications table
      // For now, we'll just simulate the action
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return {
    notifications: notificationsQuery.data || [],
    isLoading: notificationsQuery.isLoading,
    error: notificationsQuery.error,
    markAsRead: markAsReadMutation.mutate,
    refetch: notificationsQuery.refetch
  };
};

const getNotificationTitle = (activityType: string): string => {
  switch (activityType) {
    case 'contribution_made': return 'Contribution Received';
    case 'member_joined': return 'New Member';
    case 'loan_approved': return 'Loan Approved';
    case 'payment_due': return 'Payment Due';
    case 'vote_created': return 'New Vote';
    case 'announcement': return 'New Announcement';
    default: return 'Activity Update';
  }
};

const getNotificationPriority = (activityType: string): 'high' | 'medium' | 'low' => {
  switch (activityType) {
    case 'payment_due':
    case 'loan_approved': return 'high';
    case 'vote_created':
    case 'announcement':
    case 'contribution_made': return 'medium';
    default: return 'low';
  }
};
