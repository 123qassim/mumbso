import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const body = await req.json()
    console.log('M-Pesa Callback Received:', JSON.stringify(body, null, 2))

    // Extract callback data
    const callbackData = body.Body?.stkCallback
    
    if (!callbackData) {
      return new Response(
        JSON.stringify({ error: 'Invalid callback data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const {
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata,
    } = callbackData

    // Determine payment status based on ResultCode
    let paymentStatus = 'failed'
    let transactionId = null
    let mpesaReceiptNumber = null
    let phoneNumber = null
    let amount = null

    if (ResultCode === 0) {
      // Payment successful
      paymentStatus = 'completed'
      
      // Extract metadata
      if (CallbackMetadata?.Item) {
        const items = CallbackMetadata.Item
        items.forEach((item: any) => {
          switch (item.Name) {
            case 'MpesaReceiptNumber':
              mpesaReceiptNumber = item.Value
              transactionId = item.Value
              break
            case 'PhoneNumber':
              phoneNumber = item.Value
              break
            case 'Amount':
              amount = item.Value
              break
          }
        })
      }
    } else if (ResultCode === 1032) {
      paymentStatus = 'cancelled'
    }

    // Update payment record
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        payment_status: paymentStatus,
        transaction_id: transactionId,
        mpesa_receipt_number: mpesaReceiptNumber,
        phone_number: phoneNumber || '',
        amount: amount || 0,
        callback_response: {
          resultCode: ResultCode,
          resultDesc: ResultDesc,
          receivedAt: new Date().toISOString(),
        },
        updated_at: new Date().toISOString(),
      })
      .eq('checkout_request_id', CheckoutRequestID)

    if (updateError) {
      console.error('Error updating payment:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update payment record' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Return success response to M-Pesa
    return new Response(
      JSON.stringify({
        ResultCode: 0,
        ResultDesc: 'Callback processed successfully',
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Callback Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
