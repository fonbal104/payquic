create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  username text not null,
  email text not null,
  password_hash text not null,
  first_name text not null default '',
  last_name text not null default '',
  phone text not null default '',
  address text not null default '',
  role text not null default 'client',
  lang text not null default 'en',
  email_verified boolean not null default false,
  failed_logins int not null default 0,
  locked_until timestamptz,
  created_at timestamptz not null default now()
);
create unique index if not exists users_email_key on users (lower(email));
create unique index if not exists users_username_key on users (lower(username));
create table if not exists tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  type text not null,
  token_hash text not null,
  expires_at timestamptz not null,
  used_at timestamptz
);
create index if not exists tokens_hash_idx on tokens (token_hash);
create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  kind text not null,
  status text not null default 'new',
  data jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists inquiries_user_idx on inquiries (user_id, created_at desc);
