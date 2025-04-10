# API Endpoint Implementation Plan: Decks

## 1. Przegląd punktu końcowego

Ten punkt końcowy jest odpowiedzialny za zarządzanie taliami fiszek (decks). Umożliwia on operacje takie jak pobieranie listy talii, tworzenie nowej talii, pobieranie szczegółów konkretnej talii, aktualizację oraz usuwanie talii. Endpointy korzystają z autoryzacji poprzez Supabase Auth, a bezpieczeństwo dostępu do danych wymusza polityki RLS (Row-Level Security) na tabeli `decks` w bazie PostgreSQL.

## 2. Szczegóły żądania

- **Metody HTTP**:
  - `GET /decks`: Pobiera spersonalizowaną, stronicowaną listę talii użytkownika.
  - `POST /decks`: Tworzy nową talię fiszek.
  - `GET /decks/{deckId}`: Pobiera szczegółowe informacje o konkretnej talii.
  - `PUT /decks/{deckId}`: Aktualizuje nazwę istniejącej talii.
  - `DELETE /decks/{deckId}`: Usuwa talię oraz powiązane fiszki.
- **Parametry i nagłówki**:
  - Wymagany nagłówek `Authorization: Bearer <token>`.
  - Zapytanie (dla `GET /decks`):
    - `page` (opcjonalny, domyślnie=1): Numer strony.
    - `limit` (opcjonalny, domyślnie=10): Liczba talii na stronę.
    - `sort_by` (opcjonalny): Pole sortowania (np. `name`, `created_at`).
    - `order` (opcjonalny): Kierunek sortowania (`asc` lub `desc`).
- **Request Body** (dla `POST /decks` i `PUT /decks/{deckId}`):
  - JSON zawierający:
    - `name`: Nazwa talii (wymagana, max 100 znaków, unikalna dla danego użytkownika).

## 3. Wykorzystywane typy

- **DTOs**:
  - `DeckDTO`: Zawiera pola `id`, `name`, `created_at`, `updated_at`.
- **Command Modele**:
  - `DeckCreateCommand`: Model do tworzenia nowej talii (pole `name`).
  - `DeckUpdateCommand`: Model do aktualizacji istniejącej talii (pole `name`).

## 4. Szczegóły odpowiedzi

- **GET /decks**:
  - Odpowiedź:
    ```json
    {
      "data": [{ "id": "uuid", "name": "Deck Name", "created_at": "timestamp", "updated_at": "timestamp" }],
      "page": 1,
      "limit": 10,
      "total": 34
    }
    ```
  - Kody statusu: 200 OK (pomyślne pobranie), 401 Unauthorized, 500 Internal Server Error.
- **POST /decks**:
  - Odpowiedź:
    ```json
    {
      "id": "uuid",
      "name": "Deck Name",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
    ```
  - Kody statusu: 201 Created, 400 Bad Request (walidacja), 401 Unauthorized.
- Analogicznie, odpowiedzi dla `GET /decks/{deckId}`, `PUT /decks/{deckId}` i `DELETE /decks/{deckId}` powinny zawierać odpowiednie komunikaty i kody statusu (200 OK, 404 Not Found, 400 Bad Request, 401 Unauthorized).

## 5. Przepływ danych

1. Klient wysyła żądanie do odpowiedniego endpointu (np. `GET /decks`).
2. Middleware autoryzacyjny weryfikuje token JWT przy użyciu Supabase Auth.
3. Po poprawnej weryfikacji przekazuje żądanie do API route.
4. Parametry zapytania (np. stronicowanie, sortowanie) są walidowane za pomocą schematów (np. Zod).
5. Warstwa serwisowa (np. `src/lib/services/decks.ts`) wykonuje zapytanie do bazy danych używając klienta Supabase z `context.locals`.
6. Wyniki są filtrowane na podstawie `user_id` zgodnie z politykami RLS.
7. Dane są mapowane do odpowiednich DTO (np. `DeckDTO`) i zwracane w odpowiedzi.

## 6. Względy bezpieczeństwa

- **Autoryzacja**: Wszystkie endpointy wymagają ważnego tokena Bearer; RLS zapewnia, że użytkownik ma dostęp tylko do swoich danych.
- **Walidacja**: Użycie Zod schematów do walidacji parametrów zapytania i treści żądania (np. unikalność i długość `name`).
- **SQL Injection**: Używanie bezpiecznych, parametryzowanych zapytań dzięki Supabase.
- **Logowanie błędów**: W przypadku wystąpienia błędów, szczegóły mogą być zapisywane w tabeli `error_logs` z odpowiednimi poziomami (`ERROR`, `WARN`, `INFO`).

## 7. Obsługa błędów

- **400 Bad Request**: Gdy dane wejściowe są nieprawidłowe (np. przekroczona długość nazwy, nieprawidłowe parametry stronicowania).
- **401 Unauthorized**: Gdy użytkownik nie dostarczy ważnego tokena lub token jest nieważny.
- **404 Not Found**: Gdy zasób (np. konkretna talia) nie istnieje.
- **500 Internal Server Error**: W przypadku błędów po stronie serwera lub nieoczekiwanych problemów.

## 8. Rozważania dotyczące wydajności

- **Pagowanie**: Ograniczenie liczby zwracanych rekordów przez parametry `page` i `limit`.
- **Indeksy**: Wykorzystanie indeksów (np. `decks_created_at_idx` oraz indeks na `user_id`) w tabeli `decks` dla szybszego filtrowania.
- **Optymalizacja zapytań**: Filtrowanie danych bezpośrednio na poziomie bazy danych ograniczając zbędne przetwarzanie w aplikacji.

## 9. Etapy wdrożenia

1. Utworzenie lub aktualizacja modułu serwisowego (np. `src/lib/services/decks.ts`) w celu wyodrębnienia logiki biznesowej związanej z operacjami na talii.
2. Implementacja API route w Astro (np. `src/pages/api/decks/index.ts` dla operacji GET i POST oraz `src/pages/api/decks/[deckId].ts` dla operacji GET pojedynczej, PUT, DELETE).
3. Walidacja danych wejściowych za pomocą Zod schematów dla query params i request body.
4. Połączenie z bazą danych przez `context.locals.supabase` oraz wykonywanie zapytań filtrowanych po `user_id`.
5. Mapowanie wyników zapytań do odpowiednich DTO (np. `DeckDTO`).
6. Implementacja mechanizmu logowania błędów; w razie błędów zapisywanie szczegółowych logów w tabeli `error_logs`.
7. Code review, weryfikacja zgodności z wytycznymi technologicznymi (Astro, Supabase, TypeScript) oraz stosowanie najlepszych praktyk.
8. Wdrożenie oraz monitorowanie wydajności i bezpieczeństwa w środowisku produkcyjnym.
