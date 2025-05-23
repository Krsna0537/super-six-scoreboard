
import { Database } from '../integrations/supabase/types';

export interface Notification {
  id: string;
  match_id: string;
  message: string;
  type: string;
  created_at: string;
  matches?: {
    team1: {
      name: string;
    };
    team2: {
      name: string;
    };
  };
}
