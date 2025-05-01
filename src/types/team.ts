
import { Database } from '../integrations/supabase/types';

export interface Team {
  id: string;
  name: string;
  logo_url: string | null;
  created_at: string | null;
  updated_at: string | null;
  captain_id: string | null;
  vice_captain_id: string | null;
  wicket_keeper_id: string | null;
  description: string | null;
}

export interface Player {
  id: string;
  profile_id: string;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
  };
}
