
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// This is an edge function that creates an admin user
// It should only be run once or as needed by an authorized person

Deno.serve(async (req) => {
  try {
    // Add CORS headers for browser compatibility
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Content-Type': 'application/json'
    };
    
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders, status: 204 });
    }

    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Default admin credentials
    const defaultCredentials = {
      email: 'admin@pro2.com',
      password: 'Krsna@18',
      first_name: 'Admin',
      last_name: 'User'
    };

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers()
    const userExists = existingUser?.users?.some(user => user.email === defaultCredentials.email)

    if (userExists) {
      return new Response(
        JSON.stringify({ error: 'User already exists' }),
        { status: 400, headers: corsHeaders }
      )
    }

    // Create the user
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: defaultCredentials.email,
      password: defaultCredentials.password,
      email_confirm: true,
      user_metadata: {
        first_name: defaultCredentials.first_name,
        last_name: defaultCredentials.last_name
      }
    })

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: corsHeaders }
      )
    }

    // Update the profile to set role as admin
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', data.user.id)

    if (profileError) {
      return new Response(
        JSON.stringify({ error: profileError.message }),
        { status: 400, headers: corsHeaders }
      )
    }

    console.log("Admin user created successfully:", data.user.id);

    return new Response(
      JSON.stringify({ message: 'Admin user created successfully' }),
      { status: 200, headers: corsHeaders }
    )
  } catch (error) {
    console.error("Error creating admin user:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
          'Content-Type': 'application/json'
        } 
      }
    )
  }
})
