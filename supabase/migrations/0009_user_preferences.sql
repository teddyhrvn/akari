create table public.user_preferences (
  user_id uuid primary key
    references public.profiles(id)
    on delete cascade,

  favorite_media_type text,

  show_activity boolean not null default true,
  show_reviews boolean not null default true,
  show_library boolean not null default true,

  spoiler_free boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint user_preferences_media_type_check
    check (
      favorite_media_type is null
      or favorite_media_type in (
        'ANIME',
        'MANGA'
      )
    )
);

alter table public.user_preferences enable row level security;

create policy "Users can read their preferences"
  on public.user_preferences
  for select
  using (auth.uid() = user_id);

create policy "Users can create their preferences"
  on public.user_preferences
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their preferences"
  on public.user_preferences
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);