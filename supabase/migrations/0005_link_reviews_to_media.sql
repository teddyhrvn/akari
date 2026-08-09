alter table public.reviews
  add constraint reviews_media_ref_fkey
  foreign key (media_ref)
  references public.media(id)
  on delete cascade;