-- NairobiPixel Revenue OS foundation
-- Run in a NEW NairobiPixel Supabase project. Do NOT run in HashiBot Supabase.

create extension if not exists pgcrypto;

create type public.user_role as enum ('admin');
create type public.lead_status as enum ('new','qualified','contacted','replied','proposal','won','lost','suppressed');
create type public.order_status as enum ('draft','pending_payment','paid','in_progress','fulfilled','cancelled','refunded');
create type public.payment_status as enum ('pending','paid','failed','refunded');
create type public.product_kind as enum ('service','digital_product','agent','subscription');
create type public.experiment_decision as enum ('running','scale','change','kill');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'admin',
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  kind public.product_kind not null,
  short_description text not null,
  problem_solved text,
  outcome text,
  price_kes numeric(12,2),
  billing_period text,
  deposit_percent numeric(5,2),
  active boolean not null default true,
  featured boolean not null default false,
  sort_order integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  location text,
  website text,
  phone text,
  email text,
  instagram text,
  google_place_id text unique,
  source text,
  opportunity_score integer check (opportunity_score between 0 and 100),
  likely_problem text,
  suggested_offer text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete set null,
  contact_name text,
  contact_channel text,
  status public.lead_status not null default 'new',
  last_contacted_at timestamptz,
  next_follow_up_at timestamptz,
  assigned_offer text,
  value_estimate_kes numeric(12,2),
  suppression_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.proposals (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete set null,
  title text not null,
  problem_summary text,
  proposed_solution text,
  price_kes numeric(12,2),
  recurring_kes numeric(12,2),
  status text not null default 'draft',
  sent_at timestamptz,
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete set null,
  name text not null,
  email text,
  phone text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  product_id uuid references public.products(id) on delete set null,
  status public.order_status not null default 'draft',
  currency text not null default 'KES',
  subtotal numeric(12,2) not null default 0,
  amount_paid numeric(12,2) not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  provider text not null,
  provider_reference text,
  status public.payment_status not null default 'pending',
  currency text not null default 'KES',
  amount numeric(12,2) not null,
  fee_amount numeric(12,2) not null default 0,
  paid_at timestamptz,
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete set null,
  customer_id uuid references public.customers(id) on delete set null,
  scheduled_for timestamptz,
  status text not null default 'requested',
  notes text,
  created_at timestamptz not null default now()
);

create table public.agent_jobs (
  id uuid primary key default gen_random_uuid(),
  agent_name text not null,
  job_type text not null,
  status text not null default 'queued',
  input jsonb not null default '{}'::jsonb,
  output jsonb not null default '{}'::jsonb,
  error text,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.experiments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  hypothesis text not null,
  success_criterion text not null,
  target_sample integer,
  prospects integer not null default 0,
  messages integer not null default 0,
  replies integer not null default 0,
  meetings integer not null default 0,
  sales integer not null default 0,
  revenue_kes numeric(12,2) not null default 0,
  decision public.experiment_decision not null default 'running',
  started_at timestamptz not null default now(),
  ended_at timestamptz
);

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  vendor text,
  amount_kes numeric(12,2) not null,
  related_customer_id uuid references public.customers(id) on delete set null,
  related_product_id uuid references public.products(id) on delete set null,
  incurred_at date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.businesses enable row level security;
alter table public.leads enable row level security;
alter table public.proposals enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.payments enable row level security;
alter table public.bookings enable row level security;
alter table public.agent_jobs enable row level security;
alter table public.experiments enable row level security;
alter table public.expenses enable row level security;

create policy "public can read active products" on public.products
for select using (active = true or public.is_admin());

create policy "admins manage products" on public.products for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage businesses" on public.businesses for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage leads" on public.leads for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage proposals" on public.proposals for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage customers" on public.customers for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage orders" on public.orders for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage payments" on public.payments for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage bookings" on public.bookings for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage agent jobs" on public.agent_jobs for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage experiments" on public.experiments for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage expenses" on public.expenses for all using (public.is_admin()) with check (public.is_admin());
create policy "users can view own profile" on public.profiles for select using (id = auth.uid());

-- Bootstrap after creating your first Supabase Auth user:
-- insert into public.profiles (id, role, display_name)
-- values ('YOUR_AUTH_USER_UUID', 'admin', 'Hashi');

insert into public.products (slug,name,kind,short_description,problem_solved,outcome,price_kes,deposit_percent,featured,sort_order) values
('lead-generation-system','Lead Generation System','service','A complete system for turning attention into qualified enquiries.','Businesses get traffic but lose potential customers before they enquire.','A focused offer page, lead capture, tracking and follow-up flow.',35000,50,true,10),
('booking-deposit-system','Booking + Deposit System','service','Let customers book and pay a deposit without back-and-forth messages.','Manual booking wastes staff time and no-shows cost money.','Customers choose a slot, pay a deposit and receive confirmation automatically.',30000,50,true,20),
('mpesa-checkout','M-Pesa Checkout','service','Accept M-Pesa payments directly from your online customer journey.','Customers drop off when payment is manual or confusing.','A smoother pay-now flow tied to orders and payment confirmation.',25000,50,false,30),
('sales-follow-up-agent','Sales Follow-Up Agent','agent','Automatically keep track of leads and prepare timely follow-ups.','Interested leads are forgotten or followed up too late.','More consistent follow-up without relying on memory.',5000,null,true,40),
('custom-business-system','Custom Business System','service','A tailored system for the process costing your business the most time or money.','Off-the-shelf tools do not fit a specific workflow.','A practical custom workflow, dashboard or automation built around the business.',75000,50,false,50);
