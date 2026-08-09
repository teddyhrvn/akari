alter table public.media_entries
  drop constraint if exists media_entries_user_media_unique;

alter table public.media_entries
  add constraint media_entries_user_media_ref_unique
  unique (user_id, media_ref);