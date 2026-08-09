create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,

  username text not null unique,
  display_name text,
  avatar_url text,
  bio text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint username_length
    check (char_length(username) between 3 and 30)
);

create index profiles_username_idx
  on public.profiles(username);


create table public.reviews (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.profiles(id)
    on delete cascade,

  media_id integer not null,

  rating numeric(2,1) not null,

  content text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint reviews_rating_range
    check (rating >= 0.5 and rating <= 5),

  constraint reviews_rating_step
    check (rating * 2 = floor(rating * 2)),

  constraint reviews_user_media_unique
    unique (user_id, media_id)
);

create index reviews_media_id_idx
  on public.reviews(media_id);

create index reviews_user_id_idx
  on public.reviews(user_id);


create table public.follows (
  follower_id uuid not null
    references public.profiles(id)
    on delete cascade,

  following_id uuid not null
    references public.profiles(id)
    on delete cascade,

  created_at timestamptz not null default now(),

  primary key (follower_id, following_id),

  constraint follows_no_self
    check (follower_id <> following_id)
);

create index follows_following_id_idx
  on public.follows(following_id);


alter table public.profiles enable row level security;
alter table public.reviews enable row level security;
alter table public.follows enable row level security;


create policy "Profiles are publicly readable"
  on public.profiles
  for select
  using (true);


create policy "Users can create their own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);


create policy "Users can update their own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);


create policy "Reviews are publicly readable"
  on public.reviews
  for select
  using (true);


create policy "Users can create their own reviews"
  on public.reviews
  for insert
  with check (auth.uid() = user_id);


create policy "Users can update their own reviews"
  on public.reviews
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


create policy "Users can delete their own reviews"
  on public.reviews
  for delete
  using (auth.uid() = user_id);


create policy "Follows are publicly readable"
  on public.follows
  for select
  using (true);


create policy "Users can follow as themselves"
  on public.follows
  for insert
  with check (auth.uid() = follower_id);


create policy "Users can unfollow as themselves"
  on public.follows
  for delete
  using (auth.uid() = follower_id);
  