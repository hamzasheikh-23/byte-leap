import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://iroydhbhtvkztvacwvur.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_tvDxoRa6bSQBPbtM84C9yw_2XQSUumS";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing inside environmental parameters. Falling back to hardcoded keys.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
