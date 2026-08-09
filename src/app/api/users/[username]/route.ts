import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{
    username: string;
  }>;
}

export async function GET(
  request: Request,
  context: RouteContext,
) {
  const { username } = await context.params;

  const supabase = await createClient();

  const { data: profile, error } =
    await supabase
      .from("profiles")
      .select(`
        id,
        username,
        display_name,
        avatar_url,
        bio,
        banner_url,
        location,
        website_url,
        favorite_quote,
        profile_color,
        is_private
      `)
      .eq("username", username)
      .maybeSingle();

  if (error) {
    return NextResponse.json(
      {
        error:
          "Impossible de récupérer le profil.",
      },
      { status: 500 },
    );
  }

  if (!profile) {
    return NextResponse.json(
      {
        error: "Utilisateur introuvable.",
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    profile,
  });
}