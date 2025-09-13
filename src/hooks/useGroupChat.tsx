import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from './use-toast';

interface ChatMessage {
  id: string;
  chama_id: string;
  sender_id: string;
  message: string;
  sent_at: string;
  chama_members: {
    id: string;
    user_id: string;
    profiles: {
      full_name: string;
      email: string;
    };
  };
}

export const useGroupChat = (chamaId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const channelRef = useRef<any>(null);

  // Fetch existing messages
  const fetchMessages = async () => {
    if (!chamaId) return;

    console.log('=== Fetching Messages ===');
    console.log('Chama ID:', chamaId);

    try {
      const { data, error } = await supabase
        .from('chama_messages')
        .select(`
          *,
          chama_members!inner(
            id,
            user_id
          )
        `)
        .eq('chama_id', chamaId)
        .order('sent_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive",
        });
        return;
      }

      // Enrich with profiles
      const messagesList = (data || []) as Array<{ chama_members: { user_id: string } }>;
      const userIds = messagesList.map((m) => m.chama_members.user_id).filter(Boolean) as string[];
      let enrichedMessages: ChatMessage[] = [];

      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, full_name, email')
          .in('user_id', userIds);

        const profilesMap = new Map<string, any>((profiles || []).map((p) => [p.user_id, p]));
        enrichedMessages = messagesList.map((m: any) => ({ 
          ...m, 
          chama_members: { 
            ...m.chama_members, 
            profiles: profilesMap.get(m.chama_members.user_id) || { full_name: 'Unknown', email: '' }
          }
        })) as ChatMessage[];
      } else {
        enrichedMessages = messagesList.map((m: any) => ({ 
          ...m, 
          chama_members: { 
            ...m.chama_members, 
            profiles: { full_name: 'Unknown', email: '' }
          }
        })) as ChatMessage[];
      }

      console.log('Messages loaded:', enrichedMessages.length || 0);
      setMessages(enrichedMessages);
    } catch (err) {
      console.error('Unexpected error fetching messages:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading messages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Send a message
  const sendMessage = async (message: string) => {
    if (!message.trim() || !user) return;

    console.log('=== Sending Message ===');
    console.log('Message:', message);
    console.log('User ID:', user.id);

    try {
      // Get current user's member ID
      const { data: memberData, error: memberError } = await supabase
        .from('chama_members')
        .select('id')
        .eq('chama_id', chamaId)
        .eq('user_id', user.id)
        .single();

      if (memberError || !memberData) {
        console.error('Error getting member data:', memberError);
        toast({
          title: "Error",
          description: "You must be a member to send messages",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('chama_messages')
        .insert({
          chama_id: chamaId,
          sender_id: memberData.id,
          message: message.trim()
        });

      if (error) {
        console.error('Error sending message:', error);
        toast({
          title: "Error",
          description: "Failed to send message",
          variant: "destructive",
        });
      } else {
        console.log('Message sent successfully');
      }
    } catch (err) {
      console.error('Unexpected error sending message:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred while sending message",
        variant: "destructive",
      });
    }
  };

  // Set up real-time WebSocket subscription
  useEffect(() => {
    if (!chamaId) return;

    console.log('=== Setting up WebSocket connection ===');
    console.log('Chama ID:', chamaId);
    
    setConnectionStatus('connecting');
    fetchMessages();

    // Create a unique channel for this chama
    const channel = supabase
      .channel(`chama-chat-${chamaId}`, {
        config: {
          broadcast: { self: true },
          presence: { key: user?.id }
        }
      })
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chama_messages',
          filter: `chama_id=eq.${chamaId}`
        },
        async (payload) => {
          console.log('=== New message received via WebSocket ===', payload);
          
          try {
            // Fetch the complete message with sender info
            const { data } = await supabase
              .from('chama_messages')
              .select(`
                *,
                chama_members!inner(
                  id,
                  user_id
                )
              `)
              .eq('id', payload.new.id)
              .single();

            if (data) {
              console.log('Adding new message to state:', data);
              // Enrich with profile data
              const enrichedMessage = {
                ...data,
                chama_members: {
                  ...data.chama_members,
                  profiles: { full_name: 'User', email: '' }
                }
              } as ChatMessage;

              setMessages(prev => {
                // Avoid duplicates
                const exists = prev.some(msg => msg.id === enrichedMessage.id);
                if (exists) return prev;
                return [...prev, enrichedMessage];
              });
            }
          } catch (err) {
            console.error('Error fetching new message details:', err);
          }
        }
      )
      .on('broadcast', { event: 'typing' }, (payload) => {
        console.log('User typing:', payload);
        // Handle typing indicators here if needed
      })
      .subscribe((status) => {
        console.log('WebSocket subscription status:', status);
        setConnectionStatus(status === 'SUBSCRIBED' ? 'connected' : 
                          status === 'CHANNEL_ERROR' ? 'disconnected' : 'connecting');
        
        if (status === 'SUBSCRIBED') {
          toast({
            title: "Connected",
            description: "Real-time chat is now active",
          });
        } else if (status === 'CHANNEL_ERROR') {
          toast({
            title: "Connection Error",
            description: "Failed to connect to real-time chat",
            variant: "destructive",
          });
        }
      });

    channelRef.current = channel;

    return () => {
      console.log('=== Cleaning up WebSocket connection ===');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      setConnectionStatus('disconnected');
    };
  }, [chamaId, user?.id]);

  // Typing indicator function
  const sendTypingIndicator = () => {
    if (channelRef.current && user) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'typing',
        payload: { user: user.id, timestamp: new Date().toISOString() }
      });
    }
  };

  return {
    messages,
    isLoading,
    sendMessage,
    connectionStatus,
    sendTypingIndicator
  };
};