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
        activities: [],
      },
      { status: 401 },
    );
  }

  const { data: follows, error: followsError } =
    await supabase
      .from("follows")
      .select("following_id")
      .eq("follower_id", user.id);

  if (followsError) {
    return NextResponse.json(
      { error: "Impossible de récupérer votre feed." },
      { status: 500 },
    );
  }

  const followingIds =
    follows?.map(
      (follow) => follow.following_id,
    ) ?? [];

  if (followingIds.length === 0) {
    return NextResponse.json({
      authenticated: true,
      activities: [],
    });
  }

  const { data: reviews, error } =
    await supabase
      .from("reviews")
      .select(`
        id,
        media_id,
        rating,
        content,
        created_at,
        profiles (
          id,
          username,
          display_name,
          avatar_url
        )
      `)
      .in("user_id", followingIds)
      .order("created_at", {
        ascending: false,
      })
      .limit(50);

  if (error) {
    return NextResponse.json(
      { error: "Impossible de récupérer votre feed." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    authenticated: true,
    activities: reviews ?? [],
  });
}