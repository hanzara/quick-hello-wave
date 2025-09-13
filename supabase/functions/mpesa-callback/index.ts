
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const callbackData = await req.json();
    console.log('M-Pesa Callback received:', JSON.stringify(callbackData, null, 2));

    const { Body } = callbackData;
    const { stkCallback } = Body;

    if (stkCallback) {
      const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = stkCallback;

      let transactionData = {
        merchant_request_id: MerchantRequestID,
        checkout_request_id: CheckoutRequestID,
        result_code: ResultCode,
        result_desc: ResultDesc,
        amount: 0,
        receipt_number: '',
        transaction_date: new Date().toISOString(),
        phone_number: '',
      };

      // If transaction was successful, extract metadata
      if (ResultCode === 0 && CallbackMetadata && CallbackMetadata.Item) {
        const items = CallbackMetadata.Item;
        
        items.forEach((item: any) => {
          switch (item.Name) {
            case 'Amount':
              transactionData.amount = item.Value;
              break;
            case 'MpesaReceiptNumber':
              transactionData.receipt_number = item.Value;
              break;
            case 'TransactionDate':
              transactionData.transaction_date = new Date(item.Value.toString()).toISOString();
              break;
            case 'PhoneNumber':
              transactionData.phone_number = item.Value.toString();
              break;
          }
        });

        // Update M-Pesa transaction record
        const { error: updateError } = await supabase
          .from('mpesa_transactions')
          .update({
            mpesa_receipt_number: transactionData.receipt_number,
            result_code: ResultCode,
            result_desc: ResultDesc,
            status: 'success',
            callback_data: callbackData,
            transaction_date: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('checkout_request_id', CheckoutRequestID);

        if (updateError) {
          console.error('Error updating M-Pesa transaction:', updateError);
        }

        // Create corresponding wallet transaction if needed
        const { data: mpesaTransaction } = await supabase
          .from('mpesa_transactions')
          .select('*')
          .eq('checkout_request_id', CheckoutRequestID)
          .single();

        if (mpesaTransaction && ResultCode === 0) {
          // Process successful payment using the database function
          const { error: walletError } = await supabase.rpc('process_mpesa_callback', {
            p_transaction_id: mpesaTransaction.id,
            p_result_code: ResultCode,
            p_result_desc: ResultDesc,
            p_mpesa_receipt_number: transactionData.receipt_number,
            p_callback_data: callbackData
          });

          if (walletError) {
            console.error('Error processing payment:', walletError);
          } else {
            console.log('Payment processed successfully');
          }
        }

      } else {
        // Failed transaction
        const { error: updateError } = await supabase
          .from('mpesa_transactions')
          .update({
            result_code: ResultCode,
            result_desc: ResultDesc,
            status: 'failed',
            callback_data: callbackData,
            updated_at: new Date().toISOString()
          })
          .eq('checkout_request_id', CheckoutRequestID);

        if (updateError) {
          console.error('Error updating failed M-Pesa transaction:', updateError);
        }
      }
    }

    return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: 'Success' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Callback processing error:', error);
    return new Response(JSON.stringify({ ResultCode: 1, ResultDesc: 'Error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function handleTransactionPurpose(supabase: any, mpesaTransaction: any, transactionData: any) {
  try {
    switch (mpesaTransaction.purpose) {
      case 'contribution':
        if (mpesaTransaction.chama_id) {
          // Record contribution
          await supabase
            .from('contributions')
            .insert({
              chama_id: mpesaTransaction.chama_id,
              member_id: mpesaTransaction.user_id,
              amount: transactionData.amount,
              contribution_date: new Date().toISOString(),
              payment_method: 'mpesa',
              reference_number: transactionData.receipt_number,
              status: 'completed'
            });

          // Update chama total savings
          await supabase.rpc('increment_chama_savings', {
            chama_id: mpesaTransaction.chama_id,
            amount: transactionData.amount
          });

          // Create activity log
          await supabase
            .from('chama_activities')
            .insert({
              chama_id: mpesaTransaction.chama_id,
              user_id: mpesaTransaction.user_id,
              activity_type: 'contribution',
              description: `Member made a contribution of KSh ${transactionData.amount}`,
              amount: transactionData.amount
            });
        }
        break;

      case 'registration':
        if (mpesaTransaction.chama_id) {
          // Join member to chama
          await supabase
            .from('chama_members')
            .insert({
              chama_id: mpesaTransaction.chama_id,
              user_id: mpesaTransaction.user_id,
              role: 'member',
              is_active: true
            });

          // Increment chama member count
          await supabase.rpc('increment_chama_members', {
            chama_id: mpesaTransaction.chama_id
          });

          // Create activity log
          await supabase
            .from('chama_activities')
            .insert({
              chama_id: mpesaTransaction.chama_id,
              user_id: mpesaTransaction.user_id,
              activity_type: 'member_joined',
              description: 'New member joined the chama',
              amount: transactionData.amount
            });
        }
        break;

      case 'loan_repayment':
        // Handle loan repayment logic
        console.log('Handling loan repayment:', transactionData);
        break;

      default:
        console.log('No specific handling for purpose:', mpesaTransaction.purpose);
    }
  } catch (error) {
    console.error('Error handling transaction purpose:', error);
  }
}
