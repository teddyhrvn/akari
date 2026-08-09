import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const VALID_STATUSES = [
  "planned",
  "in_progress",
  "completed",
  "paused",
  "dropped",
] as const;

type MediaStatus =
  (typeof VALID_STATUSES)[number];

export async function GET(
  request: NextRequest,
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      {
        authenticated: false,
        entry: null,
      },
    );
  }

  const mediaId = Number(
    request.nextUrl.searchParams.get("mediaId"),
  );

  if (!Number.isInteger(mediaId)) {
    return NextResponse.json(
      { error: "Œuvre invalide." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("media_entries")
    .select("*")
    .eq("user_id", user.id)
    .eq("media_id", mediaId) // Corrigé en media_id
    .maybeSingle();

  if (error) {
    console.error("Erreur GET media-status:", error.message);
    return NextResponse.json(
      {
        error:
          "Impossible de récupérer le statut.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    authenticated: true,
    entry: data,
  });
}

export async function POST(
  request: NextRequest,
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      {
        error: "Vous devez être connecté.",
      },
      { status: 401 },
    );
  }

  const body = await request.json();

  const mediaId = Number(body.mediaId);
  const status = body.status as MediaStatus;

  if (!Number.isInteger(mediaId)) {
    return NextResponse.json(
      { error: "Œuvre invalide." },
      { status: 400 },
    );
  }

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: "Statut invalide." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("media_entries")
    .upsert(
      {
        user_id: user.id,
        media_id: mediaId, // Corrigé en media_id
        status,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,media_id", // Corrigé en user_id,media_id
      },
    )
    .select()
    .single();

  if (error) {
    console.error("Erreur POST media-status:", error.message);
    return NextResponse.json(
      {
        error:
          "Impossible d'enregistrer le statut.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    entry: data,
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
      {
        error: "Vous devez être connecté.",
      },
      { status: 401 },
    );
  }

  const mediaId = Number(
    request.nextUrl.searchParams.get("mediaId"),
  );

  if (!Number.isInteger(mediaId)) {
    return NextResponse.json(
      { error: "Œuvre invalide." },
      { status: 400 },
    );
  }

  const { error } = await supabase
    .from("media_entries")
    .delete()
    .eq("user_id", user.id)
    .eq("media_id", mediaId); // Corrigé en media_id

  if (error) {
    console.error("Erreur DELETE media-status:", error.message);
    return NextResponse.json(
      {
        error:
          "Impossible de retirer l'œuvre de votre liste.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
  });
}