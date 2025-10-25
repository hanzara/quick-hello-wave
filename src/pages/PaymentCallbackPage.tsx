import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PaymentCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [message, setMessage] = useState('Verifying your payment...');
  const [amount, setAmount] = useState<number>(0);

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 20; // Try webhook for 40 seconds
    const maxManualAttempts = 5; // Then try manual verification for 10 seconds
    let isManualVerification = false;
    
    const verifyPayment = async () => {
      const reference = searchParams.get('reference');
      
      if (!reference) {
        setStatus('failed');
        setMessage('Invalid payment reference');
        return;
      }

      try {
        attempts++;
        
        if (!isManualVerification) {
          console.log(`Verifying payment (webhook) attempt ${attempts}/${maxAttempts} for reference:`, reference);
          setMessage(`Verifying payment via webhook... (${attempts}/${maxAttempts})`);
        } else {
          console.log(`Manual verification attempt ${attempts - maxAttempts}/${maxManualAttempts} for reference:`, reference);
          setMessage(`Checking with payment provider... (${attempts - maxAttempts}/${maxManualAttempts})`);
        }
        
        // Check transaction status in database
        const { data: transaction, error } = await supabase
          .from('mpesa_transactions')
          .select('amount, status, result_desc, transaction_type, purpose, id')
          .eq('checkout_request_id', reference)
          .single();

        if (error) {
          console.error('Error fetching transaction:', error);
          
          // Switch to manual verification after initial attempts
          if (attempts >= maxAttempts && !isManualVerification) {
            isManualVerification = true;
            attempts = maxAttempts; // Reset counter for manual attempts
            console.log('Switching to manual payment verification...');
            setMessage('Webhook delayed, verifying directly with Paystack...');
            setTimeout(() => verifyPayment(), 1000);
            return;
          }
          
          if (attempts < maxAttempts + maxManualAttempts) {
            setTimeout(() => verifyPayment(), 2000);
            return;
          }
          
          setStatus('failed');
          setMessage('Payment verification failed. Please check your wallet or contact support if amount was deducted.');
          return;
        }

        console.log('Transaction status:', transaction.status, 'Type:', transaction.transaction_type);
        
        if (transaction.status === 'success') {
          const platformFee = transaction.amount * 0.025;
          const netAmount = transaction.amount - platformFee;
          
          setStatus('success');
          setAmount(netAmount);
          setMessage(`Payment successful! KES ${netAmount.toFixed(2)} has been added to your wallet.`);
          
          toast({
            title: "✅ Payment Successful",
            description: `KES ${netAmount.toFixed(2)} added to wallet (Fee: KES ${platformFee.toFixed(2)})`,
            duration: 8000,
          });
        } else if (transaction.status === 'failed') {
          setStatus('failed');
          setMessage(transaction.result_desc || 'Payment failed. Please try again.');
        } else {
          // Still pending - try manual verification after webhook attempts
          if (attempts >= maxAttempts && !isManualVerification) {
            isManualVerification = true;
            attempts = maxAttempts;
            console.log('Webhook not responding, attempting manual verification with Paystack...');
            
            // Call Paystack verification endpoint
            try {
              const { data: verifyData, error: verifyError } = await supabase.functions.invoke('paystack-integration', {
                body: {
                  action: 'verify',
                  reference: reference,
                }
              });

              console.log('Manual verification response:', verifyData);
              
              if (verifyData?.success && verifyData?.data?.status === 'success') {
                // Payment was successful, manually trigger credit
                console.log('Payment verified successfully, triggering manual credit...');
                const { data: creditData, error: creditError } = await supabase.functions.invoke('manual-credit-payment', {
                  body: { reference }
                });
                
                console.log('Manual credit response:', creditData);
                
                // Re-check transaction status after manual credit
                setTimeout(() => verifyPayment(), 2000);
                return;
              } else if (verifyData?.data?.status === 'failed') {
                setStatus('failed');
                setMessage(verifyData?.data?.gateway_response || 'Payment failed at provider.');
                return;
              }
            } catch (verifyErr) {
              console.error('Manual verification error:', verifyErr);
            }
            
            // Continue polling
            setTimeout(() => verifyPayment(), 2000);
            return;
          }
          
          if (attempts < maxAttempts + maxManualAttempts) {
            setTimeout(() => verifyPayment(), 2000);
          } else {
            // Final timeout
            setStatus('failed');
            setMessage('Payment verification timed out. Your payment may still be processing. Please check your wallet in a few minutes or contact support if amount was deducted.');
          }
        }
      } catch (err) {
        console.error('Verification error:', err);
        
        if (attempts < maxAttempts + maxManualAttempts) {
          setTimeout(() => verifyPayment(), 2000);
          return;
        }
        
        setStatus('failed');
        setMessage('An error occurred during verification. Please check your wallet or contact support.');
      }
    };

    verifyPayment();
  }, [searchParams, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === 'verifying' && (
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
            )}
            {status === 'success' && (
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            )}
            {status === 'failed' && (
              <XCircle className="h-16 w-16 text-destructive" />
            )}
          </div>
          <CardTitle>
            {status === 'verifying' && 'Verifying Payment'}
            {status === 'success' && 'Payment Successful'}
            {status === 'failed' && 'Payment Failed'}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
          {status === 'success' && amount > 0 && (
            <p className="text-2xl font-bold text-primary mt-4">
              KES {amount.toFixed(2)}
            </p>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {status !== 'verifying' && (
            <>
              <Button onClick={() => navigate('/dashboard')} className="w-full">
                Go to Dashboard
              </Button>
              <Button variant="outline" onClick={() => navigate('/')} className="w-full">
                Go to Home
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCallbackPage;
