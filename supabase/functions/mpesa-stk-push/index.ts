import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const MPESA_AUTH_URL = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
const MPESA_STK_URL = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

interface STKPushRequest {
  phoneNumber: string;
  amount: number;
  description: string;
  accountReference: string;
  transactionDesc: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } });
  }

  try {
    const body: STKPushRequest = await req.json();
    
    // Get environment variables
    const consumerKey = Deno.env.get('VITE_MPESA_CONSUMER_KEY');
    const consumerSecret = Deno.env.get('VITE_MPESA_CONSUMER_SECRET');
    const shortcode = Deno.env.get('VITE_MPESA_SHORTCODE');
    const passkey = Deno.env.get('VITE_MPESA_PASSKEY');
    const callbackUrl = Deno.env.get('VITE_MPESA_CALLBACK_URL');

    if (!consumerKey || !consumerSecret || !shortcode || !passkey) {
      return new Response(
        JSON.stringify({ error: 'Missing M-Pesa credentials' }),
        { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // Get access token
    const auth = btoa(`${consumerKey}:${consumerSecret}`);
    const tokenResponse = await fetch(MPESA_AUTH_URL, {
      method: 'GET',
      headers: { Authorization: `Basic ${auth}` },
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to get M-Pesa access token');
    }

    const tokenData = await tokenResponse.json() as { access_token: string };
    const accessToken = tokenData.access_token;

    // Format phone number (remove +, convert to 254)
    let phoneNumber = body.phoneNumber.replace(/^\+/, '');
    if (phoneNumber.startsWith('0')) {
      phoneNumber = '254' + phoneNumber.substring(1);
    }

    // Generate timestamp
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').substring(0, 14);
    
    // Generate password: Base64(Shortcode + Passkey + Timestamp)
    const password = btoa(`${shortcode}${passkey}${timestamp}`);

    // Make STK Push request
    const stkResponse = await fetch(MPESA_STK_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.floor(body.amount),
        PartyA: phoneNumber,
        PartyB: shortcode,
        PhoneNumber: phoneNumber,
        CallBackURL: callbackUrl,
        AccountReference: body.accountReference,
        TransactionDesc: body.transactionDesc,
      }),
    });

    const stkData = await stkResponse.json();

    if (!stkResponse.ok) {
      console.error('STK Push failed:', stkData);
      return new Response(
        JSON.stringify({ error: stkData.errorMessage || 'Failed to initiate STK Push' }),
        { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // Save payment record to Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      await supabase.from('payments').insert({
        phone_number: phoneNumber,
        amount: body.amount,
        description: body.description,
        checkout_request_id: stkData.CheckoutRequestID,
        merchant_request_id: stkData.MerchantRequestID,
        status: 'pending',
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        checkoutRequestId: stkData.CheckoutRequestID,
        merchantRequestId: stkData.MerchantRequestID,
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        } 
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        } 
      }
    );
  }
});
