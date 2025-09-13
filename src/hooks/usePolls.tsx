
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface Poll {
  id: string;
  chama_id: string;
  title: string;
  description: string;
  options: { text: string; votes: number }[];
  deadline: string;
  status: 'active' | 'closed';
  created_at: string;
  total_votes: number;
  user_vote?: string;
  yes_votes: number;
  no_votes: number;
  not_sure_votes: number;
}

interface CreatePollData {
  title: string;
  description: string;
  options: string[];
  deadline: string;
  chamaId: string;
}

export const usePolls = (chamaId?: string) => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPolls = async () => {
    if (!chamaId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('chama_votes')
        .select(`
          *,
          vote_responses!inner(response)
        `)
        .eq('chama_id', chamaId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('Fetched polls data:', data);

      // Transform the data to match our Poll interface
      const transformedPolls: Poll[] = (data || []).map(vote => {
        const userVoteResponse = vote.vote_responses?.find(
          (response: any) => response.voter_id === user?.id
        );

          return {
            id: vote.id,
            chama_id: vote.chama_id || '',
            title: vote.title || '',
            description: vote.description || '',
            options: [
              { text: 'Yes', votes: vote.yes_votes || 0 },
              { text: 'No', votes: vote.no_votes || 0 },
              { text: 'Not Sure', votes: 0 }
            ],
            deadline: vote.deadline || '',
            status: vote.status === 'active' && new Date(vote.deadline) > new Date() ? 'active' : 'closed',
            created_at: vote.created_at || '',
            total_votes: (vote.yes_votes || 0) + (vote.no_votes || 0),
            yes_votes: vote.yes_votes || 0,
            no_votes: vote.no_votes || 0,
            not_sure_votes: 0,
            user_vote: userVoteResponse ? (userVoteResponse.response === true ? 'yes' : userVoteResponse.response === false ? 'no' : 'not_sure') : undefined,
          };
      });

      setPolls(transformedPolls);
    } catch (error) {
      console.error('Error fetching polls:', error);
      toast({
        title: "Error",
        description: "Failed to fetch polls",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createPoll = async (pollData: CreatePollData) => {
    if (!user) return;

    try {
      // Get the current user's member ID for this chama
      const { data: memberData, error: memberError } = await supabase
        .from('chama_members')
        .select('id')
        .eq('chama_id', pollData.chamaId)
        .eq('user_id', user.id)
        .single();

      if (memberError || !memberData) {
        throw new Error('You are not a member of this chama');
      }

      // Get total eligible voters
      const { data: votersData, error: votersError } = await supabase
        .from('chama_members')
        .select('id')
        .eq('chama_id', pollData.chamaId)
        .eq('is_active', true);

      if (votersError) throw votersError;

      const { error } = await supabase
        .from('chama_votes')
        .insert({
          chama_id: pollData.chamaId,
          title: pollData.title,
          description: pollData.description,
          vote_type: 'poll',
          deadline: pollData.deadline,
          initiated_by: memberData.id,
          status: 'active',
          yes_votes: 0,
          no_votes: 0,
          not_sure_votes: 0,
          total_eligible_voters: votersData?.length || 0
        });

      if (error) throw error;

      toast({
        title: "Poll Created",
        description: "Your poll has been created successfully",
      });

      fetchPolls(); // Refresh polls
    } catch (error: any) {
      console.error('Error creating poll:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create poll",
        variant: "destructive",
      });
    }
  };

  const vote = async (pollId: string, option: 'yes' | 'no' | 'not_sure') => {
    if (!user) return;

    try {
      // Direct insert since RPC doesn't exist
      const { data: memberData, error: memberError } = await supabase
        .from('chama_members')
        .select('id')
        .eq('chama_id', chamaId)
        .eq('user_id', user.id)
        .single();

      if (memberError || !memberData) {
        throw new Error('You are not a member of this chama');
      }

      const { error } = await supabase
        .from('vote_responses')
        .insert({
          vote_id: pollId,
          voter_id: memberData.id,
          response: option === 'yes' ? true : option === 'no' ? false : null
        });

      if (error) throw error;

      toast({
        title: "Vote Recorded",
        description: `Your vote for "${option}" has been recorded`,
      });

      fetchPolls(); // Refresh polls to show updated counts
    } catch (error: any) {
      console.error('Error voting:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to record vote",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (chamaId) {
      fetchPolls();
    }
  }, [chamaId, user]);

  return {
    polls,
    loading,
    createPoll,
    vote,
    refetch: fetchPolls,
  };
};
