// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gwodrrerkdyzqbmuemqc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3b2RycmVya2R5enFibXVlbXFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNjcxMTIsImV4cCI6MjA2Mzk0MzExMn0.LZnTyScJQ86Yd-DLrnLPt5WiqfW06eiaVhdmip1ciLw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);