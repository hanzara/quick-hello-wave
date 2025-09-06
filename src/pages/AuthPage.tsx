import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { SecureLoginForm } from '@/components/auth/SecureLoginForm';
import { SecureSignupForm } from '@/components/auth/SecureSignupForm';
import { ProfileVerification } from '@/components/ProfileVerification';

type AuthStep = 'login' | 'signup' | 'verification';

export const AuthPage = () => {
  const [currentStep, setCurrentStep] = useState<AuthStep>('login');
  const [showVerification, setShowVerification] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleLoginSuccess = () => {
    // Show verification page for new or unverified users
    if (user && !user.email_confirmed_at) {
      setShowVerification(true);
    } else {
      navigate('/dashboard');
    }
  };

  const handleSignupSuccess = () => {
    setShowVerification(true);
  };

  const handleVerificationComplete = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        {showVerification ? (
          <div className="space-y-4">
            <ProfileVerification />
            <div className="text-center">
              <button
                onClick={handleVerificationComplete}
                className="text-sm text-primary hover:underline"
              >
                Continue to Dashboard
              </button>
            </div>
          </div>
        ) : currentStep === 'login' ? (
          <SecureLoginForm
            onSuccess={handleLoginSuccess}
            onSwitchToSignup={() => setCurrentStep('signup')}
          />
        ) : (
          <SecureSignupForm
            onSuccess={handleSignupSuccess}
            onSwitchToLogin={() => setCurrentStep('login')}
          />
        )}
      </div>
    </div>
  );
};