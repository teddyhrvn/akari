import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      {
        authenticated: false,
        entries: [],
      },
      { status: 401 },
    );
  }

  const { data, error } = await supabase
    .from("media_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", {
      ascending: false,
    });

  if (error) {
    return NextResponse.json(
      {
        error:
          "Impossible de récupérer votre bibliothèque.",
      },
      { status: 500 },
    );
  }

  const entries = data ?? [];

  const counts = {
    planned: 0,
    in_progress: 0,
    completed: 0,
    paused: 0,
    dropped: 0,
  };

  for (const entry of entries) {
    if (entry.status in counts) {
      counts[
        entry.status as keyof typeof counts
      ]++;
    }
  }

  return NextResponse.json({
    authenticated: true,
    entries,
    counts,
  });
}