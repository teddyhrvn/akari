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
        error: "Non authentifié.",
      },
      { status: 401 },
    );
  }

  const { data, error } =
    await supabase
      .from("profiles")
      .select(`
        username,
        display_name,
        avatar_url,
        bio,
        banner_url,
        location,
        website_url,
        favorite_quote,
        profile_color
      `)
      .eq("id", user.id)
      .single();

  if (error) {
    return NextResponse.json(
      {
        error:
          "Impossible de récupérer le profil.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    profile: data,
  });
}

export async function PATCH(
  request: Request,
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      {
        error: "Non authentifié.",
      },
      { status: 401 },
    );
  }

  const body = await request.json();

  const {
    display_name,
    bio,
    avatar_url,
    banner_url,
    location,
    website_url,
    favorite_quote,
    profile_color,
  } = body;

  const { data, error } =
    await supabase
      .from("profiles")
      .update({
        display_name,
        bio,
        avatar_url,
        banner_url,
        location,
        website_url,
        favorite_quote,
        profile_color,
      })
      .eq("id", user.id)
      .select()
      .single();

  if (error) {
    return NextResponse.json(
      {
        error:
          "Impossible de mettre à jour le profil.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    profile: data,
  });
}