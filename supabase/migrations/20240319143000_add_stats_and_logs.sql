-- Migration: add_stats_and_logs
-- Description: Adds tables for AI generation statistics and error logging
-- Created at: 2024-03-19 14:30:00 UTC
-- Author: AI Assistant

-- 1. Create ai_generation_stats table for tracking AI flashcard generation metrics
create table ai_generation_stats (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null,
    deck_id uuid not null,
    session_id uuid not null,
    ai_model_name varchar not null,
    text_length integer not null,
    cards_generated integer not null,
    cards_accepted integer not null,
    cards_rejected integer not null,
    generation_timestamp timestamptz not null default now(),
    constraint fk_user foreign key (user_id) references auth.users(id),
    constraint fk_deck foreign key (deck_id) references decks(id) on delete cascade
);

-- Create indexes for ai_generation_stats
create index ai_generation_stats_user_id_idx on ai_generation_stats (user_id);
create index ai_generation_stats_deck_id_idx on ai_generation_stats (deck_id);
create index ai_generation_stats_timestamp_idx on ai_generation_stats (generation_timestamp);

-- Enable RLS for ai_generation_stats
alter table ai_generation_stats enable row level security;

-- Policy allowing authenticated users to select their own stats
create policy select_own_stats_authenticated on ai_generation_stats 
    for select to authenticated using (user_id = auth.uid());

-- Policy preventing anonymous users from viewing stats
create policy select_no_stats_anon on ai_generation_stats
    for select to anon using (false);

-- Policy allowing authenticated users to insert their own stats
create policy insert_own_stats_authenticated on ai_generation_stats
    for insert to authenticated with check (user_id = auth.uid());

-- Policy preventing anonymous users from inserting stats
create policy insert_no_stats_anon on ai_generation_stats
    for insert to anon with check (false);

-- 2. Create error_logs table for application-wide error tracking
create table error_logs (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id),
    error_level varchar(50) not null,
    error_message text not null,
    error_stack text,
    error_context jsonb,
    created_at timestamptz not null default now()
);

-- Create index for error_logs
create index error_logs_created_at_idx on error_logs (created_at);
create index error_logs_user_id_idx on error_logs (user_id);
create index error_logs_error_level_idx on error_logs (error_level);

-- Enable RLS for error_logs
alter table error_logs enable row level security;

-- Policy allowing only authenticated users to view error logs
create policy select_error_logs_authenticated on error_logs 
    for select to authenticated using (user_id = auth.uid());

-- Policy preventing anonymous users from viewing error logs
create policy select_no_error_logs_anon on error_logs
    for select to anon using (false);

-- Policy allowing any authenticated user to insert error logs
create policy insert_error_logs_authenticated on error_logs
    for insert to authenticated with check (true);

-- Policy allowing anonymous users to insert error logs (for client-side errors)
create policy insert_error_logs_anon on error_logs
    for insert to anon with check (true); 