-- Tabla principal de diseños generados por Claude
create table if not exists designs (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  user_id     text not null,
  prompt_text text not null,
  result_json jsonb not null,
  idioma      text not null default 'es' check (idioma in ('es', 'en'))
);

-- Índice para consultas por usuario ordenadas por fecha
create index if not exists designs_user_created
  on designs (user_id, created_at desc);

-- Row Level Security
alter table designs enable row level security;

-- Con service role key (usado por el servidor) se bypasea RLS automáticamente.
-- Estas políticas bloquean el acceso directo con la anon key desde el cliente.
create policy "Denegar lectura directa con anon key"
  on designs for select
  using (false);

create policy "Denegar escritura directa con anon key"
  on designs for insert
  with check (false);

create policy "Denegar borrado directo con anon key"
  on designs for delete
  using (false);
