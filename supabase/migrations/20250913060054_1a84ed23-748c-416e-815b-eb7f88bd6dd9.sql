-- Create missing tables for personal savings
CREATE TABLE IF NOT EXISTS public.personal_savings_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  goal_name TEXT NOT NULL,
  target_amount NUMERIC NOT NULL DEFAULT 0,
  current_amount NUMERIC NOT NULL DEFAULT 0,
  target_date DATE,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.personal_savings_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  savings_goal_id UUID,
  amount NUMERIC NOT NULL,
  transaction_type TEXT NOT NULL DEFAULT 'deposit',
  frequency TEXT NOT NULL DEFAULT 'one_time',
  payment_method TEXT NOT NULL DEFAULT 'wallet',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.personal_savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_savings_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their own savings goals" 
ON public.personal_savings_goals 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own savings transactions" 
ON public.personal_savings_transactions 
FOR ALL 
USING (auth.uid() = user_id);

-- Create the add_personal_savings function
CREATE OR REPLACE FUNCTION public.add_personal_savings(
  p_amount NUMERIC,
  p_goal_name TEXT DEFAULT NULL,
  p_frequency TEXT DEFAULT 'one_time',
  p_notes TEXT DEFAULT NULL
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_goal_id UUID;
BEGIN
  -- Get the authenticated user ID
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;

  -- If goal name is provided, find or create the goal
  IF p_goal_name IS NOT NULL THEN
    -- Try to find existing goal
    SELECT id INTO v_goal_id 
    FROM public.personal_savings_goals 
    WHERE user_id = v_user_id AND goal_name = p_goal_name;
    
    -- Create goal if it doesn't exist
    IF v_goal_id IS NULL THEN
      INSERT INTO public.personal_savings_goals (user_id, goal_name, target_amount)
      VALUES (v_user_id, p_goal_name, p_amount * 10) -- Default target is 10x the first deposit
      RETURNING id INTO v_goal_id;
    END IF;
    
    -- Update goal current amount
    UPDATE public.personal_savings_goals 
    SET current_amount = current_amount + p_amount, updated_at = now()
    WHERE id = v_goal_id;
  END IF;

  -- Add transaction record
  INSERT INTO public.personal_savings_transactions (
    user_id, savings_goal_id, amount, transaction_type, frequency, notes
  ) VALUES (
    v_user_id, v_goal_id, p_amount, 'deposit', p_frequency, p_notes
  );

  -- Add funds to wallet using existing function
  PERFORM public.add_funds_to_wallet(v_user_id, 'USD', p_amount, 'personal_savings', 'Personal savings deposit');

  RETURN TRUE;
END;
$$;