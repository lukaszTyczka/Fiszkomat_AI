/*
Final PostgreSQL Database Schema for Fiszkomat AI MVP
*/

# Schemat bazy danych PostgreSQL dla Fiszkomat AI MVP

## 1. Typy niestandardowe

```sql
CREATE TYPE flashcard_origin AS ENUM ('user', 'ai');
```

## 2. Tabele

### 2.1. Tabela `decks`

```sql
CREATE TABLE decks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
```

**Indeksy:**

```sql
CREATE UNIQUE INDEX decks_user_id_name_idx ON decks (user_id, lower(name));
CREATE INDEX decks_created_at_idx ON decks (created_at);
```

### 2.2. Tabela `flashcards`

```sql
CREATE TABLE flashcards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deck_id UUID NOT NULL,
    question VARCHAR(400) NOT NULL,
    answer VARCHAR(400) NOT NULL,
    next_review_date TIMESTAMPTZ,
    interval INTEGER,
    last_ease_factor NUMERIC,
    origin flashcard_origin NOT NULL,
    ai_model_name VARCHAR,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_deck FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
);
```

**Indeksy:**

```sql
CREATE INDEX flashcards_deck_id_idx ON flashcards (deck_id);
CREATE INDEX flashcards_next_review_date_idx ON flashcards (next_review_date);
CREATE INDEX flashcards_created_at_idx ON flashcards (created_at);
```

## 3. Relacje

- Tabela `auth.users` (zarządzana przez Supabase Auth) 1:N z tabelą `decks`.
- Tabela `decks` 1:N z tabelą `flashcards` (z relacją ON DELETE CASCADE).

## 4. Zasady bezpieczeństwa (RLS)

### 4.1. Tabela `decks`

```sql
ALTER TABLE decks ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_own_decks ON decks 
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY modify_own_decks ON decks
    FOR INSERT, UPDATE, DELETE USING (user_id = auth.uid());
```

### 4.2. Tabela `flashcards`

```sql
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_own_flashcards ON flashcards 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM decks 
            WHERE decks.id = flashcards.deck_id AND decks.user_id = auth.uid()
        )
    );

CREATE POLICY modify_own_flashcards ON flashcards
    FOR INSERT, UPDATE, DELETE USING (
        EXISTS (
            SELECT 1 FROM decks 
            WHERE decks.id = flashcards.deck_id AND decks.user_id = auth.uid()
        )
    );
```

## 5. Uwagi dodatkowe

- Użyto funkcji `gen_random_uuid()` zakładając, że rozszerzenie odpowiedzialne za generowanie UUID (np. pgcrypto lub uuid-ossp) jest zainstalowane.
- Polityki RLS opierają się na funkcji `auth.uid()`, która zwraca identyfikator aktualnie zalogowanego użytkownika w środowisku Supabase.
- Schemat jest znormalizowany do 3NF, zapewniając integralność i skalowalność danych dla MVP. 