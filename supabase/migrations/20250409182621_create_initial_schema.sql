-- Migration: create_initial_schema
-- Description: Creates the initial database schema for Fiszkomat AI MVP
-- Created at: 2025-04-09 18:26:21 UTC
-- Author: AI Assistant

-- 1. Create custom types
create type flashcard_origin as enum ('user', 'ai');

-- 2. Create tables
-- 2.1. Decks table: stores flashcard decks with user ownership
create table decks (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null,
    name varchar(100) not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint fk_user foreign key (user_id) references auth.users(id)
);

-- Create indexes for the decks table
create unique index decks_user_id_name_idx on decks (user_id, lower(name));
create index decks_created_at_idx on decks (created_at);

-- 2.2. Flashcards table: stores individual flashcards linked to decks
create table flashcards (
    id uuid primary key default gen_random_uuid(),
    deck_id uuid not null,
    question varchar(400) not null,
    answer varchar(400) not null,
    next_review_date timestamptz,
    interval integer,
    last_ease_factor numeric,
    origin flashcard_origin not null,
    ai_model_name varchar,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint fk_deck foreign key (deck_id) references decks(id) on delete cascade
);

-- Create indexes for the flashcards table
create index flashcards_deck_id_idx on flashcards (deck_id);
create index flashcards_next_review_date_idx on flashcards (next_review_date);
create index flashcards_created_at_idx on flashcards (created_at);

-- 3. Set up Row Level Security (RLS)
-- 3.1. Enable and set up RLS for decks
alter table decks enable row level security;

-- Policy allowing authenticated users to select only their own decks
create policy select_own_decks_authenticated on decks 
    for select to authenticated using (user_id = auth.uid());

-- Policy allowing anonymous users no access to decks
create policy select_no_decks_anon on decks
    for select to anon using (false);

-- Policy allowing authenticated users to insert their own decks
create policy insert_own_decks_authenticated on decks
    for insert to authenticated with check (user_id = auth.uid());

-- Policy allowing anonymous users no ability to insert decks
create policy insert_no_decks_anon on decks
    for insert to anon with check (false);

-- Policy allowing authenticated users to update their own decks
create policy update_own_decks_authenticated on decks
    for update to authenticated using (user_id = auth.uid());

-- Policy allowing anonymous users no ability to update decks
create policy update_no_decks_anon on decks
    for update to anon using (false);

-- Policy allowing authenticated users to delete their own decks
create policy delete_own_decks_authenticated on decks
    for delete to authenticated using (user_id = auth.uid());

-- Policy allowing anonymous users no ability to delete decks
create policy delete_no_decks_anon on decks
    for delete to anon using (false);

-- 3.2. Enable and set up RLS for flashcards
alter table flashcards enable row level security;

-- Policy allowing authenticated users to select only flashcards from their own decks
create policy select_own_flashcards_authenticated on flashcards 
    for select to authenticated using (
        exists (
            select 1 from decks 
            where decks.id = flashcards.deck_id and decks.user_id = auth.uid()
        )
    );

-- Policy allowing anonymous users no access to flashcards
create policy select_no_flashcards_anon on flashcards
    for select to anon using (false);

-- Policy allowing authenticated users to insert flashcards into their own decks
create policy insert_own_flashcards_authenticated on flashcards
    for insert to authenticated with check (
        exists (
            select 1 from decks 
            where decks.id = flashcards.deck_id and decks.user_id = auth.uid()
        )
    );

-- Policy allowing anonymous users no ability to insert flashcards
create policy insert_no_flashcards_anon on flashcards
    for insert to anon with check (false);

-- Policy allowing authenticated users to update flashcards in their own decks
create policy update_own_flashcards_authenticated on flashcards
    for update to authenticated using (
        exists (
            select 1 from decks 
            where decks.id = flashcards.deck_id and decks.user_id = auth.uid()
        )
    );

-- Policy allowing anonymous users no ability to update flashcards
create policy update_no_flashcards_anon on flashcards
    for update to anon using (false);

-- Policy allowing authenticated users to delete flashcards from their own decks
create policy delete_own_flashcards_authenticated on flashcards
    for delete to authenticated using (
        exists (
            select 1 from decks 
            where decks.id = flashcards.deck_id and decks.user_id = auth.uid()
        )
    );

-- Policy allowing anonymous users no ability to delete flashcards
create policy delete_no_flashcards_anon on flashcards
    for delete to anon using (false); 