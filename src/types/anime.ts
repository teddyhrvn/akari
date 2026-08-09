export type MediaType = "ANIME" | "MANGA";

export type MediaFormat =
  | "TV"
  | "TV_SHORT"
  | "MOVIE"
  | "SPECIAL"
  | "OVA"
  | "ONA"
  | "MUSIC"
  | "MANGA"
  | "NOVEL"
  | "ONE_SHOT";

export type MediaStatus =
  | "FINISHED"
  | "RELEASING"
  | "NOT_YET_RELEASED"
  | "CANCELLED"
  | "HIATUS";

export interface MediaTitle {
  romaji: string | null;
  english: string | null;
  native: string | null;
}

export interface MediaCover {
  extraLarge: string | null;
  large: string | null;
  medium: string | null;
}

export interface Media {
  id: number;
  type: MediaType;
  format: MediaFormat | null;
  status: MediaStatus | null;

  title: MediaTitle;
  cover: MediaCover;

  description: string | null;

  genres: string[];

  averageScore: number | null;
  popularity: number | null;

  startDate: string | null;
  endDate: string | null;

  episodes: number | null;
  chapters: number | null;
  volumes: number | null;
}