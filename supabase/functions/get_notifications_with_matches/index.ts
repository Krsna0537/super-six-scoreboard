import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Get the request body
    const { limit = 10, offset = 0 } = await req.json()

    // Get notifications with match details
    const { data, error } = await supabaseClient
      .from('notifications')
      .select(`
        id,
        message,
        type,
        created_at,
        match:matches (
          id,
          match_date,
          venue,
          status,
          team1:teams!matches_team1_id_fkey (
            id,
            name,
            logo_url
          ),
          team2:teams!matches_team2_id_fkey (
            id,
            name,
            logo_url
          )
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1)

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ data }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
