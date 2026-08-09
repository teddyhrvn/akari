export const MEDIA_TYPES = {
  ANIME: "ANIME",
  MANGA: "MANGA",
} as const;

export type MediaType =
  (typeof MEDIA_TYPES)[keyof typeof MEDIA_TYPES];

export const MEDIA_STATUSES = {
  PLANNED: "planned",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  PAUSED: "paused",
  DROPPED: "dropped",
} as const;

export type MediaUserStatus =
  (typeof MEDIA_STATUSES)[keyof typeof MEDIA_STATUSES];

export const MEDIA_STATUS_LABELS: Record<
  MediaUserStatus,
  string
> = {
  planned: "À voir / À lire",
  in_progress: "En cours",
  completed: "Terminé",
  paused: "En pause",
  dropped: "Abandonné",
};