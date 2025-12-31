# Supabase Database Schema

Copy and paste the code below into the **SQL Editor** in your Supabase dashboard to create the necessary tables and security policies.

```sql
-- 1. Enable UUID extension (usually enabled by default, but good to be safe)
create extension if not exists "uuid-ossp";

-- ==========================================
-- TABLE: PROJECTS
-- ==========================================
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,
  title text not null,
  description text,
  content text, -- Stores the Markdown body
  palette text[], -- Array of color hex codes
  tags text[], -- Array of strings
  image text, -- URL to image
  links jsonb, -- JSON object for { github: "...", demo: "..." }
  featured boolean default false,
  publish_date date default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
alter table public.projects enable row level security;

-- Policy: Allow public read access
create policy "Public projects are viewable by everyone." 
  on public.projects for select 
  using (true);

-- ==========================================
-- TABLE: POSTS (Insights)
-- ==========================================
create table public.posts (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,
  title text not null,
  excerpt text,
  category text, -- 'Engineering', 'Design', etc.
  tags text[],
  ai_analysis text, -- The AI summary text
  content text, -- Stores the Markdown body
  date text, -- Using text to store simplified date strings like '2023-10-24', or use DATE type
  type text, -- 'insight' or 'brief'
  read_time text, -- e.g. '5 min'
  published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table public.posts enable row level security;

-- Policy: Allow public read access
create policy "Public posts are viewable by everyone." 
  on public.posts for select 
  using (true);

-- ==========================================
-- TABLE: TOOLS
-- ==========================================
create table public.tools (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text,
  description text,
  icon_name text, -- We store the Lucide icon name as a string, e.g., 'Cpu'
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table public.tools enable row level security;

-- Policy: Allow public read access
create policy "Public tools are viewable by everyone." 
  on public.tools for select 
  using (true);

-- ==========================================
-- OPTIONAL: Storage Buckets (If you plan to upload images)
-- ==========================================
-- insert into storage.buckets (id, name, public) values ('images', 'images', true);
-- create policy "Public Access" on storage.objects for select using ( bucket_id = 'images' );
```
