-- Marketing de Bolso: rode este arquivo no SQL Editor do Supabase (uma vez).

create extension if not exists pgcrypto;

create table if not exists public.lojas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  nicho text,
  cidade text,
  bairro text,
  endereco text,
  instagram text,
  tom text default 'Profissional',
  created_at timestamptz not null default now()
);

create table if not exists public.geracoes (
  id uuid primary key default gen_random_uuid(),
  loja_id uuid references public.lojas(id) on delete cascade,
  menu text not null,
  item text not null,
  input jsonb default '{}'::jsonb,
  output text,
  provider text,
  created_at timestamptz not null default now()
);

create index if not exists geracoes_loja_idx on public.geracoes (loja_id, created_at desc);

-- O acesso é feito só pelo servidor (service role), então o RLS fica ativo sem políticas públicas.
alter table public.lojas enable row level security;
alter table public.geracoes enable row level security;
