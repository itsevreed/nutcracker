-- Run this in your Supabase SQL Editor (under the "SQL Editor" tab)
-- It creates the two tables and enables realtime + public access

-- LOGS table: stores every crack event
create table if not exists logs (
  id bigint generated always as identity primary key,
  username text not null,
  reactions jsonb default '{}',
  created_at timestamptz default now()
);

-- EVENTS table: stores scheduled group crack events
create table if not exists events (
  id bigint generated always as identity primary key,
  title text not null,
  event_time timestamptz not null,
  note text default '',
  host text not null,
  rsvps jsonb default '[]',
  created_at timestamptz default now()
);

-- Enable Row Level Security but allow public read/write (no auth needed)
alter table logs enable row level security;
alter table events enable row level security;

create policy "Allow public read logs"  on logs  for select using (true);
create policy "Allow public insert logs" on logs  for insert with check (true);
create policy "Allow public update logs" on logs  for update using (true);

create policy "Allow public read events"   on events for select using (true);
create policy "Allow public insert events" on events for insert with check (true);
create policy "Allow public update events" on events for update using (true);

-- Enable realtime for both tables
alter publication supabase_realtime add table logs;
alter publication supabase_realtime add table events;
