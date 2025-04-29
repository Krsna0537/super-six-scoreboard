
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// This is an edge function that creates an admin user
// It should only be run once or as needed by an authorized person

Deno.serve(async (req) => {
  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header is required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Create the user with the provided email and password
    const email = 'admin@pro2.com'
    const password = 'Krsna@18'

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers()
    const userExists = existingUser?.users.some(user => user.email === email)
    
    let userId: string

    if (userExists) {
      return new Response(
        JSON.stringify({ message: 'Admin user already exists' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    } else {
      // Create the user
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true // Skip email verification
      })

      if (error) {
        throw error
      }

      userId = data.user.id

      // Set the user role to admin in the profiles table
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', userId)

      if (profileError) {
        throw profileError
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Admin user created successfully',
        userId 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
