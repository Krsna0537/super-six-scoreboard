-- Create tournament_teams table
CREATE TABLE IF NOT EXISTS tournament_teams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(tournament_id, team_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS tournament_teams_tournament_id_idx ON tournament_teams(tournament_id);
CREATE INDEX IF NOT EXISTS tournament_teams_team_id_idx ON tournament_teams(team_id);

-- Add RLS policies
ALTER TABLE tournament_teams ENABLE ROW LEVEL SECURITY;

-- Allow admins to manage tournament teams
CREATE POLICY "Admins can manage tournament teams"
    ON tournament_teams
    FOR ALL
    TO authenticated
    USING (
        auth.uid() IN (
            SELECT user_id FROM profiles WHERE role = 'admin'
        )
    )
    WITH CHECK (
        auth.uid() IN (
            SELECT user_id FROM profiles WHERE role = 'admin'
        )
    );

-- Allow users to view tournament teams
CREATE POLICY "Users can view tournament teams"
    ON tournament_teams
    FOR SELECT
    TO authenticated
    USING (true); 