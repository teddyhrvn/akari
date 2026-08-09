import type {
  Media,
  MediaCover,
  MediaFormat,
  MediaStatus,
  MediaTitle,
  MediaType,
} from "@/types/anime";

interface AniListMedia {
  id: number;
  type: MediaType;
  format: MediaFormat | null;
  status: MediaStatus | null;

  title: {
    romaji: string | null;
    english: string | null;
    native: string | null;
  };

  coverImage: {
    extraLarge: string | null;
    large: string | null;
    medium: string | null;
  };

  description: string | null;
  genres: string[];

  averageScore: number | null;
  popularity: number | null;

  startDate: {
    year: number | null;
    month: number | null;
    day: number | null;
  };

  endDate: {
    year: number | null;
    month: number | null;
    day: number | null;
  };

  episodes: number | null;
  chapters: number | null;
  volumes: number | null;
}

function formatDate(
  date: AniListMedia["startDate"],
): string | null {
  if (!date.year) {
    return null;
  }

  const month = date.month
    ? String(date.month).padStart(2, "0")
    : "01";

  const day = date.day
    ? String(date.day).padStart(2, "0")
    : "01";

  return `${date.year}-${month}-${day}`;
}

export function mapAniListMedia(
  media: AniListMedia,
): Media {
  const title: MediaTitle = {
    romaji: media.title.romaji,
    english: media.title.english,
    native: media.title.native,
  };

  const cover: MediaCover = {
    extraLarge: media.coverImage.extraLarge,
    large: media.coverImage.large,
    medium: media.coverImage.medium,
  };

  return {
    id: media.id,
    type: media.type,
    format: media.format,
    status: media.status,

    title,
    cover,

    description: media.description,
    genres: media.genres,

    averageScore: media.averageScore,
    popularity: media.popularity,

    startDate: formatDate(media.startDate),
    endDate: formatDate(media.endDate),

    episodes: media.episodes,
    chapters: media.chapters,
    volumes: media.volumes,
  };
}