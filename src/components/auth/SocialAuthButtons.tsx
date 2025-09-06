import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Chrome, Facebook } from 'lucide-react';

interface SocialAuthButtonsProps {
  onSuccess?: () => void;
  mode?: 'login' | 'signup';
}

export const SocialAuthButtons = ({ onSuccess, mode = 'login' }: SocialAuthButtonsProps) => {
  const handleSocialAuth = async (provider: 'google' | 'facebook' | 'twitter') => {
    try {
      const redirectUrl = `${window.location.origin}/auth`;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        toast.error(`${provider} authentication failed: ${error.message}`);
        return;
      }

      // OAuth will handle the redirect, so we don't call onSuccess here
      toast.success(`Redirecting to ${provider}...`);
    } catch (error: any) {
      toast.error(`${provider} authentication error: ${error.message}`);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or {mode} with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialAuth('google')}
          className="w-full"
        >
          <Chrome className="h-4 w-4 mr-2" />
          Continue with Google
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialAuth('facebook')}
          className="w-full"
        >
          <Facebook className="h-4 w-4 mr-2" />
          Continue with Facebook
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialAuth('twitter')}
          className="w-full"
        >
          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Continue with X (Twitter)
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        Note: TikTok authentication is not directly supported. For TikTok integration, 
        we recommend using TikTok's Business API after {mode === 'login' ? 'logging in' : 'signing up'}.
      </p>
    </div>
  );
};