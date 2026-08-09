import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const mediaRef = Number(
    request.nextUrl.searchParams.get("mediaId"),
  );

  if (!Number.isInteger(mediaRef)) {
    return NextResponse.json(
      { error: "Œuvre invalide." },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reviews")
    .select(`
      id,
      media_id,
      rating,
      content,
      created_at,
      updated_at,
      profiles (
        id,
        username,
        display_name,
        avatar_url
      )
    `)
    .eq("media_id", mediaRef)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("Erreur Supabase GET reviews:", error.message);
    return NextResponse.json(
      { error: "Impossible de récupérer les avis." },
      { status: 500 },
    );
  }

  const reviews = data ?? [];

  const average =
    reviews.length > 0
      ? reviews.reduce(
          (total, review) => total + Number(review.rating),
          0,
        ) / reviews.length
      : null;

  return NextResponse.json({
    reviews,
    stats: {
      count: reviews.length,
      average,
    },
  });
}

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

  const mediaId = Number(body.mediaRef);
  const rating = Number(body.rating);
  const content =
    typeof body.content === "string"
      ? body.content.trim()
      : null;

  if (!Number.isInteger(mediaId)) {
    return NextResponse.json(
      { error: "Œuvre invalide." },
      { status: 400 },
    );
  }

  if (
    !Number.isFinite(rating) ||
    rating < 0.5 ||
    rating > 5 ||
    rating * 2 !== Math.floor(rating * 2)
  ) {
    return NextResponse.json(
      { error: "La note doit être comprise entre 0,5 et 5." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("reviews")
    .upsert(
      {
        user_id: user.id,
        media_id: mediaId, // Utilisation de la bonne colonne de la BDD
        rating,
        content,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,media_id", // Correspondance avec la contrainte unique de la table
      },
    )
    .select()
    .single();

  if (error) {
    console.error("Erreur Supabase POST reviews:", error.message);
    return NextResponse.json(
      { error: "Impossible d'enregistrer votre avis." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    review: data,
  });
}

export async function DELETE(request: NextRequest) {
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

  const mediaRef = Number(
    request.nextUrl.searchParams.get("mediaId"),
  );

  if (!Number.isInteger(mediaRef)) {
    return NextResponse.json(
      { error: "Œuvre invalide." },
      { status: 400 },
    );
  }

  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("user_id", user.id)
    .eq("media_id", mediaRef);

  if (error) {
    console.error("Erreur Supabase DELETE reviews:", error.message);
    return NextResponse.json(
      { error: "Impossible de supprimer votre avis." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
  });
}