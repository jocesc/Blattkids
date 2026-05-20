create table if not exists orders (
  id               text primary key,               -- BK-XXXXXXXX
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),

  -- Customer
  customer_name    text not null,
  customer_email   text not null,
  customer_phone   text not null,
  shipping_address text not null,

  -- Cart snapshot
  items            jsonb not null,
  subtotal_clp     integer not null,
  iva_clp          integer not null,
  total_clp        integer not null,

  -- Lifecycle
  status           text not null default 'pending'
                   check (status in ('pending','confirmed','in_production','delivered','cancelled')),

  -- Payment (filled by webhook)
  payment_provider text check (payment_provider in ('flow','mp','stripe')),
  payment_ref      text,   -- provider transaction/session ID

  notes            text
);

-- Auto-update updated_at on any change
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger orders_updated_at
  before update on orders
  for each row execute function update_updated_at();

-- Indexes for dashboard queries
create index if not exists orders_status       on orders (status);
create index if not exists orders_created_desc on orders (created_at desc);
create index if not exists orders_email        on orders (customer_email);

-- Row Level Security — same pattern as designs:
-- server uses service role key (bypasses RLS), anon key is blocked
alter table orders enable row level security;

create policy "Denegar lectura directa anon"
  on orders for select using (false);

create policy "Denegar escritura directa anon"
  on orders for insert with check (false);

create policy "Denegar borrado directo anon"
  on orders for delete using (false);

create policy "Denegar update directo anon"
  on orders for update using (false);
