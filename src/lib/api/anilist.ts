import { mapAniListMedia } from "./anilist-mapper";
import { Media } from "@/types/anime";

const ANILIST_API_URL = "https://graphql.anilist.co";

const SEARCH_QUERY = `
query ($search: String, $type: MediaType, $perPage: Int) {
  Page (perPage: $perPage) {
    media (search: $search, type: $type, sort: [POPULARITY_DESC]) {
      id
      idMal
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

const DETAIL_QUERY = `
query ($id: Int) {
  Media (id: $id) {
    id
    idMal
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
    bannerImage
    description
    genres
    averageScore
    popularity
    seasonYear
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
`;

export async function searchAniListMedia(searchQuery?: string, type?: "ANIME" | "MANGA", limit = 24): Promise<Media[]> {
  const variables: Record<string, any> = {
    perPage: limit,
  };

  if (searchQuery) {
    variables.search = searchQuery;
  }
  if (type) {
    variables.type = type;
  }

  try {
    const response = await fetch(ANILIST_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        query: SEARCH_QUERY,
        variables,
      }),
      next: { revalidate: 3600 },
    });

    const json = await response.json();
    const rawMediaList = json?.data?.Page?.media ?? [];

    return rawMediaList.map((item: any) => mapAniListMedia(item));
  } catch (error) {
    console.error("Erreur lors de la récupération depuis AniList:", error);
    return [];
  }
}

export async function getAniListMediaById(id: number): Promise<Media | null> {
  try {
    const response = await fetch(ANILIST_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        query: DETAIL_QUERY,
        variables: { id },
      }),
      next: { revalidate: 3600 },
    });

    const json = await response.json();
    const rawMedia = json?.data?.Media;

    if (!rawMedia) return null;

    return mapAniListMedia(rawMedia);
  } catch (error) {
    console.error("Erreur lors de la récupération de la fiche AniList:", error);
    return null;
  }
}