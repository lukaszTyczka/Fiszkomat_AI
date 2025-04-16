# Plan Testów: Fiszkomat AI - MVP

## 1. Wprowadzenie

### 1.1. Cel Dokumentu

Niniejszy dokument określa strategię, zakres, zasoby i harmonogram działań związanych z testowaniem aplikacji "Fiszkomat AI" w wersji Minimum Viable Product (MVP). Celem testów jest weryfikacja zgodności aplikacji z wymaganiami funkcjonalnymi i niefunkcjonalnymi opisanymi w dokumencie PRD, identyfikacja defektów oraz ocena ogólnej jakości i gotowości produktu do udostępnienia grupie fokusowej (early adopters).

### 1.2. Przegląd Produktu

Fiszkomat AI to aplikacja webowa (Astro + React) wspomagająca naukę poprzez generowanie fiszek (Q&A) z tekstu użytkownika za pomocą AI (przez OpenRouter), ręczne tworzenie fiszek, ich organizację w grupy (Decki) oraz naukę z wykorzystaniem systemu powtórek rozłożonych w czasie (SRS). Backend oparty jest o Supabase (Baza danych PostgreSQL, Auth, Edge Functions).

## 2. Zakres Testów (Scope of Testing)

### 2.1. W Zakresie (In Scope)

Testowaniu podlegają następujące moduły i funkcjonalności MVP:

- **Moduł Uwierzytelniania (Supabase Auth):**
  - Rejestracja nowego użytkownika (zgodnie z wybraną metodą Supabase).
  - Logowanie zarejestrowanego użytkownika.
  - Wylogowanie użytkownika.
  - Zarządzanie sesją użytkownika.
  - Obsługa błędów uwierzytelniania. (FR*AUTH*\*)
- **Moduł Zarządzania Grupami (Deckami):**
  - Tworzenie nowej grupy fiszek z walidacją nazwy (długość, unikalność). (US3, FR_GM_1-4)
  - Wyświetlanie listy grup użytkownika (sortowanie alfabetyczne). (US7, FR_GM_5)
  - Usuwanie grupy wraz z zawartością (z potwierdzeniem). (US11, FR_GM_6-7)
- **Moduł Tworzenia Fiszek przez AI:**
  - Wprowadzanie tekstu źródłowego z walidacją limitu znaków (1k-10k). (US4, FR_AI_1-2)
  - Wybór istniejącej lub tworzenie nowej grupy docelowej. (US4, FR_AI_3)
  - Inicjacja procesu generowania fiszek przez AI (OpenRouter). (US4, FR_AI_4)
  - Wyświetlanie wskaźnika ładowania podczas przetwarzania AI. (FR_AI_5)
  - Prezentacja listy wygenerowanych propozycji Q&A. (US4, FR_AI_6)
  - Obsługa limitu znaków dla Q&A (400 znaków), w tym próby automatycznej korekty i odrzucenie. (FR_AI_7)
  - Akceptacja proponowanej fiszki (zapis w wybranej grupie). (US4, FR_AI_8-9)
  - Odrzucenie proponowanej fiszki. (US5, FR_AI_8, FR_AI_10)
  - Obsługa błędów komunikacji z AI/OpenRouter. (FR_AI_11, AIR_OR_6)
- **Moduł Ręcznego Tworzenia Fiszek:**
  - Dostęp do formularza dodawania w kontekście wybranej grupy. (US6, FR_MAN_1)
  - Wprowadzanie Pytania i Odpowiedzi z walidacją (puste pola, limit 400 znaków). (US6, FR_MAN_2-3)
  - Zapis fiszki w bieżącej grupie. (US6, FR_MAN_4)
  - Feedback po zapisie i czyszczenie formularza. (US6, FR_MAN_5)
  - Obsługa błędów zapisu. (FR_MAN_6)
- **Moduł Przeglądania Fiszek:**
  - Wybór grupy i wyświetlanie listy fiszek w niej zawartych. (US7, FR_VIEW_1-2)
  - Domyślne wyświetlanie Pytania, odkrywanie Odpowiedzi po akcji użytkownika. (US7, FR_VIEW_3)
  - Sortowanie fiszek (od najnowszej). (FR_VIEW_4)
  - Usuwanie pojedynczej fiszki (z potwierdzeniem). (US10, FR_VIEW_5-6)
  - Obsługa długich list fiszek (wybrany mechanizm: paginacja/scroll). (FR_VIEW_7)
  - Obsługa pustej grupy. (FR_VIEW_8)
- **Moduł Nauki (SRS):**
  - Inicjacja sesji nauki (globalna / dla grupy). (US8, FR_SRS_1-2)
  - Działanie podstawowego algorytmu SRS (wybór fiszek "na dziś"). (FR_SRS_3)
  - Interfejs nauki: prezentacja Pytania, odkrywanie Odpowiedzi, opcje oceny znajomości. (US9, FR_SRS_4-7)
  - Aktualizacja stanu SRS fiszki po ocenie. (US9, FR_SRS_8)
  - Przebieg i zakończenie sesji (automatyczne / ręczne). (FR_SRS_9)
  - Obsługa braku fiszek do powtórki. (FR_SRS_10)
  - Brak możliwości usuwania fiszek w trybie nauki. (FR_SRS_11)
- **Wymagania Niefunkcjonalne (podstawowy zakres):**
  - **Wydajność:** Podstawowa weryfikacja czasów odpowiedzi UI (NFR_Perf_1), obserwacja zachowania podczas generowania AI (NFR_Perf_2).
  - **Bezpieczeństwo:** Weryfikacja HTTPS (NFR_Sec_3), podstawowa weryfikacja zarządzania sekretami (brak klucza API w kodzie - NFR_Sec_1), testy kontroli dostępu (autoryzacja - NFR_Sec_2), podstawowe testy XSS w polach wejściowych.
  - **Użyteczność:** Testy eksploracyjne pod kątem intuicyjności (NFR_Usa_1, UXR1), responsywność interfejsu (RWD) na różnych rozmiarach ekranu (NFR_Usa_2).
  - **Niezawodność:** Testowanie obsługi błędów API zewnętrznych (NFR_Rel_2), weryfikacja logowania błędów (jeśli dostępne w środowisku testowym - NFR_Rel_3).

### 2.2. Poza Zakresem (Out of Scope)

Następujące elementy są wyłączone z zakresu testów MVP:

- Szczegółowe testy wydajnościowe i obciążeniowe (np. symulacja setek jednoczesnych użytkowników).
- Pełne testy penetracyjne i zaawansowany audyt bezpieczeństwa.
- Testy kompatybilności na szerokiej gamie starszych lub mniej popularnych przeglądarek i systemów operacyjnych (skupienie na najnowszych wersjach popularnych przeglądarek: Chrome, Firefox, Safari, Edge).
- Szczegółowe testy dostępności (a11y) wykraczające poza podstawowe dobre praktyki (UXR4).
- Testowanie wewnętrznej logiki i jakości modeli AI dostarczanych przez OpenRouter (testujemy integrację i obsługę wyników).
- Testowanie infrastruktury i usług dostarczanych przez Supabase, DigitalOcean, OpenRouter (zakładamy ich poprawność działania, testujemy _integrację_ z nimi).
- Testowanie procesu CI/CD (GitHub Actions) samego w sobie (skupiamy się na jakości produktu końcowego).

## 3. Strategia Testów

Przyjęta zostanie mieszana strategia testowania, łącząca testy manualne i automatyczne na różnych poziomach:

- **Podejście oparte na ryzyku:** Priorytetyzacja testów skupi się na krytycznych ścieżkach użytkownika (np. logowanie, generowanie fiszek, nauka SRS) oraz obszarach o największym ryzyku (np. integracja z AI, logika SRS, walidacja danych).
- **Traceability:** Przypadki testowe (szczególnie E2E) będą powiązane z User Stories (US) i Wymaganiami Funkcjonalnymi (FR) z PRD.
- **Testy Manualne:** Wykorzystywane głównie do testów eksploracyjnych, testów użyteczności, weryfikacji UI/UX, oraz testowania scenariuszy trudnych do zautomatyzowania lub o niskim priorytecie automatyzacji dla MVP.
- **Testy Automatyczne:** Implementowane na poziomach jednostkowym, integracyjnym i E2E w celu zapewnienia szybkiego feedbacku, regresji i pokrycia kluczowych funkcjonalności.
- **Testowanie Regresyjne:** Wykonywane po wprowadzeniu zmian w kodzie lub naprawie błędów, aby upewnić się, że nowe zmiany nie wprowadziły defektów w istniejących funkcjonalnościach (głównie za pomocą testów automatycznych).
- **Testowanie Eksploracyjne:** Wykonywane w celu odkrycia nieprzewidzianych problemów, badania użyteczności i przypadków brzegowych.

## 4. Poziomy Testów

### 4.1. Testy Jednostkowe (Unit Tests)

- **Cel:** Weryfikacja poprawności działania małych, izolowanych fragmentów kodu (funkcji, metod, komponentów UI).
- **Technologia/Narzędzia:**
  - **Frontend (Astro/React/TypeScript):** `Vitest`, `React Testing Library`.
  - **Backend (Supabase Edge Functions - Deno/TypeScript):** Wbudowany runner testów `Deno` (`deno test`) lub kompatybilne biblioteki.
- **Zakres:**
  - Logika komponentów React (np. walidacja formularzy, obsługa stanu, renderowanie warunkowe).
  - Funkcje pomocnicze w `src/lib` (np. formatowanie danych, walidacje).
  - Podstawowa logika w Supabase Edge Functions (np. walidacja danych wejściowych, proste transformacje danych, fragmenty logiki SRS).
  - Mockowanie zależności zewnętrznych (np. wywołania API, dostęp do bazy danych).

### 4.2. Testy Integracyjne (Integration Tests)

- **Cel:** Weryfikacja interakcji pomiędzy różnymi modułami/komponentami systemu oraz z usługami zewnętrznymi.
- **Technologia/Narzędzia:**
  - `Vitest` z możliwością mockowania lub testowania na tle lokalnej instancji Supabase (jeśli dostępna).
  - Narzędzia Supabase do lokalnego developmentu i testowania Edge Functions.
  - Potencjalnie `Supertest` (lub odpowiednik Deno) do testowania API Edge Functions.
- **Zakres:**
  - Integracja komponentów Frontend (React/Astro) z klientem `supabase-js` (poprawność wywołań API Supabase).
  - Integracja Supabase Edge Functions z bazą danych PostgreSQL (operacje CRUD, poprawność zapytań).
  - Integracja z Supabase Auth (weryfikacja ochrony zasobów).
  - Integracja Edge Functions z API OpenRouter (wysyłanie zapytań, obsługa odpowiedzi i błędów – może wymagać mockowania OpenRouter lub użycia trybu testowego jeśli dostępny).
  - Pełny przepływ logiki SRS angażujący Edge Functions i bazę danych.

### 4.3. Testy End-to-End (E2E Tests)

- **Cel:** Weryfikacja kompletnych przepływów użytkownika (User Journeys) z perspektywy interfejsu użytkownika, symulując realne interakcje.
- **Technologia/Narzędzia:**
  - `Playwright` (preferowane ze względu na nowoczesność i dobrą integrację z TS/JS).
- **Zakres (Przykładowe scenariusze oparte na US/FR):**
  - **Pełny cykl życia fiszki AI:** Rejestracja -> Logowanie -> Utworzenie Grupy -> Wklejenie tekstu -> Wygenerowanie fiszek -> Akceptacja kilku fiszek -> Odrzucenie kilku fiszek -> Przejrzenie zaakceptowanych fiszek w grupie -> Wylogowanie.
  - **Ręczne dodawanie i nauka:** Logowanie -> Przejście do istniejącej grupy -> Dodanie fiszki ręcznie (z walidacją) -> Rozpoczęcie sesji nauki SRS dla tej grupy -> Ocena dodanej fiszki -> Zakończenie sesji.
  - **Zarządzanie:** Logowanie -> Utworzenie grupy -> Dodanie kilku fiszek -> Usunięcie jednej fiszki -> Usunięcie całej grupy (z potwierdzeniem).
  - **Scenariusze błędów:** Próba logowania z błędnymi danymi, próba utworzenia grupy o istniejącej nazwie, próba dodania fiszki przekraczającej limit znaków, próba generowania AI z tekstem poza limitem.

## 5. Testy Niefunkcjonalne

- **Wydajność:** Manualna obserwacja czasów ładowania kluczowych widoków (lista grup, lista fiszek) w środowisku testowym przy użyciu narzędzi deweloperskich przeglądarki (zakładka Network, Lighthouse). Weryfikacja responsywności UI podczas operacji. Zgłaszanie zauważalnych spowolnień.
- **Bezpieczeństwo:** Manualna weryfikacja podstawowych aspektów: użycie HTTPS, brak kluczy API w kodzie frontendu, działanie kontroli dostępu (próba dostępu do zasobów bez logowania), podstawowe próby wstrzyknięcia skryptów (XSS) w polach tekstowych (np. nazwa grupy, Pytanie/Odpowiedź).
- **Użyteczność:** Wykonywanie testów eksploracyjnych przez testerów wcielających się w rolę studenta. Ocena łatwości nawigacji, zrozumiałości komunikatów, ogólnej intuicyjności interfejsu. Weryfikacja responsywności (RWD) na różnych szerokościach ekranu (narzędzia deweloperskie przeglądarki).
- **Niezawodność:** Manualne testowanie obsługi błędów (np. poprzez symulację braku połączenia sieciowego podczas wywołania API, jeśli możliwe). Weryfikacja, czy błędy serwera/API są komunikowane użytkownikowi w zrozumiały sposób. Sprawdzenie logów systemowych w środowisku testowym (jeśli dostępne) pod kątem rejestrowania błędów.

## 6. Środowiska Testowe

- **Lokalne Środowisko Deweloperskie:** Używane przez deweloperów i testerów do uruchamiania testów jednostkowych i integracyjnych. Może wykorzystywać lokalne emulatory/narzędzia Supabase.
- **Środowisko Testowe/Staging:** Odseparowana instancja aplikacji wdrożona na infrastrukturze zbliżonej do produkcyjnej (np. dedykowany projekt Supabase, dedykowana instancja na DigitalOcean). Używane do testów E2E, testów niefunkcjonalnych i UAT (User Acceptance Testing) przez grupę fokusową. Środowisko to powinno mieć własną, odizolowaną bazę danych.
- **Środowisko Produkcyjne:** Dostępne dla końcowych użytkowników. Na tym środowisku wykonywane będą jedynie podstawowe testy typu "smoke test" po każdym wdrożeniu, aby potwierdzić kluczową funkcjonalność.

## 7. Dane Testowe

- **Strategia:** Przygotowanie zestawu danych testowych pokrywających różne scenariusze i przypadki brzegowe.
- **Rodzaje Danych:**
  - Dane użytkowników (nowi, z grupami/fiszkami, bez grup/fiszek).
  - Dane grup (różne nazwy, puste, z małą/średnią/dużą liczbą fiszek).
  - Dane fiszek (różne długości Q&A, różne stany SRS, znaki specjalne).
  - Teksty źródłowe dla AI (krótkie, długie - blisko limitów, o różnej tematyce, potencjalnie problematyczne).
- **Zarządzanie:**
  - Dane do testów jednostkowych/integracyjnych będą głównie mockowane lub generowane ad-hoc.
  - Dla środowiska Testowego/Staging zostaną przygotowane skrypty seedujące bazę danych lub dane będą wprowadzane manualnie/półautomatycznie.
  - Należy unikać używania realnych danych użytkowników w środowiskach testowych. Jeśli konieczne, dane muszą zostać zanonimizowane.

## 8. Kryteria Wejścia/Wyjścia

### 8.1. Kryteria Wejścia (Rozpoczęcie Testów)

- Dostępna stabilna wersja aplikacji (build) wdrożona na odpowiednim środowisku testowym.
- Środowisko testowe jest skonfigurowane i dostępne.
- Dostęp do dokumentacji (PRD, Tech Spec).
- Zdefiniowane i przygotowane przypadki testowe (przynajmniej dla kluczowych funkcjonalności) lub checklisty do testów eksploracyjnych.
- Zakończone i zakończone sukcesem testy jednostkowe dla kluczowych komponentów (zgodnie z definicją deweloperów).

### 8.2. Kryteria Wyjścia (Zakończenie Testów / Gotowość do Wydania MVP)

- Wszystkie zdefiniowane przypadki testowe dla krytycznych i wysokiego priorytetu przepływów zostały wykonane.
- Procent przypadków testowych zakończonych sukcesem osiągnął zdefiniowany próg (np. 95% dla krytycznych/wysokich, 85% ogółem).
- Wszystkie wymagania funkcjonalne (Sekcja 5 PRD) zostały pokryte testami i zweryfikowane (RC1).
- Kluczowe przepływy użytkownika (RC2) działają poprawnie w testach E2E.
- Osiągnięto cel jakościowy dla generowania AI (>75% akceptacji w testach wewnętrznych - RC3).
- Brak znanych błędów krytycznych (blokujących działanie aplikacji) i wysokiego priorytetu (RC4).
- Wszystkie znalezione błędy krytyczne i wysokiego priorytetu zostały naprawione i retestowane.
- Znane błędy o niskim priorytecie są udokumentowane i zaakceptowane przez interesariuszy.
- Przeprowadzono podstawową weryfikację bezpieczeństwa (RC5).
- Potwierdzono spełnienie kluczowych wymagań niefunkcjonalnych na akceptowalnym poziomie dla MVP (RC9).

## 9. Ryzyka i Ograniczenia

### 9.1. Ryzyka

- **Zależność od API Zewnętrznych:** Niestabilność, zmiany lub błędy w API Supabase lub OpenRouter mogą blokować testy lub działanie aplikacji.
- **Jakość Generowania AI:** Wyniki generowane przez AI mogą być nieprzewidywalne, trudne do jednoznacznej weryfikacji automatycznej i mogą nie spełniać oczekiwań jakościowych (>75% akceptacji).
- **Wydajność:** Aplikacja może napotkać problemy wydajnościowe przy większej ilości danych (fiszek, grup), trudne do przewidzenia na etapie MVP.
- **Złożoność SRS:** Dokładne testowanie logiki algorytmu SRS i jego długoterminowego działania może być trudne w ramach czasowych MVP.
- **Ograniczone Zasoby/Czas:** Presja czasu typowa dla MVP może ograniczyć głębokość i zakres przeprowadzonych testów.
- **Niestabilność Środowisk:** Problemy z konfiguracją lub stabilnością środowisk testowych mogą opóźniać testowanie.

### 9.2. Ograniczenia

- Testy MVP skupią się na podstawowej funkcjonalności i krytycznych ścieżkach. Pełne pokrycie wszystkich przypadków brzegowych i scenariuszy nie jest celem.
- Testy niefunkcjonalne będą miały charakter podstawowy/eksploracyjny.
- Automatyzacja E2E obejmie tylko wybrane, najważniejsze przepływy użytkownika.

## 10. Metryki Testów

Następujące metryki będą zbierane i raportowane w celu śledzenia postępu i jakości testów:

- Liczba zaplanowanych vs. wykonanych przypadków testowych.
- Procent przypadków testowych zakończonych sukcesem / niepowodzeniem / zablokowanych.
- Liczba zgłoszonych defektów (wg statusu, priorytetu, krytyczności).
- Liczba naprawionych i zweryfikowanych defektów.
- Liczba otwartych defektów krytycznych i wysokiego priorytetu.
- Pokrycie wymagań (Requirements Coverage) - % wymagań (FR/US) pokrytych przypadkami testowymi.
- Wskaźnik akceptacji fiszek generowanych przez AI (monitorowany podczas testów).
- Gęstość defektów (Defect Density) - opcjonalnie, jeśli dostępne będą wiarygodne miary rozmiaru kodu/funkcjonalności.
