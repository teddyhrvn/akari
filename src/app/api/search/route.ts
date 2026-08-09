import { NextRequest, NextResponse } from "next/server";
import { mapAniListMedia } from "@/lib/api/anilist-mapper";

const ANILIST_API_URL = "https://graphql.anilist.co";

const SEARCH_QUERY = `
  query SearchMedia($search: String!, $type: MediaType) {
    Page(page: 1, perPage: 12) {
      media(
        search: $search
        type: $type
        sort: POPULARITY_DESC
      ) {
        id
        type
        format
        status

        title {
          romaji
          english
          native
        }

        coverImage {
          extraLarge
          large
          medium
        }

        description
        genres
        averageScore
        popularity

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

        episodes
        chapters
        volumes
      }
    }
  }
`;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const query = searchParams.get("q")?.trim();
  const type = searchParams.get("type");

  if (!query) {
    return NextResponse.json(
      { error: "Une recherche est requise." },
      { status: 400 },
    );
  }

  const mediaType =
    type === "ANIME" || type === "MANGA"
      ? type
      : undefined;

  try {
    const response = await fetch(ANILIST_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: SEARCH_QUERY,
        variables: {
          search: query,
          type: mediaType,
        },
      }),
      next: {
        revalidate: 300,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Impossible de contacter AniList." },
        { status: 502 },
      );
    }

    const data = await response.json();

    if (data.errors) {
      return NextResponse.json(
        { error: "AniList a retourné une erreur." },
        { status: 502 },
      );
    }

    const results = data.data.Page.media.map(
      mapAniListMedia,
    );

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json(
      { error: "Une erreur inattendue est survenue." },
      { status: 500 },
    );
  }
}