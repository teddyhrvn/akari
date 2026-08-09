import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Vous devez être connecté." },
      { status: 401 },
    );
  }

  const body = await request.json();
  const followingId = body.followingId;

  if (
    typeof followingId !== "string" ||
    followingId === user.id
  ) {
    return NextResponse.json(
      { error: "Utilisateur invalide." },
      { status: 400 },
    );
  }

  const { error } = await supabase
    .from("follows")
    .insert({
      follower_id: user.id,
      following_id: followingId,
    });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({
        following: true,
      });
    }

    return NextResponse.json(
      { error: "Impossible de suivre cet utilisateur." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    following: true,
  });
}

export async function DELETE(
  request: NextRequest,
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Vous devez être connecté." },
      { status: 401 },
    );
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

  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", user.id)
    .eq("following_id", followingId);

  if (error) {
    return NextResponse.json(
      { error: "Impossible de ne plus suivre cet utilisateur." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    following: false,
  });
}