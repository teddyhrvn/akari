import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({
      authenticated: false,
      following: false,
    });
  }

  const followingId =
    request.nextUrl.searchParams.get(
      "followingId",
    );

  if (!followingId) {
    return NextResponse.json(
      { error: "Utilisateur invalide." },
      { status: 400 },
    );
  }

  const { data } = await supabase
    .from("follows")
    .select("follower_id")
    .eq("follower_id", user.id)
    .eq("following_id", followingId)
    .maybeSingle();

  return NextResponse.json({
    authenticated: true,
    following: Boolean(data),
  });
}