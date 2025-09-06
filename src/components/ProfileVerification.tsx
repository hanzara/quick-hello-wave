import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Mail, Phone, Shield } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';

export const ProfileVerification = () => {
  const { profile, resendEmailVerification } = useProfile();
  const { user } = useAuth();
  const [isResending, setIsResending] = useState(false);

  if (!profile || !user) return null;

  const handleResendEmail = async () => {
    setIsResending(true);
    await resendEmailVerification();
    setIsResending(false);
  };

  const verificationItems = [
    {
      title: 'Email Verification',
      description: 'Verify your email address to secure your account',
      verified: profile.email_verified || user.email_confirmed_at !== null,
      icon: Mail,
      action: !profile.email_verified && (
        <Button 
          onClick={handleResendEmail} 
          disabled={isResending}
          size="sm"
          variant="outline"
        >
          {isResending ? 'Sending...' : 'Resend Email'}
        </Button>
      ),
    },
    {
      title: 'Phone Verification',
      description: 'Add and verify your phone number for additional security',
      verified: profile.phone_verified,
      icon: Phone,
      action: !profile.phone_verified && (
        <Button size="sm" variant="outline">
          Add Phone
        </Button>
      ),
    },
    {
      title: 'Social Account',
      description: `Connected via ${profile.provider}`,
      verified: profile.provider !== 'email',
      icon: Shield,
      action: null,
    },
  ];

  const completedVerifications = verificationItems.filter(item => item.verified).length;
  const totalVerifications = verificationItems.length;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Account Verification
        </CardTitle>
        <CardDescription>
          Complete verification to secure your account and unlock all features
        </CardDescription>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedVerifications / totalVerifications) * 100}%` }}
            />
          </div>
          <span className="text-sm text-muted-foreground">
            {completedVerifications}/{totalVerifications} Complete
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!profile.email_verified && !user.email_confirmed_at && (
          <Alert>
            <Mail className="h-4 w-4" />
            <AlertDescription>
              Please verify your email address to secure your account and enable all features.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          {verificationItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${item.verified ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  <item.icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{item.title}</h4>
                    <Badge variant={item.verified ? 'default' : 'secondary'}>
                      {item.verified ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 mr-1" />
                      )}
                      {item.verified ? 'Verified' : 'Pending'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
              {item.action}
            </div>
          ))}
        </div>

        {completedVerifications === totalVerifications && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              🎉 Your account is fully verified! You have access to all features.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};