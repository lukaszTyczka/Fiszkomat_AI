# API Endpoint Implementation Plan: POST /ai/flashcards/generate

## 1. Przegląd punktu końcowego

Endpoint służy do generowania propozycji fiszek (flashcards) przy użyciu usługi AI. Klient przesyła tekst źródłowy (source_text) oraz identyfikator talii (deck_id), a backend weryfikuje uprawnienia, waliduje dane wejściowe i wywołuje usługę AI, która generuje pytania i odpowiedzi. Endpoint zapewnia, że tekst źródłowy mieści się w dozwolonych granicach (1000-10000 znaków) oraz, że wygenerowane treści nie przekraczają 400 znaków na pytanie/odpowiedź.

## 2. Szczegóły żądania

- **Metoda HTTP:** POST
- **Struktura URL:** /ai/flashcards/generate
- **Parametry:**
  - **Wymagane:**
    - `deck_id` (string, UUID) – identyfikator talii, do której mają być dodane wygenerowane fiszki
    - `source_text` (string) – długi tekst źródłowy (min. 1000, max. 10000 znaków)
  - **Opcjonalne:** Brak
- **Request Body:**
  ```json
  {
    "deck_id": "uuid",
    "source_text": "Długi tekst źródłowy..."
  }
  ```

## 3. Wykorzystywane typy

- **Command Model:** `GenerateFlashcardsCommand` (zawiera pola `deck_id` oraz `source_text`)
- **Response DTO:** `AIGeneratedSuggestionsDTO` – obiekt zawierający tablicę `suggestions`, gdzie każda sugestia to:
  - `temp_id` (string)
  - `question` (string)
  - `answer` (string)
  - (opcjonalnie) `origin` (ustawione na "ai")
  - (opcjonalnie) `ai_model_name` (string)

## 4. Szczegóły odpowiedzi

- **Kod sukcesu:**
  - 200 OK – przy poprawnym wygenerowaniu propozycji
- **Struktura odpowiedzi (przykład):**
  ```json
  {
    "suggestions": [
      {
        "temp_id": "temp-uuid",
        "question": "Wygenerowane pytanie",
        "answer": "Wygenerowana odpowiedź",
        "origin": "ai",
        "ai_model_name": "nazwa-modelu"
      }
    ]
  }
  ```
- **Inne kody odpowiedzi:**
  - 400 Bad Request – błędy walidacji (np. niepoprawna długość source_text lub brak wymaganych pól)
  - 401 Unauthorized – nieautoryzowany dostęp, brak lub nieważny token
  - 404 Not Found – wskazana talia (`deck_id`) nie istnieje lub nie należy do użytkownika
  - 500 Internal Server Error – błąd po stronie serwera lub usługi AI

## 5. Przepływ danych

1. Odbiór żądania wraz z nagłówkiem autoryzacyjnym (Bearer Token) i ciałem żądania JSON.
2. Walidacja danych wejściowych z użyciem Zod (sprawdzenie obecności `deck_id` oraz `source_text`, weryfikacja długości tekstu).
3. Weryfikacja uprawnień – sprawdzenie czy talia o podanym `deck_id` istnieje i należy do zalogowanego użytkownika (poprzez zapytanie do bazy danych Supabase zgodnie z RLS).
4. Wywołanie usługi AI (np. OpenRouter.ai) z przekazanym `source_text` w celu wygenerowania propozycji fiszek.
5. Ewentualna korekta wyników – upewnienie się, że pytanie i odpowiedź nie przekraczają 400 znaków.
6. Zwrócenie odpowiedzi w formacie `AIGeneratedSuggestionsDTO`.
7. W przypadku wystąpienia błędu, logowanie zdarzenia w tabeli `error_logs`.

## 6. Względy bezpieczeństwa

- **Autoryzacja i uwierzytelnianie:** Użycie tokenu Bearer z Supabase Auth; sprawdzenie, czy talia (`deck_id`) należy do aktualnie zalogowanego użytkownika zgodnie z RLS.
- **Walidacja danych:** Wykorzystanie Zod do walidacji struktury i treści żądania.
- **Bezpieczeństwo danych:** Sanityzacja wejścia; zabezpieczenie wywołań do usługi AI, by nie narażać systemu na ataki typu injection.
- **Ochrona sekretów:** Użycie bezpiecznych metod przekazywania kluczy API do usługi AI (np. poprzez zmienne środowiskowe z import.meta.env w Astro).

## 7. Obsługa błędów

- **400 Bad Request:** Brak wymaganych pól lub naruszenie zasad walidacji (np. source_text krótszy niż 1000 znaków lub dłuższy niż 10000 znaków).
- **401 Unauthorized:** Brak lub nieważny token autoryzacyjny.
- **404 Not Found:** Talia o podanym `deck_id` nie istnieje lub nie należy do użytkownika.
- **500 Internal Server Error:** Błąd z usługi AI lub inny nieoczekiwany błąd. Każdy błąd serwera powinien być logowany do tabeli `error_logs`.

## 8. Rozważania dotyczące wydajności

- Optymalizacja połączeń z bazą dzięki indeksom (np. na polu `created_at`) oraz użyciu zapytań asynchronicznych.
- Ustawienie timeout dla połączenia z usługą AI w celu uniknięcia blokowania żądań.
- Możliwość skalowania wywołań usługi AI w oparciu o kolejki lub mechanizmy asynchroniczne, jeśli obciążenie będzie wysokie.

## 9. Etapy wdrożenia

1. **Utworzenie endpointu w projekcie:**
   - Lokalizacja: `src/pages/api/ai/flashcards/generate.ts`
2. **Implementacja middleware autoryzacji:**
   - Upewnienie się, że żądanie zawiera poprawny token z Supabase Auth.
3. **Walidacja danych wejściowych:**
   - Użycie Zod do walidacji `deck_id` oraz `source_text`.
4. **Sprawdzenie istnienia i własności talii:**
   - Zapytanie do bazy danych Supabase z uwzględnieniem RLS.
5. **Implementacja logiki biznesowej:**
   - Wyodrębnienie logiki do nowej lub istniejącej funkcji serwisowej (np. `generateFlashcards` w `src/lib/services/flashcards.service.ts`).
6. **Integracja z usługą AI:**
   - Wywołanie zewnętrznego API (OpenRouter.ai) i obsługa jego odpowiedzi.
7. **Post-process wygenerowanych danych:**
   - Weryfikacja długości pytania i odpowiedzi oraz korekta wyników w formacie `AIGeneratedSuggestionsDTO`.
8. **Obsługa błędów i logowanie:**
   - Dodanie bloku catch do logowania błędów w tabeli `error_logs` i zwracanie odpowiednich kodów HTTP.
9. **Dokumentacja:**
   - Aktualizacja dokumentacji API zgodnie z wprowadzonymi zmianami.
10. **Code review i deployment:**
    - Przegląd kodu przez zespół oraz wdrożenie w środowisku produkcyjnym.
