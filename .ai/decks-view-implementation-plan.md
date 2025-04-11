# Plan implementacji widoku listy decków (Decks List View)

## 1. Przegląd

Widok listy decków (`/decks`) jest głównym miejscem, gdzie użytkownicy mogą przeglądać, tworzyć i zarządzać swoimi grupami fiszek (deckami). Widok prezentuje listę decków użytkownika, umożliwia dodawanie nowych decków oraz usuwanie istniejących. Wykorzystuje mechanizm nieskończonego przewijania (infinite scroll) do ładowania kolejnych decków i zapewnia responsywny interfejs użytkownika.

## 2. Routing widoku

Widok będzie dostępny pod ścieżką `/decks`. Wymaga zalogowanego użytkownika.

## 3. Struktura komponentów

Hierarchia komponentów dla widoku listy decków:
src/pages/decks.astro (Strona Astro)
└── src/layouts/MainLayout.astro (Layout)
└── src/components/DeckList.tsx (Komponent React - client:load)
├── src/components/ui/button.tsx (Przycisk "Dodaj Deck" - shadcn) -> Otwiera CreateDeckDialog
├── src/components/ui/spinner.tsx (Wskaźnik ładowania - shadcn/custom) [Warunkowo]
├── src/components/EmptyState.tsx (Komponent React) [Warunkowo]
├── src/components/DeckCard.tsx[] (Komponent React)
│ ├── Link (Komponent Astro/React Router) -> Nawiguje do /decks/{deckId}
│ └── src/components/ui/button.tsx (Przycisk "Usuń" - shadcn) -> Otwiera DeleteDeckConfirmationDialog
├── InfiniteScrollTrigger (Logika/niewidoczny komponent w DeckList.tsx)
├── src/components/CreateDeckDialog.tsx (Komponent React - shadcn Dialog)
│ ├── src/components/ui/input.tsx (Pole tekstowe - shadcn)
│ └── src/components/ui/button.tsx (Przyciski - shadcn)
└── src/components/DeleteDeckConfirmationDialog.tsx (Komponent React - shadcn AlertDialog)
└── src/components/ui/button.tsx (Przyciski - shadcn)

## 4. Szczegóły komponentów

### `DeckList.tsx`

- **Opis komponentu:** Główny komponent React renderujący listę decków, przycisk tworzenia, obsługujący logikę pobierania danych (w tym infinite scroll), tworzenia, usuwania, zarządzanie stanem (ładowanie, błędy, paginacja) oraz wyświetlanie odpowiednich dialogów i stanu pustego. Wykorzystuje hook `useDecks`.
- **Główne elementy:** Przycisk "Dodaj Deck", lista komponentów `DeckCard`, komponent `EmptyState` (gdy brak decków), `Spinner` (podczas ładowania), `InfiniteScrollTrigger` (do wykrywania końca listy), `CreateDeckDialog`, `DeleteDeckConfirmationDialog`.
- **Obsługiwane interakcje:** Kliknięcie "Dodaj Deck", przewijanie listy (triggerowanie infinite scroll), obsługa zdarzeń z `DeckCard` (usunięcie), obsługa zdarzeń z dialogów (potwierdzenie utworzenia/usunięcia).
- **Obsługiwana walidacja:** Obsługa stanu ładowania i błędów z API. Walidacja logiki paginacji i infinite scroll.
- **Typy:** `DeckViewModel`, `PaginatedResponse<DeckDTO>`, `DeckCreateCommand`.
- **Propsy:** Brak (zarządza własnym stanem przy użyciu `useDecks`).

### `DeckCard.tsx`

- **Opis komponentu:** Wyświetla informacje o pojedynczym decku (nazwa, data utworzenia). Umożliwia nawigację do widoku szczegółów decku oraz inicjuje proces usuwania.
- **Główne elementy:** Kontener (np. `div` stylizowany przez Tailwind), nazwa decku (`h3` lub `p`), data utworzenia (`p`), przycisk/ikona usuwania (shadcn `Button` z ikoną). Całość opakowana w link do `/decks/{deckId}`.
- **Obsługiwane interakcje:** Kliknięcie na kartę (nawigacja do `/decks/{deckId}`), kliknięcie przycisku "Usuń".
- **Obsługiwana walidacja:** Brak.
- **Typy:** `DeckViewModel`.
- **Propsy:**
  - `deck: DeckViewModel` - Obiekt z danymi decku do wyświetlenia.
  - `onDelete: (deckId: string) => void` - Funkcja zwrotna wywoływana po kliknięciu przycisku usuwania.

### `CreateDeckDialog.tsx`

- **Opis komponentu:** Modal (dialog shadcn) z formularzem do tworzenia nowego decku. Zawiera pole tekstowe na nazwę i przyciski akcji.
- **Główne elementy:** Komponent `Dialog` (shadcn), `DialogHeader`, `DialogTitle`, `DialogContent`, `DialogFooter`, `Input` (shadcn) dla nazwy decku, `Button` (shadcn) "Zapisz", `Button` (shadcn) "Anuluj". Miejsce na wyświetlenie błędu walidacji/API.
- **Obsługiwane interakcje:** Wpisywanie nazwy, kliknięcie "Zapisz", kliknięcie "Anuluj", zamknięcie dialogu.
- **Obsługiwana walidacja:**
  - Nazwa jest wymagana (nie może być pusta/składać się tylko z białych znaków).
  - Nazwa nie może przekraczać 100 znaków.
  - Wyświetlanie błędów zwróconych przez API (np. o duplikacji nazwy).
  - Blokowanie przycisku "Zapisz" podczas wysyłania żądania.
- **Typy:** `DeckCreateCommand`.
- **Propsy:**
  - `isOpen: boolean` - Kontroluje widoczność dialogu.
  - `onClose: () => void` - Funkcja zwrotna wywoływana przy zamknięciu dialogu.
  - `onSubmit: (name: string) => Promise<void>` - Funkcja zwrotna wywoływana po pomyślnym przesłaniu formularza (asynchroniczna, aby obsłużyć stan ładowania).
  - `isLoading: boolean` - Wskazuje, czy trwa proces tworzenia.
  - `error: string | null` - Komunikat błędu do wyświetlenia.

### `DeleteDeckConfirmationDialog.tsx`

- **Opis komponentu:** Modal potwierdzenia (AlertDialog shadcn) wyświetlany przed usunięciem decku. Informuje użytkownika o konsekwencjach.
- **Główne elementy:** Komponent `AlertDialog` (shadcn), `AlertDialogHeader`, `AlertDialogTitle` ("Potwierdź usunięcie"), `AlertDialogContent` (tekst ostrzegawczy, np. "Czy na pewno chcesz usunąć grupę '[Nazwa Grupy]'? Spowoduje to usunięcie wszystkich fiszek w niej zawartych. Tej akcji nie można cofnąć."), `AlertDialogFooter`, `AlertDialogAction` ("Usuń"), `AlertDialogCancel` ("Anuluj").
- **Obsługiwane interakcje:** Kliknięcie "Usuń", kliknięcie "Anuluj".
- **Obsługiwana walidacja:** Brak.
- **Typy:** `DeckViewModel` (lub tylko `deckId` i `deckName`).
- **Propsy:**
  - `isOpen: boolean` - Kontroluje widoczność dialogu.
  - `onClose: () => void` - Funkcja zwrotna wywoływana przy zamknięciu dialogu.
  - `onConfirm: () => Promise<void>` - Funkcja zwrotna wywoływana po potwierdzeniu usunięcia (asynchroniczna).
  - `deckName: string` - Nazwa decku do wyświetlenia w komunikacie.
  - `isLoading: boolean` - Wskazuje, czy trwa proces usuwania.

### `EmptyState.tsx`

- **Opis komponentu:** Wyświetlany, gdy użytkownik nie ma żadnych decków. Zawiera informację i opcjonalnie przycisk do utworzenia pierwszego decku.
- **Główne elementy:** Kontener `div`, tekst (np. "Nie masz jeszcze żadnych grup. Utwórz nową!"), opcjonalnie `Button` (shadcn) "Utwórz Deck".
- **Obsługiwane interakcje:** Opcjonalnie kliknięcie przycisku "Utwórz Deck".
- **Obsługiwana walidacja:** Brak.
- **Typy:** Brak.
- **Propsy:**
  - `onCreateClick?: () => void` - Opcjonalna funkcja zwrotna wywoływana po kliknięciu przycisku tworzenia.

## 5. Typy

- **`DeckDTO`** (z `@/types.ts`): Podstawowy obiekt transferu danych dla decku z API.
  ```typescript
  type DeckDTO = {
    id: string; // UUID
    name: string;
    created_at: string; // ISO timestamp string
    updated_at: string; // ISO timestamp string
  };
  ```
- **`PaginatedResponse<T>`** (z `@/types.ts`): Generyczny typ dla odpowiedzi z paginacją.
  ```typescript
  interface PaginatedResponse<T> {
    data: T[];
    page: number;
    limit: number;
    total: number;
  }
  ```
- **`DeckCreateCommand`** (z `@/types.ts`): Obiekt wysyłany w ciele żądania `POST /decks`.
  ```typescript
  interface DeckCreateCommand {
    name: string;
  }
  ```
- **`MessageDTO`** (z `@/types.ts`): Generyczny obiekt odpowiedzi z wiadomością (np. dla `DELETE`).
  ```typescript
  interface MessageDTO {
    message: string;
  }
  ```
- **`DeckViewModel`** (Nowy typ): Typ używany w komponencie `DeckList` i `DeckCard` do łatwiejszego zarządzania danymi na frontendzie.
  ```typescript
  interface DeckViewModel {
    id: string;
    name: string;
    createdAt: Date; // Parsed Date object for formatting
    // flashcardCount?: number; // Pominięte w MVP z powodu braku w API
    // isDeleting?: boolean; // Opcjonalny stan do UI
  }
  ```
  - `id`: Identyfikator decku.
  - `name`: Nazwa decku.
  - `createdAt`: Data utworzenia jako obiekt `Date`.

## 6. Zarządzanie stanem

Zalecane jest stworzenie customowego hooka `useDecks` (`/src/hooks/useDecks.ts`), który będzie zarządzał całym stanem związanym z deckami w tym widoku.

- **Stan zarządzany przez `useDecks`:**
  - `decks: DeckViewModel[]`: Aktualna lista załadowanych decków.
  - `isLoading: boolean`: Czy trwa ładowanie (początkowe lub kolejna strona).
  - `isCreating: boolean`: Czy trwa tworzenie nowego decku.
  - `isDeleting: Record<string, boolean>`: Status usuwania dla poszczególnych decków (np. `{ [deckId]: true }`).
  - `error: Error | null`: Obiekt błędu, jeśli wystąpił podczas operacji API.
  - `currentPage: number`: Aktualnie załadowana strona.
  - `totalDecks: number`: Całkowita liczba decków użytkownika.
  - `hasMore: boolean`: Czy są jeszcze dostępne decki do załadowania (`currentPage * limit < totalDecks`).
- **Funkcje eksportowane przez `useDecks`:**
  - `loadMoreDecks()`: Ładuje kolejną stronę decków.
  - `createDeck(name: string)`: Wysyła żądanie utworzenia decku.
  - `deleteDeck(deckId: string)`: Wysyła żądanie usunięcia decku.
  - `retryFetch()`: (Opcjonalnie) Ponawia ostatnie nieudane żądanie.
- **Użycie:** Komponent `DeckList` importuje i wykorzystuje ten hook do pobierania danych i wywoływania akcji. Stan dla otwarcia/zamknięcia dialogów (`CreateDeckDialog`, `DeleteDeckConfirmationDialog`) będzie zarządzany lokalnie w `DeckList` za pomocą `useState`.

## 7. Integracja API

Integracja z API będzie realizowana za pomocą klienta `supabase-js` (dostępnego globalnie lub przez kontekst) wewnątrz hooka `useDecks`.

- **`GET /api/decks`:**
  - **Wywołanie:** `supabase.from('decks').select('*', { count: 'exact' }).eq('user_id', userId).order('name', { ascending: true }).range(from, to)` (przykładowe zapytanie z sortowaniem alfabetycznym i paginacją; API route `/api/decks` opakowuje logikę Supabase).
  - **Parametry zapytania:** `page`, `limit` (obliczane na podstawie `currentPage`), `sort_by=name`, `order=asc`.
  - **Odpowiedź:** `PaginatedResponse<DeckDTO>`. Mapowanie `DeckDTO` na `DeckViewModel` w hooku.
- **`POST /api/decks`:**
  - **Wywołanie:** Wysłanie żądania POST do `/api/decks` z odpowiednim ciałem.
  - **Ciało żądania:** `DeckCreateCommand` (`{ name: string }`).
  - **Odpowiedź:** `DeckDTO` nowo utworzonego decku. Aktualizacja listy `decks` w stanie hooka.
- **`DELETE /api/decks/{deckId}`:**
  - **Wywołanie:** Wysłanie żądania DELETE do `/api/decks/{deckId}`.
  - **Odpowiedź:** `MessageDTO`. Usunięcie decku z listy `decks` w stanie hooka.

Wszystkie żądania muszą zawierać nagłówek `Authorization: Bearer <token>`, co jest automatycznie obsługiwane przez `supabase-js`, jeśli użytkownik jest zalogowany.

## 8. Interakcje użytkownika

- **Ładowanie widoku:** Pobierana jest pierwsza strona decków (`GET /api/decks`). Wyświetlany jest `Spinner`. Po załadowaniu wyświetlana jest lista `DeckCard` lub `EmptyState`.
- **Przewijanie listy:** Gdy użytkownik zbliża się do końca listy i `hasMore` jest `true`, wywoływane jest `loadMoreDecks()`. Wyświetlany jest `Spinner` (np. na dole listy), pobierana jest kolejna strona (`GET /api/decks?page=N`), a nowe decki są dodawane do listy.
- **Kliknięcie "Dodaj Deck":** Otwiera `CreateDeckDialog`.
- **Wypełnienie formularza tworzenia i kliknięcie "Zapisz":** Wywoływane jest `createDeck(name)`. Przycisk "Zapisz" jest blokowany. Po pomyślnym utworzeniu (`POST /api/decks`), dialog jest zamykany, lista decków jest aktualizowana, wyświetlany jest toast sukcesu. W przypadku błędu (np. walidacji), błąd jest wyświetlany w dialogu, przycisk jest odblokowywany.
- **Kliknięcie przycisku "Usuń" na `DeckCard`:** Otwiera `DeleteDeckConfirmationDialog` dla danego decku.
- **Kliknięcie "Usuń" w dialogu potwierdzenia:** Wywoływane jest `deleteDeck(deckId)`. Po pomyślnym usunięciu (`DELETE /api/decks/{deckId}`), dialog jest zamykany, deck jest usuwany z listy, wyświetlany jest toast sukcesu. W przypadku błędu, dialog jest zamykany, wyświetlany jest toast błędu.
- **Kliknięcie obszaru `DeckCard` (poza przyciskiem usuwania):** Użytkownik jest przekierowywany do widoku szczegółów decku (`/decks/{deckId}`).

## 9. Warunki i walidacja

- **Tworzenie decku (`CreateDeckDialog`):**
  - Pole `name` jest wymagane (nie może być puste).
  - Pole `name` nie może przekraczać 100 znaków.
  - Walidacja wykonywana po stronie klienta (np. przy zmianie wartości lub przed wysłaniem) oraz po stronie serwera (unikalność nazwy).
  - Stan UI: Komunikaty o błędach wyświetlane przy polu input. Przycisk "Zapisz" nieaktywny, jeśli walidacja klienta nie przejdzie lub trwa wysyłanie.
- **Pobieranie decków (`useDecks`):**
  - Wymagany jest poprawny token autoryzacyjny.
  - Parametry `page` i `limit` muszą być dodatnimi liczbami całkowitymi.
- **Usuwanie decku (`useDecks`):**
  - Wymagany jest poprawny token autoryzacyjny.
  - Wymagany jest poprawny `deckId`.

## 10. Obsługa błędów

- **Błędy sieciowe / 5xx (wszystkie operacje API):** Hook `useDecks` przechwytuje błąd, ustawia stan `error`. Komponent `DeckList` wyświetla generyczny komunikat błędu (np. "Wystąpił błąd podczas komunikacji z serwerem. Spróbuj ponownie później.") lub/i toast błędu. Logowanie błędu po stronie serwera (zgodnie z planem implementacji endpointu).
- **Błąd 401 Unauthorized:** Klient Supabase powinien podjąć próbę odświeżenia tokenu. Jeśli to niemożliwe, użytkownik powinien zostać poinformowany o wygaśnięciu sesji i ewentualnie przekierowany do logowania.
- **Błąd 400 Bad Request (`POST /decks`):** API zwraca błąd walidacji (np. duplikat nazwy). Hook `useDecks` ustawia `error`. Komponent `CreateDeckDialog` wyświetla konkretny komunikat błędu zwrócony przez API.
- **Błąd 404 Not Found (`DELETE /decks/{deckId}`):** Deck nie istnieje. Hook `useDecks` ustawia `error`. Wyświetlany jest toast informujący o błędzie ("Nie znaleziono decku do usunięcia."). Deck (jeśli był wyświetlany optymistycznie) powinien zostać usunięty z listy lub lista odświeżona.
- **Stan pusty:** Jeśli `GET /api/decks` zwróci pustą listę (`total === 0`), komponent `DeckList` renderuje komponent `EmptyState`.
- **Brak kolejnych decków:** Gdy `hasMore` staje się `false`, `InfiniteScrollTrigger` przestaje wywoływać `loadMoreDecks()`.

## 11. Kroki implementacji

1.  **Utworzenie strony Astro:** Stwórz plik `/src/pages/decks.astro`. Dodaj podstawową strukturę, importuj layout i komponent `DeckList`. Zaimplementuj podstawowe sprawdzenie autoryzacji (np. przekierowanie do `/login`, jeśli użytkownik nie jest zalogowany).
2.  **Implementacja hooka `useDecks`:** Stwórz plik `/src/hooks/useDecks.ts`. Zaimplementuj logikę pobierania pierwszej strony decków (`GET /api/decks`), zarządzanie stanem `decks`, `isLoading`, `error`.
3.  **Implementacja komponentu `DeckList` (podstawowa):** Stwórz plik `/src/components/DeckList.tsx`. Użyj hooka `useDecks`. Wyrenderuj `Spinner` podczas ładowania, `EmptyState` dla pustej listy lub listę `DeckCard` dla załadowanych danych. Dodaj przycisk "Dodaj Deck".
4.  **Implementacja komponentu `DeckCard`:** Stwórz plik `/src/components/DeckCard.tsx`. Wyświetl `name` i `createdAt` (sformatowaną datę) z propsa `deck`. Dodaj `Link` do `/decks/{deck.id}` i przycisk "Usuń" wywołujący `props.onDelete(deck.id)`.
5.  **Implementacja `CreateDeckDialog`:** Stwórz plik `/src/components/CreateDeckDialog.tsx`. Użyj komponentów shadcn (`Dialog`, `Input`, `Button`). Zaimplementuj logikę formularza, walidację po stronie klienta i obsługę stanu `isLoading` oraz `error` z propsów.
6.  **Integracja tworzenia decku:** W `DeckList` dodaj stan do zarządzania otwarciem `CreateDeckDialog`. Połącz przycisk "Dodaj Deck" z otwarciem dialogu. Zaimplementuj funkcję `handleCreateSubmit` w `DeckList`, która wywołuje `createDeck` z hooka `useDecks` i przekazuje ją jako prop `onSubmit` do `CreateDeckDialog`. Zaktualizuj hook `useDecks`, aby zawierał funkcję `createDeck` i stan `isCreating`.
7.  **Implementacja `DeleteDeckConfirmationDialog`:** Stwórz plik `/src/components/DeleteDeckConfirmationDialog.tsx`. Użyj komponentu `AlertDialog` (shadcn). Wyświetl ostrzeżenie z `deckName`.
8.  **Integracja usuwania decku:** W `DeckList` dodaj stan do zarządzania otwarciem `DeleteDeckConfirmationDialog` i przechowywania `deckId` do usunięcia. Połącz przycisk "Usuń" w `DeckCard` z otwarciem dialogu (przekazując `deckId` przez `onDelete` prop). Zaimplementuj funkcję `handleDeleteConfirm` w `DeckList`, która wywołuje `deleteDeck` z hooka `useDecks`. Zaktualizuj hook `useDecks`, aby zawierał funkcję `deleteDeck` i stan `isDeleting`.
9.  **Implementacja Infinite Scroll:** W `useDecks` dodaj logikę paginacji (`currentPage`, `totalDecks`, `hasMore`, `limit`) i funkcję `loadMoreDecks`. W `DeckList` dodaj logikę `InfiniteScrollTrigger` (np. z `IntersectionObserver`), która wywołuje `loadMoreDecks`, gdy użytkownik zbliża się do końca listy i `hasMore` jest `true`. Wyświetlaj `Spinner` podczas ładowania kolejnych stron.
10. **Styling i Responsywność:** Zastosuj Tailwind CSS do stylizacji wszystkich komponentów zgodnie z ogólnym designem aplikacji. Upewnij się, że widok jest responsywny i wygląda dobrze na różnych rozmiarach ekranu.
11. **Obsługa Toastów:** Zintegruj system powiadomień (np. `react-hot-toast` lub wbudowany w shadcn) i wywołuj toasty informujące o sukcesie lub błędzie operacji tworzenia i usuwania w hooku `useDecks`.
12. **Testowanie:** Przetestuj wszystkie funkcjonalności manualnie: ładowanie, infinite scroll, tworzenie (walidacja, sukces, błąd unikalności), usuwanie (potwierdzenie, sukces, błąd), stan pusty, responsywność, obsługa błędów API.
13. **Refaktoryzacja i Code Review:** Przejrzyj kod pod kątem czystości, zgodności z wytycznymi i potencjalnych ulepszeń.
