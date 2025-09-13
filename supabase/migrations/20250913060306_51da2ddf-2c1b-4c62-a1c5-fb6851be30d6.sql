-- Create the add_personal_savings function if it doesn't exist
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

  -- Add to wallet_transactions with correct type
  INSERT INTO public.wallet_transactions (
    user_id, amount, type, status, description, currency
  ) VALUES (
    v_user_id, p_amount, 'deposit', 'completed', 
    CASE 
      WHEN p_goal_name IS NOT NULL THEN 'Personal savings: ' || p_goal_name
      ELSE 'Personal savings deposit'
    END,
    'USD'
  );

  -- Update user wallet balance
  INSERT INTO public.user_wallets (user_id, balance)
  VALUES (v_user_id, p_amount)
  ON CONFLICT (user_id)
  DO UPDATE SET balance = user_wallets.balance + p_amount, updated_at = now();

  RETURN TRUE;
END;
$$;