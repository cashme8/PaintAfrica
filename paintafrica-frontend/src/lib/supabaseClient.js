import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // We don't throw here so the app can still boot and render UI before
  // Supabase credentials are added to .env — but auth calls will fail
  // until VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are set.
  console.warn(
    "[PaintAfrica] Supabase env vars are missing. Copy .env.example to .env and fill in your project's URL/anon key."
  );
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);
