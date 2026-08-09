alter table public.profiles
  add column if not exists bio text,
  add column if not exists banner_url text,
  add column if not exists location text,
  add column if not exists website_url text,
  add column if not exists favorite_quote text,
  add column if not exists profile_color text,
  add column if not exists is_private boolean not null default false;

create index if not exists profiles_username_idx
  on public.profiles(username);