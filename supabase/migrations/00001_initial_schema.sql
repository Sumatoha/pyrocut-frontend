create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  polar_customer_id text unique,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create table public.subscriptions (
  id text primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null,
  interval text not null,
  current_period_end timestamptz,
  canceled_at timestamptz,
  polar_product_id text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.subscriptions enable row level security;

create policy "Users can read own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create table public.lifetime_licenses (
  id text primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now()
);

alter table public.lifetime_licenses enable row level security;

create policy "Users can read own lifetime licenses"
  on public.lifetime_licenses for select
  using (auth.uid() = user_id);

create table public.license_keys (
  id text primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  key text not null,
  display_key text not null,
  plan text not null,
  activation_limit int not null,
  expires_at timestamptz,
  created_at timestamptz default now()
);

alter table public.license_keys enable row level security;

create policy "Users can read own license keys"
  on public.license_keys for select
  using (auth.uid() = user_id);

create table public.releases (
  version text primary key,
  channel text not null default 'stable',
  dmg_url text not null,
  ed_signature text not null,
  notes_md text,
  min_os text not null default '14.0',
  published_at timestamptz default now()
);

alter table public.releases enable row level security;

create policy "Anyone can read releases"
  on public.releases for select
  using (true);

create table public.pending_orders (
  id text primary key,
  email text not null,
  payload jsonb not null,
  claimed_at timestamptz,
  created_at timestamptz default now()
);

alter table public.pending_orders enable row level security;

create index on public.pending_orders (email) where claimed_at is null;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
