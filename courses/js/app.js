const { createClient } = supabase;

const SUPABASE_URL = "https://wdpekgcqmwpvbfyonjih.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

window.supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// optional helper
async function initAuth() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}
