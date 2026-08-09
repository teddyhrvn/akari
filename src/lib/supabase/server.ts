import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log("DEBUG SUPABASE URL:", supabaseUrl ? "Présente" : "ABSENTE");
  console.log("DEBUG SUPABASE KEY:", supabaseKey ? "Présente" : "ABSENTE");

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Variables Supabase introuvables par Next.js !");
  }

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Ignoré si appelé depuis un Server Component
        }
      },
    },
  });
}