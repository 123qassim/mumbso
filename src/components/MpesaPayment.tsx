import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { mpesaService } from '@/integrations/mpesa/mpesa-service';

interface MpesaPaymentProps {
  amount: number;
  description: string;
  onPaymentSuccess?: () => void;
}

export const MpesaPayment = ({
  amount,
  description,
  onPaymentSuccess,
}: MpesaPaymentProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    'idle' | 'processing' | 'success' | 'error'
  >('idle');
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      // Validate phone number
      if (!phoneNumber || phoneNumber.length < 9) {
        throw new Error('Please enter a valid phone number');
      }

      // Initiate STK Push
      const response = await mpesaService.initiateSTKPush({
        phoneNumber,
        amount,
        description,
        accountReference: `MUMBSO-${Date.now()}`,
        transactionDesc: description,
      });

      if (response.success && response.checkoutRequestId) {
        setPaymentStatus('success');
        setCheckoutRequestId(response.checkoutRequestId);
        toast.success('Payment prompt sent! Check your phone to complete the payment.');
        
        // Poll for payment status
        pollPaymentStatus(response.checkoutRequestId);
      } else {
        throw new Error(response.errorMessage || response.message);
      }
    } catch (error) {
      setPaymentStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Payment failed');
      toast.error('Payment initiation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const pollPaymentStatus = async (requestId: string) => {
    let attempts = 0;
    const maxAttempts = 30; // Poll for up to 5 minutes

    const poll = async () => {
      try {
        const status = await mpesaService.checkPaymentStatus(requestId);

        if (status.status === 'completed') {
          setPaymentStatus('success');
          toast.success('Payment received! Thank you for your support.');
          onPaymentSuccess?.();
        } else if (status.status === 'failed' || status.status === 'cancelled') {
          setPaymentStatus('error');
          setErrorMessage('Payment was declined or cancelled');
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(poll, 10000); // Poll every 10 seconds
        }
      } catch (error) {
        console.error('Error polling payment status:', error);
      }
    };

    poll();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>M-Pesa Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePayment} className="space-y-6">
          {/* Amount Display */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Amount to Pay</p>
            <p className="text-3xl font-bold text-primary">{amount} KES</p>
          </div>

          {/* Description */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Description</p>
            <p className="font-medium">{description}</p>
          </div>

          {/* Phone Number Input */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              placeholder="0712345678 or +254712345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isLoading}
              pattern="[0-9\+]+"
              required
            />
            <p className="text-xs text-muted-foreground">
              Enter your M-Pesa registered phone number
            </p>
          </div>

          {/* Status Messages */}
          {paymentStatus === 'success' && (
            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg flex gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Payment prompt sent!
                </p>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                  Check your phone and enter your M-Pesa PIN to complete the payment
                </p>
              </div>
            </div>
          )}

          {paymentStatus === 'error' && (
            <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  Payment Failed
                </p>
                <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                  {errorMessage}
                </p>
              </div>
            </div>
          )}

          {paymentStatus === 'processing' && (
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg flex gap-3">
              <Loader className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5 animate-spin" />
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Processing...
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  Initiating payment. Please wait...
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="hero"
            size="lg"
            className="w-full"
            disabled={isLoading || paymentStatus === 'success'}
          >
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : paymentStatus === 'success' ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Payment Initiated
              </>
            ) : (
              `Pay ${amount} KES via M-Pesa`
            )}
          </Button>

          {/* Info */}
          <p className="text-xs text-muted-foreground text-center">
            You will receive an M-Pesa prompt on your registered phone number
          </p>
        </form>
      </CardContent>
    </Card>
  );
};
