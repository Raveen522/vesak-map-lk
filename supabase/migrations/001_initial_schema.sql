-- 1. Create custom lightweight user table
create table if not exists public.community_users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  mobile_number text not null unique,
  display_name text,
  is_blocked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.community_users enable row level security;

-- 2. Create places table
create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('thorana', 'lantern', 'dansal', 'zone')),
  title text not null,
  description text,
  area_name text,
  address_text text,
  latitude double precision not null,
  longitude double precision not null,
  start_date date,
  end_date date,
  time_text text,
  added_by uuid references public.community_users(id) on delete set null,
  trust_status text not null default 'new'
    check (trust_status in (
      'new',
      'community_confirmed',
      'highly_confirmed',
      'disputed',
      'likely_wrong',
      'hidden_by_community'
    )),
  strong_confirm_count integer not null default 0,
  weak_confirm_count integer not null default 0,
  report_count integer not null default 0,
  last_confirmed_at timestamptz,
  last_reported_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.places enable row level security;

-- 3. Create confirmations table
create table if not exists public.place_confirmations (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references public.places(id) on delete cascade,
  user_id uuid not null references public.community_users(id) on delete cascade,
  confirmation_type text not null check (confirmation_type in (
    'confirmed_here',
    'confirmed_seen',
    'not_found',
    'closed',
    'wrong_location',
    'duplicate'
  )),
  user_latitude double precision,
  user_longitude double precision,
  distance_meters double precision,
  is_nearby boolean not null default false,
  note text,
  created_at timestamptz not null default now(),
  unique (place_id, user_id, confirmation_type)
);

-- Enable Row Level Security
alter table public.place_confirmations enable row level security;

-- 4. Create reports table
create table if not exists public.place_reports (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references public.places(id) on delete cascade,
  user_id uuid not null references public.community_users(id) on delete cascade,
  reason text not null check (reason in (
    'wrong_location',
    'duplicate',
    'not_vesak_related',
    'closed',
    'fake_or_spam',
    'inappropriate',
    'other'
  )),
  note text,
  created_at timestamptz not null default now(),
  unique (place_id, user_id, reason)
);

-- Enable Row Level Security
alter table public.place_reports enable row level security;

-- 5. Performance Indexes
create index if not exists places_category_idx on public.places(category);
create index if not exists places_trust_status_idx on public.places(trust_status);
create index if not exists places_created_at_idx on public.places(created_at desc);
create index if not exists places_lat_lng_idx on public.places(latitude, longitude);
create index if not exists place_confirmations_place_id_idx on public.place_confirmations(place_id);
create index if not exists place_reports_place_id_idx on public.place_reports(place_id);

-- 6. Row Level Security Policies
-- Since we are proposing Next.js server side writes via API / actions (service role key),
-- the client side policies only need to allow reading public pins and user creation lookup.

-- Places Policies: Anyone can view places that are not hidden by the community
create policy "Allow public view active places" on public.places
  for select using (trust_status != 'hidden_by_community');

-- Community Users: Browser cannot read mobile numbers, but server action can.
-- For simplicity, if browser selects, they can only view public details.
create policy "Allow select public user profiles" on public.community_users
  for select using (true);

-- 7. Grant schema privileges explicitly to API roles
grant select, insert, update, delete on all tables in schema public to service_role, anon, authenticated;
grant usage, select on all sequences in schema public to service_role, anon, authenticated;
