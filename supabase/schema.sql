create extension if not exists "pgcrypto";

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  date text,
  author text not null default 'Lucas Gomes',
  category text not null default 'Teologia',
  excerpt text,
  content text not null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null,
  description text,
  image_url text,
  external_link text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.downloads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  file_url text,
  category text not null default 'Geral',
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists articles_set_updated_at on public.articles;
create trigger articles_set_updated_at
before update on public.articles
for each row execute function public.set_updated_at();

drop trigger if exists recommendations_set_updated_at on public.recommendations;
create trigger recommendations_set_updated_at
before update on public.recommendations
for each row execute function public.set_updated_at();

drop trigger if exists downloads_set_updated_at on public.downloads;
create trigger downloads_set_updated_at
before update on public.downloads
for each row execute function public.set_updated_at();

alter table public.articles enable row level security;
alter table public.recommendations enable row level security;
alter table public.downloads enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists "Public can read published articles" on public.articles;
create policy "Public can read published articles"
on public.articles for select
using (status = 'published');

drop policy if exists "Editors can manage articles" on public.articles;
create policy "Editors can manage articles"
on public.articles for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read recommendations" on public.recommendations;
create policy "Public can read recommendations"
on public.recommendations for select
using (true);

drop policy if exists "Editors can manage recommendations" on public.recommendations;
create policy "Editors can manage recommendations"
on public.recommendations for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read published downloads" on public.downloads;
create policy "Public can read published downloads"
on public.downloads for select
using (published = true);

drop policy if exists "Editors can manage downloads" on public.downloads;
create policy "Editors can manage downloads"
on public.downloads for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can create contact messages" on public.contact_messages;
create policy "Public can create contact messages"
on public.contact_messages for insert
with check (true);

drop policy if exists "Editors can read contact messages" on public.contact_messages;
create policy "Editors can read contact messages"
on public.contact_messages for select
to authenticated
using (true);

insert into storage.buckets (id, name, public)
values
  ('article-images', 'article-images', true),
  ('recommendation-images', 'recommendation-images', true),
  ('downloads', 'downloads', true)
on conflict (id) do nothing;

drop policy if exists "Public can read public site files" on storage.objects;
create policy "Public can read public site files"
on storage.objects for select
using (bucket_id in ('article-images', 'recommendation-images', 'downloads'));

drop policy if exists "Editors can manage site files" on storage.objects;
create policy "Editors can manage site files"
on storage.objects for all
to authenticated
using (bucket_id in ('article-images', 'recommendation-images', 'downloads'))
with check (bucket_id in ('article-images', 'recommendation-images', 'downloads'));

insert into public.articles (slug, title, date, author, category, excerpt, content, status)
values
  (
    'a-soberania-de-deus-na-historia',
    'A Soberania de Deus na Historia',
    '15 de abril de 2026',
    'Lucas Gomes',
    'Teologia',
    'Uma reflexao sobre como a providencia divina governa todos os acontecimentos da historia humana.',
    '<p>A doutrina da soberania de Deus e uma das mais fundamentais e consoladoras de toda a teologia crista.</p>',
    'published'
  ),
  (
    'a-importancia-da-educacao-classica',
    'A Importancia da Educacao Classica para o Cristao',
    '8 de abril de 2026',
    'Lucas Gomes',
    'Educacao Classica',
    'Por que os cristaos devem recuperar o modelo classico de educacao fundamentado no Trivium.',
    '<p>A educacao classica representa um modelo pedagogico consistente e frutifero para a formacao crista.</p>',
    'published'
  ),
  (
    'filosofia-crista-e-o-pensamento-moderno',
    'Filosofia Crista e o Pensamento Moderno',
    '1 de abril de 2026',
    'Lucas Gomes',
    'Filosofia',
    'Como a filosofia crista oferece respostas solidas aos dilemas do pensamento moderno.',
    '<p>A filosofia crista oferece uma base solida para o conhecimento, a etica e a esperanca.</p>',
    'published'
  )
on conflict (slug) do nothing;

insert into public.recommendations (title, author, description)
values
  ('Confissoes', 'Santo Agostinho', 'Uma das maiores obras da literatura crista.'),
  ('Institutas da Religiao Crista', 'Joao Calvino', 'A obra-prima da teologia reformada.'),
  ('Ortodoxia', 'G.K. Chesterton', 'Uma defesa brilhante do cristianismo ortodoxo.')
on conflict do nothing;

insert into public.downloads (name, description, category, published)
values
  ('Guia de Leitura dos Pais da Igreja', 'Roteiro introdutorio para leitura dos escritos patristicos.', 'Teologia', true),
  ('Introducao ao Trivium', 'Material introdutorio sobre Gramatica, Logica e Retorica.', 'Educacao Classica', true)
on conflict do nothing;
