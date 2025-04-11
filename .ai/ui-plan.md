# Architektura UI dla Fiszkomat AI

## 1. Przegląd struktury UI

Ogólny interfejs składa się z globalnego paska nawigacji, systemu powiadomień (toast notifications) oraz responsywnego układu opartego na React, Tailwind CSS i komponentach shadcn/ui. Zarządzanie stanem odbywa się przy pomocy React hooks i Context API. Interfejs jest zoptymalizowany pod kątem dostępności (WCAG AA) i bezpieczeństwa – chroni dane uwierzytelniające oraz zapewnia bezpieczną komunikację z backendem (Supabase Auth i API).

## 2. Lista widoków

- **Ekran logowania / rejestracji**

  - Ścieżka: `/login` (oraz opcjonalnie `/register`)
  - Główny cel: Umożliwić użytkownikom logowanie i rejestrację przy użyciu email/password.
  - Kluczowe informacje: Formularz z polami email, hasło (i potwierdzenie hasła), przyciski submit.
  - Kluczowe komponenty: `LoginForm`, `RegisterForm`, `TextInput`, `Button`, komunikaty walidacyjne.
  - Uwagi UX/dostępność: Przejrzysty formularz, etykiety, komunikaty o błędach, zgodność z WCAG AA.

- **Widok listy decków**

  - Ścieżka: `/decks`
  - Główny cel: Prezentacja listy wszystkich decków użytkownika z podstawowymi informacjami.
  - Kluczowe informacje: Nazwa decku, data utworzenia, liczba fiszek.
  - Kluczowe komponenty: `DeckCard`, mechanizm `InfiniteScroll`, `Spinner` podczas ładowania.
  - Uwagi UX/dostępność: Łatwość nawigacji, responsywność, dostępne powiadomienia (toast), wysoki kontrast.

- **Widok szczegółowy decku**

  - Ścieżka: `/decks/{deckId}`
  - Główny cel: Prezentacja szczegółowych informacji o wybranym decku oraz listy powiązanych fiszek.
  - Kluczowe informacje: Pełne dane decku (nazwa, data, opis itp.) oraz dynamicznie ładowana lista fiszek.
  - Kluczowe komponenty: `DeckDetailHeader`, `FlashcardsList`, `Spinner` dla asynchronicznego ładowania.
  - Uwagi UX/dostępność: Wyraźne informacje, animowany spinner, potwierdzenie operacji (toasty).

- **Ekran generowania AI fiszek**

  - Ścieżka: `/ai/generate`
  - Główny cel: Umożliwić użytkownikowi generowanie fiszek przez AI.
  - Kluczowe informacje: Formularz wyboru decku, pole tekstowe na wklejenie notatek (1000-10000 znaków), przycisk uruchamiający generowanie oraz wskaźnik ładowania.
  - Kluczowe komponenty: `DeckSelector`, `TextAreaInput`, `Button`, `Spinner`.
  - Uwagi UX/dostępność: Walidacja długości tekstu, przejrzysty interfejs, jasne komunikaty o stanie generowania.

- **Sesja nauki SRS**

  - Ścieżka: `/srs/session`
  - Główny cel: Przeprowadzenie użytkownika przez sesję powtórek fiszek wg algorytmu SRS.
  - Kluczowe informacje: Aktualna fiszka do nauki, opcja odkrycia odpowiedzi, przyciski oceny (np. "Źle", "Średnio", "Dobrze").
  - Kluczowe komponenty: `SRSCard`, `AnswerToggle`, `RatingButtons`, `SummaryModal` (podsumowanie sesji).
  - Uwagi UX/dostępność: Intuicyjny przepływ nauki, zarządzanie focus, kompatybilność z czytnikami ekranu.

- **Panel zarządzania deckami/fiszkami** (opcjonalnie jako komponenty edycyjne lub modale)
  - Ścieżka: Część widoku listy decków lub dostępny poprzez modal
  - Główny cel: Umożliwić dodawanie, edycję i usuwanie decków oraz fiszek.
  - Kluczowe informacje: Formularze i przyciski operacyjne z potwierdzeniami usunięć.
  - Kluczowe komponenty: `DeckForm`, `FlashcardForm`, `ConfirmationModal`, `ToastNotifications`.
  - Uwagi UX/dostępność: Bezpieczne operacje, wyraźny feedback, potwierdzenia krytycznych operacji.

## 3. Mapa podróży użytkownika

1. Użytkownik trafia na ekran logowania (`/login`). W razie potrzeby może się również zarejestrować.
2. Po udanym logowaniu użytkownik ląduje na widoku listy decków (`/decks`), gdzie górny pasek nawigacji wyświetla adres email i opcję wylogowania.
3. Użytkownik wybiera konkretny deck, przechodząc do widoku szczegółowego (`/decks/{deckId}`), gdzie widzi szczegółowe informacje oraz listę fiszek.
4. Użytkownik wybiera opcję generowania fiszek AI, przechodząc do `/ai/generate`, wybiera deck, wkleja tekst i rozpoczyna proces generowania z wizualnym wskaźnikiem (spinner).
5. Po zaakceptowaniu/odrzuceniu propozycji fiszek, użytkownik przechodzi do sesji nauki SRS (`/srs/session`), gdzie ocenia fiszki i na koniec otrzymuje podsumowanie wyników.
6. Operacje takie jak dodawanie, edycja czy usuwanie generują toast notifications informujące o sukcesie lub błędach.

## 4. Układ i struktura nawigacji

- Globalny pasek nawigacyjny (Navbar) umieszczony na górze ekranu, widoczny na wszystkich stronach dla zalogowanych użytkowników.
  - Elementy: Logo, linki do widoków (Decki, Generowanie AI, Nauka SRS), wyświetlanie adresu email oraz przycisk wylogowania.
- Nawigacja jest responsywna – na urządzeniach mobilnych dostępne jest menu hamburger.
- Linki umożliwiają płynne przejścia między widokami przy użyciu React Router (lub innego mechanizmu nawigacji w React).

## 5. Kluczowe komponenty

- **Navbar:** Globalny pasek nawigacyjny z dostępem do głównych widoków, wyświetlanie emaila i przycisk wylogowania.
- **ToastNotifications:** System powiadomień informujących o wynikach operacji (sukces, błąd, informacja).
- **InfiniteScroll:** Mechanizm ładowania kolejnych decków w widoku listy decków.
- **Spinner:** Wskaźnik ładowania dla operacji asynchronicznych (ładowanie fiszek, generowanie AI).
- **Forms (LoginForm, RegisterForm, DeckForm, FlashcardForm):** Formularze wejściowe z walidacją oraz wsparciem dla dostępności.
- **Modal:** Okno potwierdzenia krytycznych operacji, np. usuwania.
- **ContextProvider:** Globalne zarządzanie stanem autoryzacji i danych aplikacji.
