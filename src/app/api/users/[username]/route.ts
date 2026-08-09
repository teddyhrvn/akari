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

  const { data: profile, error } = await supabase
    .from("profiles")
    .select(
      "id, username, display_name, avatar_url, bio, created_at",
    )
    .eq("username", username)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: "Impossible de récupérer le profil." },
      { status: 500 },
    );
  }

  if (!profile) {
    return NextResponse.json(
      { error: "Utilisateur introuvable." },
      { status: 404 },
    );
  }

  const { data: reviews } = await supabase
    .from("reviews")
    .select(
      "id, media_id, rating, content, created_at, updated_at",
    )
    .eq("user_id", profile.id)
    .order("created_at", {
      ascending: false,
    })
    .limit(20);

  const { count: followersCount } = await supabase
    .from("follows")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("following_id", profile.id);

  const { count: followingCount } = await supabase
    .from("follows")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("follower_id", profile.id);

  return NextResponse.json({
    profile,
    reviews: reviews ?? [],
    stats: {
      followers: followersCount ?? 0,
      following: followingCount ?? 0,
      reviews: reviews?.length ?? 0,
    },
  });
}