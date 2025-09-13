
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export const useInvitations = (chamaId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const invitationsQuery = useQuery({
    queryKey: ['invitations', chamaId],
    queryFn: async () => {
      if (!user || !chamaId) return [];

      const { data, error } = await supabase
        .from('member_invitations')
        .select('*')
        .eq('chama_id', chamaId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching invitations:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user && !!chamaId,
  });

  const createInvitationMutation = useMutation({
    mutationFn: async ({ email, phoneNumber }: { email?: string; phoneNumber?: string }) => {
      if (!user || !chamaId) {
        throw new Error('User not authenticated or chama not selected');
      }

      if (!email && !phoneNumber) {
        throw new Error('Either email or phone number is required');
      }

      const { data, error } = await supabase
        .from('member_invitations')
        .insert({
          chama_id: chamaId,
          invited_by: user.id,
          email: email || null,
          phone_number: phoneNumber || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating invitation:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invitations', chamaId] });
      
      const inviteLink = `${window.location.origin}/join-chama?token=${data.invitation_token}`;
      
      toast({
        title: "Invitation Created! 🎉",
        description: "Invitation link copied to clipboard. Share it with the person you want to invite.",
      });

      // Copy to clipboard
      navigator.clipboard.writeText(inviteLink).then(() => {
        console.log('Invitation link copied to clipboard:', inviteLink);
      }).catch(() => {
        console.warn('Could not copy to clipboard');
        // Show the link in the toast if clipboard fails
        toast({
          title: "Invitation Link Created",
          description: `Share this link: ${inviteLink}`,
        });
      });
    },
    onError: (error: any) => {
      console.error('Create invitation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create invitation",
        variant: "destructive",
      });
    },
  });

  return {
    invitations: invitationsQuery.data || [],
    isLoading: invitationsQuery.isLoading,
    createInvitation: createInvitationMutation.mutate,
    isCreating: createInvitationMutation.isPending,
  };
};

export const useAcceptInvitation = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (invitationToken: string) => {
      const { data, error } = await supabase.rpc('accept_chama_invitation', {
        invitation_token: invitationToken,
      });

      if (error) {
        console.error('Error accepting invitation:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data: any) => {
      if (data?.success) {
        toast({
          title: "Welcome! 🎉",
          description: data?.message || "Successfully joined the chama!",
        });
      } else {
        toast({
          title: "Failed",
          description: data?.message || "Failed to join chama",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      console.error('Accept invitation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to accept invitation",
        variant: "destructive",
      });
    },
  });
};
