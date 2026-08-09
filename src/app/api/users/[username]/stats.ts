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

  const { data: profile } =
    await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .maybeSingle();

  if (!profile) {
    return NextResponse.json(
      {
        error: "Utilisateur introuvable.",
      },
      { status: 404 },
    );
  }

  const [
    reviewsResult,
    libraryResult,
    followersResult,
    followingResult,
  ] = await Promise.all([
    supabase
      .from("reviews")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("user_id", profile.id),

    supabase
      .from("media_entries")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("user_id", profile.id),

    supabase
      .from("follows")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("following_id", profile.id),

    supabase
      .from("follows")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("follower_id", profile.id),
  ]);

  return NextResponse.json({
    reviews: reviewsResult.count ?? 0,
    library: libraryResult.count ?? 0,
    followers: followersResult.count ?? 0,
    following: followingResult.count ?? 0,
  });
}