alter table public.reviews
  add column media_ref bigint;

alter table public.media_entries
  add column media_ref bigint;

create index reviews_media_ref_idx
  on public.reviews(media_ref);

create index media_entries_media_ref_idx
  on public.media_entries(media_ref);