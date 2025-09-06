import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  email_verified: boolean;
  phone_verified: boolean;
  provider: string;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user, session } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, create one
          await createProfile();
        } else {
          console.error('Error fetching profile:', error);
          toast.error('Failed to load profile');
        }
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
          avatar_url: user.user_metadata?.avatar_url || '',
          provider: user.app_metadata?.provider || 'email',
          email_verified: user.email_confirmed_at !== null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        toast.error('Failed to create profile');
      } else {
        setProfile(data);
        toast.success('Profile created successfully');
      }
    } catch (error) {
      console.error('Error in createProfile:', error);
    }
  };

  const updateProfile = async (updates: Partial<Omit<UserProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    if (!user || !profile) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        toast.error('Failed to update profile');
        return false;
      }

      setProfile(data);
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      toast.error('Failed to update profile');
      return false;
    }
  };

  const resendEmailVerification = async () => {
    if (!user?.email) {
      toast.error('No email address found');
      return;
    }

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
        },
      });

      if (error) {
        toast.error('Failed to send verification email');
      } else {
        toast.success('Verification email sent! Check your inbox.');
      }
    } catch (error) {
      toast.error('Failed to send verification email');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  // Listen for auth state changes to update profile
  useEffect(() => {
    if (session && user && !loading && !profile) {
      fetchProfile();
    }
  }, [session, user, loading, profile]);

  return {
    profile,
    loading,
    updateProfile,
    resendEmailVerification,
    refetchProfile: fetchProfile,
  };
};