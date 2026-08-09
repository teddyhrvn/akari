import { NextRequest, NextResponse } from "next/server";
import { mapAniListMedia } from "@/lib/api/anilist-mapper";

const ANILIST_API_URL = "https://graphql.anilist.co";

const MEDIA_QUERY = `
query Media($id: Int!) {
  Media(id: $id) {
    id
    idMal
    title {
      romaji
      english
      native
    }
    coverImage {
      large
      medium
      extraLarge
    }
    bannerImage
    description
    format
    status
    episodes
    chapters
    volumes
    averageScore
    genres
    season
    seasonYear
    type
    startDate {
      year
      month
      day
    }
    endDate {
      year
      month
      day
    }
    studios {
      nodes {
        name
      }
    }
  }
}
`;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const response = await fetch(ANILIST_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: MEDIA_QUERY,
        variables: { id },
      }),
      cache: "no-store", // Évite les soucis de cache agressif pendant les tests
    });

    const data = await response.json();

    if (data.errors || !data.data?.Media) {
      console.error("Erreur AniList:", data.errors);
      return NextResponse.json(
        { error: "Média non trouvé sur AniList" },
        { status: 404 }
      );
    }

    const rawMedia = data.data.Media;

    // Sécurité : si le mapper existe on l'utilise, sinon on renvoie brut
    let formattedMedia = rawMedia;
    try {
      if (typeof mapAniListMedia === "function") {
        formattedMedia = mapAniListMedia(rawMedia);
      }
    } catch (mapperError) {
      console.warn("Erreur dans mapAniListMedia, utilisation des données brutes:", mapperError);
    }

    return NextResponse.json(formattedMedia);
  } catch (error) {
    console.error("Erreur API Media:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}