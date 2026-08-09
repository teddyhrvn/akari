create table public.media_entries (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.profiles(id)
    on delete cascade,

  media_id integer not null,

  status text not null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint media_entries_status
    check (
      status in (
        'planned',
        'in_progress',
        'completed',
        'paused',
        'dropped'
      )
    ),

  constraint media_entries_user_media_unique
    unique (user_id, media_id)
);

create index media_entries_user_id_idx
  on public.media_entries(user_id);

create index media_entries_media_id_idx
  on public.media_entries(media_id);

create index media_entries_status_idx
  on public.media_entries(status);

alter table public.media_entries enable row level security;

create policy "Users can read their own media entries"
  on public.media_entries
  for select
  using (auth.uid() = user_id);

create policy "Users can create their own media entries"
  on public.media_entries
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own media entries"
  on public.media_entries
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own media entries"
  on public.media_entries
  for delete
  using (auth.uid() = user_id);