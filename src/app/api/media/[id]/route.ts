import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: Request,
  context: RouteContext,
) {
  const { id } = await context.params;
  const mediaId = Number(id);

  if (!Number.isInteger(mediaId)) {
    return NextResponse.json(
      { error: "Œuvre invalide." },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  // On cherche par anilist_id car l'URL utilise l'ID AniList (ex: 154587)
  const { data, error } = await supabase
    .from("media")
    .select("*")
    .eq("anilist_id", mediaId)
    .maybeSingle();

  if (error) {
    console.error("Erreur Supabase :", error);
    return NextResponse.json(
      { error: "Impossible de récupérer l'œuvre." },
      { status: 500 },
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "Œuvre introuvable." },
      { status: 404 },
    );
  }

  return NextResponse.json({
    media: data,
  });
}