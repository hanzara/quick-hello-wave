import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization') || req.headers.get('authorization') || '';

    console.log('Sync balance request received');
    console.log('Auth header present:', !!authHeader);

    // Parse request body
    let body: any = null;
    try {
      body = await req.json();
    } catch (_) {
      // no body provided
    }

    console.log('Body user_id:', body?.user_id);

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Try to get user from auth
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    console.log('Auth user:', user?.id);
    console.log('Auth error:', userError);

    // Helper to extract user ID from JWT
    const getUserIdFromJWT = (header: string): string | null => {
      try {
        const token = header?.startsWith('Bearer ') ? header.split(' ')[1] : header;
        if (!token) return null;
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.sub || payload.user_id || null;
      } catch (e) {
        console.error('JWT decode error:', e);
        return null;
      }
    };

    const userId = user?.id ?? getUserIdFromJWT(authHeader) ?? body?.user_id;

    console.log('Final userId:', userId);

    if (!userId) {
      throw new Error('Unauthorized: No user ID found');
    }

    // Create service role client for database operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get current wallet balance
    const { data: currentWallet, error: walletError } = await supabaseAdmin
      .from('user_central_wallets')
      .select('balance')
      .eq('user_id', userId)
      .maybeSingle();

    if (walletError) {
      console.error('Error fetching wallet:', walletError);
      throw new Error('Failed to fetch wallet balance');
    }

    const currentBalance = currentWallet?.balance || 0;

    // Get ALL successful deposits from ALL sources (M-Pesa, Paystack, Airtel Money, etc.)
    // Check wallet_transactions for all deposit types
    const { data: allDeposits, error: depositsError } = await supabaseAdmin
      .from('wallet_transactions')
      .select('amount')
      .eq('user_id', userId)
      .eq('transaction_type', 'deposit')
      .eq('status', 'completed');

    if (depositsError) {
      console.error('Error fetching all deposits:', depositsError);
    }

    // Also get M-Pesa transactions (legacy support)
    const { data: mpesaDeposits, error: mpesaError } = await supabaseAdmin
      .from('mpesa_transactions')
      .select('amount')
      .eq('user_id', userId)
      .eq('status', 'success')
      .eq('purpose', 'deposit');

    if (mpesaError) {
      console.error('Error fetching M-Pesa deposits:', mpesaError);
    }

    const walletDeposits = allDeposits?.reduce((sum, tx) => sum + (tx.amount || 0), 0) || 0;
    const mpesaDepositTotal = mpesaDeposits?.reduce((sum, tx) => sum + (tx.amount || 0), 0) || 0;
    const totalDeposits = walletDeposits + mpesaDepositTotal;
    
    console.log('Wallet deposits:', walletDeposits);
    console.log('M-Pesa deposits:', mpesaDepositTotal);

    // Get sum of all successful withdrawals
    const { data: withdrawals, error: withdrawalsError } = await supabaseAdmin
      .from('wallet_transactions')
      .select('amount')
      .eq('user_id', userId)
      .eq('transaction_type', 'withdrawal')
      .eq('status', 'completed');

    if (withdrawalsError) {
      console.error('Error fetching withdrawals:', withdrawalsError);
    }

    const totalWithdrawals = withdrawals?.reduce((sum, tx) => sum + Math.abs(tx.amount || 0), 0) || 0;

    // Calculate expected balance
    const expectedBalance = totalDeposits - totalWithdrawals;

    console.log('Current balance:', currentBalance);
    console.log('Total deposits:', totalDeposits);
    console.log('Total withdrawals:', totalWithdrawals);
    console.log('Expected balance:', expectedBalance);

    // Update wallet to ensure it's accurate
    const { error: updateError } = await supabaseAdmin
      .from('user_central_wallets')
      .upsert({
        user_id: userId,
        balance: expectedBalance,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      });

    if (updateError) {
      console.error('Error updating wallet:', updateError);
      throw new Error('Failed to update wallet balance');
    }

    // Log the sync for audit trail
    await supabaseAdmin.from('audit_logs').insert({
      user_id: userId,
      action: 'wallet_balance_sync',
      resource_type: 'wallet',
      resource_id: userId,
      new_values: { 
        balance: expectedBalance,
        deposits: totalDeposits,
        withdrawals: totalWithdrawals
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        balance: expectedBalance,
        details: {
          deposits: totalDeposits,
          withdrawals: totalWithdrawals,
          current: currentBalance,
          synced: expectedBalance
        },
        currency: 'KES',
        synced_at: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Paystack balance sync error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
