-- Update personal savings structure to support Main Wallet and Saving Wallet concept
-- Add saving wallet balance tracking
ALTER TABLE public.user_wallets ADD COLUMN IF NOT EXISTS saving_balance NUMERIC(20,8) DEFAULT 0;

-- Add PIN authentication for transfers
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS transfer_pin_hash TEXT;

-- Create saving wallet transfers table to track Main -> Saving transfers
CREATE TABLE IF NOT EXISTS public.saving_wallet_transfers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  amount NUMERIC(20,8) NOT NULL,
  source_of_funds TEXT NOT NULL,
  saving_category TEXT NOT NULL,
  notes TEXT,
  frequency TEXT NOT NULL DEFAULT 'one_time',
  start_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on saving wallet transfers
ALTER TABLE public.saving_wallet_transfers ENABLE ROW LEVEL SECURITY;

-- Create policy for saving wallet transfers
CREATE POLICY "Users can manage their own saving transfers" 
ON public.saving_wallet_transfers 
FOR ALL 
USING (auth.uid() = user_id);

-- Create function to transfer from main wallet to saving wallet
CREATE OR REPLACE FUNCTION public.transfer_to_saving_wallet(
  p_amount NUMERIC,
  p_source_of_funds TEXT,
  p_saving_category TEXT,
  p_notes TEXT DEFAULT NULL,
  p_frequency TEXT DEFAULT 'one_time',
  p_start_date DATE DEFAULT NULL
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_main_balance NUMERIC;
BEGIN
  -- Get the authenticated user ID
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;

  -- Check main wallet balance
  SELECT balance INTO v_main_balance 
  FROM public.user_wallets 
  WHERE user_id = v_user_id;
  
  IF v_main_balance IS NULL OR v_main_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient balance in main wallet';
  END IF;

  -- Deduct from main wallet balance
  UPDATE public.user_wallets 
  SET balance = balance - p_amount, updated_at = now()
  WHERE user_id = v_user_id;
  
  -- Add to saving wallet balance
  UPDATE public.user_wallets 
  SET saving_balance = COALESCE(saving_balance, 0) + p_amount, updated_at = now()
  WHERE user_id = v_user_id;

  -- Record the transfer
  INSERT INTO public.saving_wallet_transfers (
    user_id, amount, source_of_funds, saving_category, 
    notes, frequency, start_date
  ) VALUES (
    v_user_id, p_amount, p_source_of_funds, p_saving_category,
    p_notes, p_frequency, p_start_date
  );

  -- Record in wallet transactions
  INSERT INTO public.wallet_transactions (
    user_id, amount, type, status, description, currency
  ) VALUES (
    v_user_id, p_amount, 'transfer', 'completed', 
    'Transfer to Saving Wallet: ' || p_saving_category,
    'USD'
  );

  RETURN TRUE;
END;
$$;