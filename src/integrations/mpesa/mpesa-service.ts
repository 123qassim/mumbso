import { supabase } from '../supabase/client';

const MPESA_AUTH_URL = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
const MPESA_STK_URL = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
const MPESA_BALANCE_URL = 'https://sandbox.safaricom.co.ke/mpesa/accountbalance/v1/query';

interface STKPushRequest {
  phoneNumber: string;
  amount: number;
  description: string;
  accountReference: string;
  transactionDesc: string;
}

interface PaymentResponse {
  success: boolean;
  message: string;
  checkoutRequestId?: string;
  responseCode?: string;
  errorMessage?: string;
}

class MpesaService {
  private consumerKey = import.meta.env.VITE_MPESA_CONSUMER_KEY;
  private consumerSecret = import.meta.env.VITE_MPESA_CONSUMER_SECRET;
  private shortcode = import.meta.env.VITE_MPESA_SHORTCODE;
  private passkey = import.meta.env.VITE_MPESA_PASSKEY;
  private environment = import.meta.env.VITE_MPESA_ENVIRONMENT;
  private callbackUrl = import.meta.env.VITE_MPESA_CALLBACK_URL;

  /**
   * Get access token from Safaricom Daraja
   */
  async getAccessToken(): Promise<string> {
    try {
      const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
      
      const response = await fetch(MPESA_AUTH_URL, {
        method: 'GET',
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get access token');
      }

      const data = await response.json() as { access_token: string };
      return data.access_token;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  }

  /**
   * Generate timestamp in format YYYYMMDDHHmmss
   */
  private getTimestamp(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}${month}${date}${hours}${minutes}${seconds}`;
  }

  /**
   * Generate password for STK Push
   */
  private generatePassword(timestamp: string): string {
    const data = `${this.shortcode}${this.passkey}${timestamp}`;
    return Buffer.from(data).toString('base64');
  }

  /**
   * Initiate STK Push for payment
   */
  async initiateSTKPush(request: STKPushRequest): Promise<PaymentResponse> {
    try {
      // Validate phone number (must be 254xxxxxxxxx format)
      let phoneNumber = request.phoneNumber.replace(/^0/, '254');
      if (!phoneNumber.startsWith('254')) {
        phoneNumber = '254' + phoneNumber;
      }

      // Get access token
      const accessToken = await this.getAccessToken();
      const timestamp = this.getTimestamp();
      const password = this.generatePassword(timestamp);

      // Prepare STK Push payload
      const payload = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(request.amount),
        PartyA: phoneNumber,
        PartyB: this.shortcode,
        PhoneNumber: phoneNumber,
        CallBackURL: this.callbackUrl,
        AccountReference: request.accountReference,
        TransactionDesc: request.transactionDesc,
      };

      // Call M-Pesa API
      const response = await fetch(MPESA_STK_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json() as {
        ResponseCode?: string;
        CheckoutRequestID?: string;
        ResponseDescription?: string;
        CustomerMessage?: string;
      };

      if (data.ResponseCode === '0') {
        // Payment initiated successfully - save to database
        await supabase.from('payments').insert({
          checkout_request_id: data.CheckoutRequestID,
          phone_number: phoneNumber,
          amount: request.amount,
          account_reference: request.accountReference,
          transaction_description: request.transactionDesc,
          payment_status: 'pending',
          payment_method: 'mpesa',
          metadata: {
            requestPayload: payload,
            initiatedAt: new Date().toISOString(),
          },
        });

        return {
          success: true,
          message: 'Payment prompt sent to your phone',
          checkoutRequestId: data.CheckoutRequestID,
          responseCode: data.ResponseCode,
        };
      }

      return {
        success: false,
        message: data.CustomerMessage || 'Failed to initiate payment',
        errorMessage: data.ResponseDescription,
      };
    } catch (error) {
      console.error('Error initiating STK Push:', error);
      return {
        success: false,
        message: 'An error occurred while initiating payment',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Check payment status
   */
  async checkPaymentStatus(checkoutRequestId: string): Promise<{
    status: 'pending' | 'completed' | 'failed' | 'cancelled';
    amount?: number;
    transactionId?: string;
  }> {
    try {
      const { data } = await supabase
        .from('payments')
        .select('payment_status, amount, transaction_id')
        .eq('checkout_request_id', checkoutRequestId)
        .single();

      if (!data) {
        return { status: 'pending' };
      }

      return {
        status: data.payment_status as 'pending' | 'completed' | 'failed' | 'cancelled',
        amount: data.amount,
        transactionId: data.transaction_id,
      };
    } catch (error) {
      console.error('Error checking payment status:', error);
      return { status: 'pending' };
    }
  }

  /**
   * Format phone number for display
   */
  formatPhoneNumber(phone: string): string {
    if (phone.startsWith('254')) {
      return `+${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
    }
    return phone;
  }
}

export const mpesaService = new MpesaService();
