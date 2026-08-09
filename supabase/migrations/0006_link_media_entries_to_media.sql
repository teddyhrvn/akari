alter table public.media_entries
  add constraint media_entries_media_ref_fkey
  foreign key (media_ref)
  references public.media(id)
  on delete cascade;