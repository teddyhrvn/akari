import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ANILIST_API =
  "https://graphql.anilist.co";

const MEDIA_QUERY = `
  query Media($id: Int) {
    Media(id: $id) {
      id
      type
      title {
        romaji
        native
        english
      }
      description
      coverImage {
        large
        extraLarge
      }
      bannerImage
      genres
      status
      episodes
      chapters
      season
      seasonYear
      averageScore
    }
  }
`;

export async function POST(
  request: Request,
) {
  const body = await request.json();

  const anilistId = Number(
    body.anilistId,
  );

  if (!Number.isInteger(anilistId)) {
    return NextResponse.json(
      {
        error: "ID AniList invalide.",
      },
      { status: 400 },
    );
  }

  const response = await fetch(
    ANILIST_API,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        query: MEDIA_QUERY,

        variables: {
          id: anilistId,
        },
      }),

      cache: "no-store",
    },
  );

  if (!response.ok) {
    return NextResponse.json(
      {
        error:
          "AniList n'a pas répondu correctement.",
      },
      { status: 502 },
    );
  }

  const result = await response.json();

  const media = result?.data?.Media;

  if (!media) {
    return NextResponse.json(
      {
        error: "Œuvre introuvable sur AniList.",
      },
      { status: 404 },
    );
  }

  const supabase =
    await createClient();

  const { data, error } = await supabase
    .from("media")
    .upsert(
      {
        anilist_id: media.id,
        type: media.type,
        title:
          media.title.english ??
          media.title.romaji ??
          media.title.native,
        title_native: media.title.native,
        description: media.description,
        cover_image:
          media.coverImage?.extraLarge ??
          media.coverImage?.large ??
          null,
        banner_image: media.bannerImage,
        genres: media.genres ?? [],
        status: media.status,
        episodes: media.episodes,
        chapters: media.chapters,
        season: media.season,
        season_year: media.seasonYear,
        average_score: media.averageScore,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "anilist_id",
      },
    )
    .select()
    .single();

  if (error) {
    console.error("Erreur Supabase détaillée :", error);
    return NextResponse.json(
      {
        error: "Impossible d'enregistrer l'œuvre.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    media: data,
  });
}