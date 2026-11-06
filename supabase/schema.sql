-- ============================================================
-- SENGON Social Platform — Supabase Schema (Clean Version)
-- 
-- HOW TO RUN:
-- 1. Go to https://supabase.com/dashboard
-- 2. Select your project
-- 3. Click "SQL Editor" in the left sidebar
-- 4. Click "New query"
-- 5. Paste ALL of this file into the editor
-- 6. Click the green "Run" button
-- ============================================================

-- ─── Drop existing tables if re-running ──────────────────────
drop table if exists public.comment_reactions cascade;
drop table if exists public.post_reactions cascade;
drop table if exists public.follows cascade;
drop table if exists public.comments cascade;
drop table if exists public.slides cascade;
drop table if exists public.posts cascade;
drop table if exists public.profiles cascade;

-- ─── PROFILES ─────────────────────────────────────────────────
create table public.profiles (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  handle        text unique not null,
  avatar_url    text,
  verified      boolean default false,
  verified_label text,
  role_line     text,
  location      text,
  bio           text,
  followers_count integer default 0,
  following_count integer default 0,
  total_views   bigint default 0,
  created_at    timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Profiles can be inserted by anyone"
  on public.profiles for insert with check (true);

-- ─── POSTS ────────────────────────────────────────────────────
create table public.posts (
  id            uuid primary key default gen_random_uuid(),
  short_id      text unique not null,
  author_id     uuid references public.profiles(id) on delete cascade,
  category_breadcrumb text,
  category_tag  text,
  title         text not null,
  summary       text,
  hashtags      text[] default '{}',
  likes_count   integer default 0,
  comments_count integer default 0,
  reposts_count  integer default 0,
  bookmarks_count integer default 0,
  views_count   bigint default 0,
  reacted_avatars text[] default '{}',
  created_at    timestamptz default now()
);

alter table public.posts enable row level security;

create policy "Posts are viewable by everyone"
  on public.posts for select using (true);

create policy "Posts can be inserted by anyone"
  on public.posts for insert with check (true);

-- ─── SLIDES ───────────────────────────────────────────────────
create table public.slides (
  id            uuid primary key default gen_random_uuid(),
  post_id       uuid references public.posts(id) on delete cascade,
  position      smallint not null,
  image_url     text,
  alt_text      text,
  slide_label   text,
  caption_title text,
  badge_text    text,
  badge_icon    text,
  tagline       text,
  tags          text[] default '{}',
  metrics       jsonb default '[]',
  created_at    timestamptz default now()
);

alter table public.slides enable row level security;

create policy "Slides are viewable by everyone"
  on public.slides for select using (true);

create policy "Slides can be inserted by anyone"
  on public.slides for insert with check (true);

-- ─── COMMENTS ─────────────────────────────────────────────────
create table public.comments (
  id            uuid primary key default gen_random_uuid(),
  post_id       uuid references public.posts(id) on delete cascade,
  author_id     uuid references public.profiles(id) on delete cascade,
  parent_id     uuid references public.comments(id) on delete cascade,
  content       text not null,
  likes_count   integer default 0,
  is_staff_pick boolean default false,
  created_at    timestamptz default now()
);

alter table public.comments enable row level security;

create policy "Comments are viewable by everyone"
  on public.comments for select using (true);

create policy "Comments can be inserted by anyone"
  on public.comments for insert with check (true);

-- ─── POST REACTIONS ────────────────────────────────────────────
create table public.post_reactions (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid references public.posts(id) on delete cascade,
  user_id    uuid references public.profiles(id) on delete cascade,
  type       text not null default 'like',
  created_at timestamptz default now(),
  unique(post_id, user_id, type)
);

alter table public.post_reactions enable row level security;

create policy "Post reactions viewable by everyone"
  on public.post_reactions for select using (true);

create policy "Post reactions can be inserted by anyone"
  on public.post_reactions for insert with check (true);

create policy "Post reactions can be deleted by anyone"
  on public.post_reactions for delete using (true);

-- ─── REALTIME ─────────────────────────────────────────────────
alter publication supabase_realtime add table public.comments;

-- ─── GRANT API ACCESS ─────────────────────────────────────────
grant usage on schema public to anon, authenticated;
grant select on all tables in schema public to anon, authenticated;
grant insert on public.comments, public.post_reactions to anon, authenticated;
grant delete on public.post_reactions to anon, authenticated;

-- ============================================================
-- SEED DATA — Insert demo content
-- ============================================================

-- Creator: Marcus Chen
insert into public.profiles (id, name, handle, avatar_url, verified, role_line, location, bio, followers_count, following_count, total_views)
values (
  'aaaaaaaa-0000-0000-0000-000000000001',
  'Marcus Chen',
  '@marcus_dev',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  true,
  'Principal Architect @ Veloce Labs',
  'San Francisco, CA',
  'Principal Architect @ Veloce Labs. Exploring high-frequency collaborative canvases, reactive CRDT networks, and edge WebAssembly engines.',
  34812, 412, 1200000
);

-- Demo Post
insert into public.posts (id, short_id, author_id, category_breadcrumb, category_tag, title, summary, hashtags, likes_count, comments_count, reposts_count, bookmarks_count, views_count, reacted_avatars)
values (
  'bbbbbbbb-0000-0000-0000-000000000002',
  '84912',
  'aaaaaaaa-0000-0000-0000-000000000001',
  'Engineering & Architecture',
  'Engineering',
  'Rebuilding our distributed layout canvas with reactive edge nodes ⚡️',
  'After three months of stress testing latency across 24 global edge regions, here is how we cut canvas state synchronization down to 14ms using WASM-accelerated CRDTs and WebGPU rasterization pipelines. Deep dive into lattice topology, vector clock compression, and zero-allocation frame buffers.',
  array['#WebPerformance','#SystemArchitecture','#FrontendEngineering','#SengonTech'],
  2418, 382, 195, 847, 48600,
  array['JD','EK','+18']
);

-- Slides (4 carousel slides)
insert into public.slides (post_id, position, image_url, alt_text, slide_label, caption_title, badge_text, badge_icon, tagline, tags, metrics) values
(
  'bbbbbbbb-0000-0000-0000-000000000002', 1,
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=85',
  'Topology Cluster & Edge Ingestion Core Architecture',
  'SLIDE 01 / 04', 'Topology Cluster & Edge Ingestion Core',
  '3 Tags Detected', 'sell',
  'Global edge ingress handles 120k state deltas/sec with peer-to-peer relay',
  array['Ingress Mesh','QUIC Stream','Lattice Node'],
  '[{"label":"P99 Sync","value":"13.8 ms","change":"-62%"},{"label":"Edge Relay","value":"24 Regions","change":"Active"},{"label":"Memory Footprint","value":"4.2 MB","change":"-34%"}]'
),
(
  'bbbbbbbb-0000-0000-0000-000000000002', 2,
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=85',
  'Realtime CRDT State Synchronization',
  'SLIDE 02 / 04', 'Realtime CRDT State Synchronization & Consensus',
  'Verified Protocol', 'verified',
  'Conflict-free replicated data types compiled to WebAssembly',
  array['Loro CRDT','WASM Core','Delta-State'],
  '[{"label":"Conflict Rate","value":"0.001%","change":"Zero Desync"},{"label":"Throughput","value":"85k ops/s","change":"+140%"},{"label":"Vector Compression","value":"8.4x","change":"Zstd Stream"}]'
),
(
  'bbbbbbbb-0000-0000-0000-000000000002', 3,
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=85',
  'WebGPU Direct Pipeline & Quad-Tree Layout Engine',
  'SLIDE 03 / 04', 'WebGPU Direct Pipeline & Quad-Tree Engine',
  '60 FPS Benchmark', 'bolt',
  'Hardware accelerated canvas rasterization bypassing the DOM compositing thread',
  array['WGSL Shaders','B-Tree Canvas','Zero-Copy'],
  '[{"label":"Render Frame","value":"1.2 ms","change":"120 FPS capable"},{"label":"Draw Calls","value":"4 / frame","change":"Instanced"},{"label":"GPU VRAM","value":"18 MB","change":"Shared Buffer"}]'
),
(
  'bbbbbbbb-0000-0000-0000-000000000002', 4,
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=85',
  'Global Edge Benchmarks vs Legacy WebSocket architecture',
  'SLIDE 04 / 04', 'Global Edge Benchmarks & Latency Map',
  '24 Regions Measured', 'public',
  'Cross-region telemetry demonstrating sub-20ms roundtrip worldwide',
  array['Telemetry','Multi-Region','Zero Packet Drop'],
  '[{"label":"US-East","value":"7.1 ms","change":"Fastest"},{"label":"EU-Central","value":"12.4 ms","change":"Nominal"},{"label":"AP-East","value":"16.8 ms","change":"Optimized"}]'
);

-- Commenters profiles
insert into public.profiles (id, name, handle, avatar_url, verified, verified_label) values
  ('cccccccc-0000-0000-0000-000000000003','Elena Rostova','@elena_systems','https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',true,'Author Network'),
  ('cccccccc-0000-0000-0000-000000000004','Sophia Vance','@svance_gpu','https://images.unsplash.com/photo-1534751516642-a1714f5a5b5a?w=150&auto=format&fit=crop&q=80',true,'WebGPU WG'),
  ('cccccccc-0000-0000-0000-000000000005','Tariq Al-Mansoor','@tariq_wasm','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',true,'Rust Core'),
  ('cccccccc-0000-0000-0000-000000000006','David Kim','@dkim_infra','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',false,'Edge Engineer');

-- Top-level comments
insert into public.comments (id, post_id, author_id, content, likes_count, is_staff_pick, created_at) values
  (
    'dddddddd-0000-0000-0000-000000000010',
    'bbbbbbbb-0000-0000-0000-000000000002',
    'cccccccc-0000-0000-0000-000000000003',
    'The memory layout optimization in Slide 02 is phenomenal. Curious how you prevent tombstone accumulation in long-lived collaborative canvas sessions without triggering periodic garbage-collection latency spikes?',
    142, true, now() - interval '1 hour'
  ),
  (
    'dddddddd-0000-0000-0000-000000000011',
    'bbbbbbbb-0000-0000-0000-000000000002',
    'cccccccc-0000-0000-0000-000000000004',
    'Bypassing the standard DOM rendering stack for a WGSL instanced quad-tree is a bold move, but the 1.2ms frame times speak for themselves. Are you compiling shader variants dynamically or pre-bundling unified compute kernels?',
    88, false, now() - interval '2 hours'
  ),
  (
    'dddddddd-0000-0000-0000-000000000012',
    'bbbbbbbb-0000-0000-0000-000000000002',
    'cccccccc-0000-0000-0000-000000000005',
    'The zero-allocation frame buffer approach is textbook systems engineering applied to web browsers. Bookmarked this for our Q3 architectural review.',
    53, true, now() - interval '2 hours 30 minutes'
  );

-- Nested replies
insert into public.comments (id, post_id, author_id, parent_id, content, likes_count, created_at) values
  (
    'dddddddd-0000-0000-0000-000000000013',
    'bbbbbbbb-0000-0000-0000-000000000002',
    'aaaaaaaa-0000-0000-0000-000000000001',
    'dddddddd-0000-0000-0000-000000000010',
    'Great observation Elena! We implemented sliding ephemeral epoch windows. Inactive deleted branch nodes are rolled into a compact Merkle root snapshot whenever all connected peer clocks surpass the compaction horizon. No stop-the-world pauses at all.',
    64, now() - interval '45 minutes'
  ),
  (
    'dddddddd-0000-0000-0000-000000000014',
    'bbbbbbbb-0000-0000-0000-000000000002',
    'cccccccc-0000-0000-0000-000000000006',
    'dddddddd-0000-0000-0000-000000000010',
    'Can confirm this pattern works wonders. We ran a similar epoch-boundary sweep in our streaming telemetry engine. Sub-15ms sync across transatlantic peers is truly state of the art.',
    19, now() - interval '30 minutes'
  );

-- Done! All tables created and seeded.
select 'Schema created and seeded successfully! ✅' as status;
