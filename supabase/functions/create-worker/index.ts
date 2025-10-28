import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify the requesting user is an admin
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // Check if user has admin role
    const { data: roles } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!roles || roles.role !== 'admin') {
      throw new Error('Only admins can create workers')
    }

    // Get worker details from request
    const { email, password, username } = await req.json()

    if (!email || !password || !username) {
      throw new Error('Email, password, and username are required')
    }

    // Create the auth user
    const { data: authData, error: authError2 } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        username: username
      }
    })

    if (authError2) throw authError2

    console.log('Created auth user:', authData.user.id)

    // The trigger will automatically create the profile
    // Now create the worker role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({ user_id: authData.user.id, role: 'worker' })

    if (roleError) {
      console.error('Role creation error:', roleError)
      // Try to clean up the auth user if role creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      throw roleError
    }

    console.log('Created worker role for user:', authData.user.id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        user: authData.user,
        message: 'Worker created successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error creating worker:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
