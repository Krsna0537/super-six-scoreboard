// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://cgkafftlrnldvtrbrjcb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNna2FmZnRscm5sZHZ0cmJyamNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NTY0MTIsImV4cCI6MjA2MTQzMjQxMn0.l6wEJdBIu_LLkRpIiqLcmjz_dC4VkG1EU1_2PL994z0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);