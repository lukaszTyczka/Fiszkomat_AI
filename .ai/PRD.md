# Product Requirements Document (PRD): Fiszkomat AI - MVP

## 1. Wprowadzenie

### 1.1. Cel Dokumentu i Projektu
Niniejszy dokument (PRD) szczegółowo opisuje wymagania dla Minimum Viable Product (MVP) aplikacji "Fiszkomat AI". Służy jako przewodnik dla dewelopera, definiując *co* ma zostać zbudowane, *dla kogo* i *dlaczego*. **Należy zaznaczyć, że oprócz celu stworzenia funkcjonalnego MVP, nadrzędnym celem tego projektu jest walor edukacyjny.**

### 1.2. Przegląd Produktu
Fiszkomat AI to aplikacja webowa wspomagająca proces nauki poprzez automatyczne generowanie fiszek (Q&A) z tekstu dostarczonego przez użytkownika (np. notatek z wykładów) z wykorzystaniem Sztucznej Inteligencji (AI). MVP umożliwia również ręczne tworzenie fiszek, organizowanie ich w grupy (Decki) oraz naukę z wykorzystaniem systemu powtórek rozłożonych w czasie (Spaced Repetition System - SRS).

## 2. Cele i Założenia

### 2.1. Cele Biznesowe / Produktowe MVP
* Zweryfikowanie rynkowego zapotrzebowania na narzędzie automatyzujące tworzenie fiszek z notatek za pomocą AI.
* Dostarczenie realnej wartości pierwszej grupie użytkowników (studentom) poprzez oszczędność czasu i usprawnienie nauki.
* Zebranie danych i feedbacku od użytkowników w celu podejmowania świadomych decyzji dotyczących dalszego rozwoju produktu.
* Osiągnięcie wskaźnika akceptacji fiszek generowanych przez AI na poziomie > 75%.

### 2.2. Kluczowe Założenia
* Użytkownicy (studenci) posiadają notatki w formie cyfrowego tekstu.
* Istnieje dostęp do odpowiedniego API modelu AI (przez OpenRouter) zdolnego do generowania sensownych pytań i odpowiedzi z tekstu.
* Użytkownicy są skłonni poświęcić czas na weryfikację (akceptację/odrzucenie) fiszek wygenerowanych przez AI.
* Prosty system SRS jest wystarczający dla potrzeb MVP.
* Aplikacja będzie rozwijana iteracyjnie, a UI/UX dopracowywane na podstawie feedbacku.

## 3. Grupa Docelowa

* **Główni Użytkownicy:** Studenci szkół wyższych i średnich, uczestnicy kursów, osoby samouczące się, które tworzą notatki tekstowe i potrzebują efektywnego sposobu na ich przyswojenie.
* **Potrzeby Użytkownika:** Oszczędność czasu przy tworzeniu materiałów do nauki, efektywna metoda powtórek, podstawowa organizacja materiałów według przedmiotów/tematów.
* **Scenariusz Użycia (Persona Uproszczona - Student):** Anna jest studentką II roku, ma dużo notatek z wykładów w formie cyfrowej. Chce szybko przekształcić je w fiszki, aby przygotować się do sesji, ale nie ma czasu na ręczne przepisywanie. Chciałaby mieć możliwość nauki w autobusie (aplikacja webowa dostępna na telefonie) i systematycznych powtórek materiału z różnych przedmiotów, pogrupowanych tematycznie.

## 4. User Stories / Przypadki Użycia

* **US1 (Rejestracja):** Jako nowy użytkownik, chcę móc założyć konto w aplikacji [Metoda zależna od wybranej implementacji Auth], aby móc zapisywać swoje fiszki i postępy w nauce.
    * **AC1:** Po pomyślnym procesie jestem zalogowany do aplikacji.
    * **AC2:** Moje konto użytkownika zostało utworzone i jest powiązane z unikalnym identyfikatorem.
    * **AC3:** Wybrana metoda rejestracji jest zgodna z wymaganiami bezpieczeństwa (FR_AUTH).

* **US2 (Logowanie):** Jako zarejestrowany użytkownik, chcę móc zalogować się na swoje konto [Metoda zależna od wybranej implementacji Auth], aby uzyskać dostęp do moich fiszek i grup.
    * **AC1:** Po pomyślnym uwierzytelnieniu uzyskuję dostęp do aplikacji jako zalogowany użytkownik.
    * **AC2:** Próba logowania z niepoprawnymi danymi / nieudanego uwierzytelnienia zewnętrznego skutkuje wyświetleniem błędu.
    * **AC3:** Moja sesja jest poprawnie zarządzana po zalogowaniu.

* **US3 (Tworzenie Grupy):** Jako zalogowany użytkownik, chcę móc stworzyć nową grupę fiszek (np. 'Biologia Molekularna'), aby móc kategoryzować moje materiały do nauki.
    * **AC1:** Mogę wprowadzić nazwę dla nowej grupy (maks. 100 znaków).
    * **AC2:** System sprawdza unikalność nazwy grupy w obrębie mojego konta.
    * **AC3:** Po pomyślnym utworzeniu grupa pojawia się na mojej liście grup.

* **US4 (Generowanie Fiszek AI):** Jako zalogowany użytkownik, chcę móc wybrać grupę, wkleić tekst moich notatek (1k-10k znaków), uruchomić generator AI, przejrzeć proponowane fiszki Q&A i zaakceptować te dobre, aby szybko stworzyć materiał do nauki w odpowiedniej kategorii.
    * **AC1:** Mogę wybrać istniejącą grupę lub stworzyć nową przed generowaniem.
    * **AC2:** Mogę wkleić tekst w limicie znaków i zainicjować generowanie.
    * **AC3:** System prezentuje listę wygenerowanych propozycji Q&A (max 400 znaków dla Q i A, po ewentualnej korekcie AI).
    * **AC4:** Mogę kliknąć "Akceptuj", a fiszka zostanie zapisana w wybranej wcześniej grupie.

* **US5 (Odrzucanie Fiszek AI):** Jako zalogowany użytkownik, podczas przeglądania fiszek wygenerowanych przez AI, chcę móc odrzucić te niepoprawne lub bezużyteczne, aby nie zaśmiecały mojej bazy wiedzy.
    * **AC1:** Każda propozycja AI ma widoczną opcję "Odrzuć".
    * **AC2:** Po kliknięciu "Odrzuć", propozycja jest usuwana z widoku i nie jest zapisywana.

* **US6 (Ręczne Tworzenie Fiszek):** Jako zalogowany użytkownik, będąc w widoku konkretnej grupy, chcę móc ręcznie dodać fiszkę (Pytanie, Odpowiedź, maks. 400 znaków) do tej grupy, aby uzupełnić materiał o specyficzne informacje.
    * **AC1:** W widoku grupy dostępna jest opcja ręcznego dodania fiszki.
    * **AC2:** Formularz pozwala wprowadzić Pytanie i Odpowiedź (z walidacją limitu 400 znaków i pustych pól).
    * **AC3:** Po zapisaniu fiszka jest dodawana do bieżącej grupy.
    * **AC4:** Formularz jest gotowy do dodania kolejnej fiszki (pola wyczyszczone).

* **US7 (Przeglądanie Fiszek):** Jako zalogowany użytkownik, chcę móc zobaczyć listę moich grup, a po wybraniu grupy zobaczyć listę fiszek w niej zawartych (Pytanie widoczne, Odpowiedź po kliknięciu), aby móc zarządzać moimi materiałami.
    * **AC1:** Widzę listę moich grup (posortowaną alfabetycznie).
    * **AC2:** Kliknięcie na grupę wyświetla listę fiszek w niej (posortowaną od najnowszej).
    * **AC3:** Na liście widzę Pytanie, kliknięcie odkrywa Odpowiedź.
    * **AC4:** Długie listy są obsługiwane (paginacja/scroll). Pusta grupa wyświetla komunikat.

* **US8 (Nauka - Sesja SRS):** Jako zalogowany użytkownik, chcę móc rozpocząć sesję nauki (powtórek SRS) dla wszystkich moich fiszek (globalnie) lub dla wybranej grupy, aby systematycznie utrwalać wiedzę.
    * **AC1:** Mam dostęp do globalnej opcji "Ucz się wszystkiego".
    * **AC2:** Mam dostęp do opcji "Ucz się" przy każdej grupie.
    * **AC3:** Sesja nauki wybiera tylko fiszki "do powtórki na dziś" z odpowiedniego zakresu.
    * **AC4:** Jeśli brak fiszek do powtórki, widzę stosowny komunikat.

* **US9 (Nauka - Proces Powtórki):** Podczas sesji nauki SRS, chcę widzieć pytanie fiszki, móc samodzielnie odpowiedzieć, a następnie odkryć poprawną odpowiedź i ocenić swoją znajomość, aby system mógł zaplanować kolejną powtórkę.
    * **AC1:** Prezentowane jest Pytanie fiszki.
    * **AC2:** Mogę aktywować pokazanie Odpowiedzi.
    * **AC3:** Po pokazaniu Odpowiedzi dostępne są przyciski oceny (min. 2-3 poziomy).
    * **AC4:** Po dokonaniu oceny, stan SRS fiszki jest aktualizowany, a system przechodzi do kolejnej fiszki (jeśli są).

* **US10 (Usuwanie Fiszki):** Jako zalogowany użytkownik, przeglądając fiszki w grupie, chcę móc usunąć pojedynczą fiszkę (z potwierdzeniem), aby móc pozbyć się nieaktualnych lub błędnych informacji.
    * **AC1:** W widoku listy fiszek grupy widoczna jest opcja usunięcia przy każdej fiszce.
    * **AC2:** Aktywacja usunięcia wywołuje prośbę o potwierdzenie.
    * **AC3:** Po potwierdzeniu fiszka jest usuwana z systemu i znika z listy.

* **US11 (Usuwanie Grupy):** Jako zalogowany użytkownik, chcę móc usunąć całą grupę fiszek (z potwierdzeniem i usunięciem zawartości), aby móc łatwo uporządkować swoje materiały.
    * **AC1:** Na liście grup widoczna jest opcja usunięcia przy każdej grupie.
    * **AC2:** Aktywacja usunięcia wywołuje prośbę o potwierdzenie (z informacją o usunięciu fiszek).
    * **AC3:** Po potwierdzeniu grupa i wszystkie jej fiszki są usuwane z systemu, a grupa znika z listy.

## 5. Wymagania Funkcjonalne

### 5.1. Moduł Uwierzytelniania (Wymagania Ogólne)

Aplikacja "Fiszkomat AI" musi implementować bezpieczny, niezawodny i zgodny z dobrymi praktykami mechanizm uwierzytelniania użytkowników, pozwalający na identyfikację użytkowników i ochronę ich danych. **Konkretna metoda implementacji (np. własny system email/hasło, logowanie przez dostawcę OAuth jak Google, wykorzystanie platformy typu BaaS jak Supabase Auth) zostanie wybrana na etapie projektowania technicznego / implementacji.** Niezależnie od wybranej metody, muszą być spełnione następujące wymagania:

* **FR_AUTH_1 (Identyfikacja Użytkownika):** Musi istnieć jednoznaczny sposób identyfikacji każdego zarejestrowanego użytkownika w systemie (np. unikalny ID użytkownika, adres email).
* **FR_AUTH_2 (Bezpieczny Proces Logowania):** Proces logowania musi być bezpieczny i chronić dane uwierzytelniające użytkownika (np. hasła, tokeny OAuth) podczas przesyłania i weryfikacji.
* **FR_AUTH_3 (Rejestracja / Tworzenie Konta):** Musi istnieć sposób na tworzenie kont dla nowych użytkowników. Jeśli używane jest logowanie przez dostawcę zewnętrznego (np. Google), tworzenie konta lokalnego może być automatyczne przy pierwszym logowaniu. Jeśli używany jest system email/hasło, wymagany jest bezpieczny proces rejestracji.
* **FR_AUTH_4 (Zarządzanie Sesją):** Po pomyślnym uwierzytelnieniu, system musi ustanowić i bezpiecznie zarządzać sesją użytkownika, pozwalając mu na dostęp do chronionych zasobów aplikacji. Sesja musi mieć rozsądny czas trwania i/lub mechanizmy odświeżania.
* **FR_AUTH_5 (Ochrona Danych):** Wszelkie dane związane z uwierzytelnianiem (np. hashowane hasła, sole, tokeny odświeżania, powiązania z ID dostawcy zewnętrznego) muszą być przechowywane i zarządzane w bezpieczny sposób.
* **FR_AUTH_6 (Logout):** Zalogowany użytkownik musi mieć możliwość zakończenia swojej sesji w aplikacji poprzez wyraźną akcję "Wyloguj".
* **FR_AUTH_7 (Podstawowe Bezpieczeństwo):** Implementacja musi uwzględniać ochronę przed podstawowymi zagrożeniami związanymi z uwierzytelnianiem i zarządzaniem sesją (np. odpowiednie praktyki dla wybranej metody).
* **FR_AUTH_8 (Obsługa Błędów):** Proces logowania i rejestracji musi w sposób zrozumiały informować użytkownika o błędach (np. nieprawidłowe dane, problem z usługą zewnętrzną).

### 5.2. Moduł Zarządzania Grupami (Deckami)

* **FR_GM_1 (Inicjacja Tworzenia):** Zalogowany użytkownik musi mieć w interfejsie wyraźną opcję (np. przycisk "+ Nowa Grupa" lub podobny) pozwalającą zainicjować proces tworzenia nowej grupy fiszek.
* **FR_GM_2 (Podanie Nazwy):** Podczas tworzenia nowej grupy, system musi wymagać od użytkownika podania jej nazwy. Nazwa grupy nie może być pusta i **nie może przekraczać 100 znaków**.
* **FR_GM_3 (Unikalność Nazwy):** Nazwa grupy musi być unikalna w obrębie konta danego użytkownika. System musi uniemożliwić stworzenie grupy o nazwie, która już istnieje dla tego użytkownika i wyświetlić odpowiedni komunikat błędu.
* **FR_GM_4 (Zapis Grupy):** Po pomyślnym zatwierdzeniu (np. kliknięciu "Zapisz" lub "Utwórz"), nowa grupa (z jej nazwą i powiązaniem z użytkownikiem) musi zostać zapisana w bazie danych.
* **FR_GM_5 (Listowanie Grup):** System musi w łatwo dostępnym miejscu (np. panel boczny, dedykowana sekcja "Moje Grupy") wyświetlać listę wszystkich grup stworzonych przez aktualnie zalogowanego użytkownika. Lista powinna być posortowana alfabetycznie. W przypadku braku grup, należy wyświetlić stosowny komunikat (np. "Nie masz jeszcze żadnych grup. Utwórz nową!").
* **FR_GM_6 (Inicjacja Usuwania):** Użytkownik musi mieć możliwość zainicjowania usunięcia dla każdej ze swoich grup widocznych na liście (np. poprzez ikonkę kosza lub opcję w menu kontekstowym obok nazwy grupy).
* **FR_GM_7 (Potwierdzenie i Usunięcie Grupy):** Przed ostatecznym usunięciem grupy, system musi wyświetlić użytkownikowi prośbę o potwierdzenie tej akcji, informując, że usunięcie grupy spowoduje również **nieodwracalne usunięcie wszystkich fiszek w niej zawartych** (np. "Czy na pewno chcesz usunąć grupę '[Nazwa Grupy]' i wszystkie [X] fiszek w niej? Tej akcji nie można cofnąć."). Dopiero po potwierdzeniu przez użytkownika, grupa oraz wszystkie powiązane z nią fiszki są usuwane z bazy danych.

### 5.3. Moduł Tworzenia Fiszek przez AI

* **FR_AI_1 (Pole Tekstowe):** System musi udostępniać wyraźnie oznaczone, wieloliniowe pole tekstowe (textarea) do wprowadzenia (wklejenia) tekstu źródłowego przez użytkownika.
* **FR_AI_2 (Limit Tekstu Wejściowego):** Pole tekstowe powinno mieć jasno zakomunikowany limit znaków wejściowych, ustalony na **1000 do 10000 znaków**. System musi walidować długość wprowadzonego tekstu po stronie klienta (informując użytkownika) i/lub po stronie serwera przed wysłaniem do AI. Próba wysłania tekstu poza limitem powinna skutkować błędem i czytelnym komunikatem dla użytkownika.
* **FR_AI_3 (Wybór/Tworzenie Grupy Docelowej):** Przed zainicjowaniem generowania fiszek, system musi wymagać od użytkownika:
    * Albo wybrania istniejącej grupy docelowej z listy jego grup (np. lista rozwijana).
    * Albo umożliwienia szybkiego stworzenia nowej grupy w tym miejscu (np. opcja "+ Dodaj nową grupę", która uruchamia mechanizm tworzenia grupy opisany w FR_GM_1/FR_GM_2/FR_GM_3/FR_GM_4). Wybrana lub nowo utworzona grupa staje się grupą docelową dla fiszek z tej sesji generowania.
* **FR_AI_4 (Inicjacja Generowania):** Po wprowadzeniu tekstu i wybraniu/utworzeniu grupy docelowej, musi istnieć wyraźny przycisk (np. "Generuj Fiszki do grupy '[Nazwa Grupy]'"), który inicjuje proces przetwarzania tekstu przez AI.
* **FR_AI_5 (Stan Ładowania):** Podczas gdy AI przetwarza tekst, interfejs użytkownika w tym obszarze musi wyraźnie wskazywać stan ładowania/przetwarzania (np. animowany wskaźnik, zablokowanie przycisku "Generuj"). Użytkownik nie powinien móc inicjować kolejnego żądania generowania w tym czasie.
* **FR_AI_6 (Lista Propozycji):** Po pomyślnym przetworzeniu przez AI, system musi wyświetlić listę wygenerowanych propozycji fiszek (par Pytanie-Odpowiedź). Każda propozycja powinna być przedstawiona w czytelny sposób (np. jako oddzielna "karta").
* **FR_AI_7 (Obsługa Limitu Znaków P/O):**
    * **FR_AI_7a (Prompt):** Podstawową metodą zapewnienia limitu **400 znaków** dla Pytania i Odpowiedzi jest odpowiednie sformułowanie promptu systemowego wysyłanego do AI.
    * **FR_AI_7b (Walidacja):** System musi po stronie serwera walidować długość Pytania i Odpowiedzi *każdej* propozycji zwróconej przez AI.
    * **FR_AI_7c (Automatyczna Korekta):** Jeśli Pytanie lub Odpowiedź w propozycji przekracza 400 znaków, system musi podjąć próbę automatycznej korekty: wysyła *drugie, specyficzne żądanie* do API AI, prosząc o skrócenie/przeformułowanie *tego konkretnego* Pytania/Odpowiedzi, aby zmieściło się w limicie.
    * **FR_AI_7d (Odrzucenie po Korekcie):** Jeśli po drugiej próbie (korekcie przez AI) Pytanie lub Odpowiedź *nadal* przekracza limit 400 znaków, propozycja ta jest automatycznie odrzucana przez system i nie jest prezentowana użytkownikowi (lub jest wyraźnie oznaczona jako niemożliwa do zaakceptowania i nieaktywna).
* **FR_AI_8 (Akcje Akceptuj/Odrzuć):** Każda wyświetlona (i możliwa do zaakceptowania) propozycja fiszki musi posiadać dwa wyraźne przyciski akcji: "Akceptuj" i "Odrzuć".
* **FR_AI_9 (Proces Akceptacji):** Po kliknięciu przycisku "Akceptuj" dla danej propozycji:
    * Fiszka (Pytanie, Odpowiedź) musi zostać zapisana w bazie danych, powiązana z kontem użytkownika oraz **grupą wybraną przed procesem generowania (zgodnie z FR_AI_3)**.
    * Interfejs musi dać użytkownikowi informację zwrotną o pomyślnym zapisaniu (np. krótki komunikat, zmiana wyglądu przycisku).
    * Zaakceptowana propozycja powinna zostać usunięta z listy oczekujących propozycji lub wyraźnie oznaczona jako "Zaakceptowana/Zapisana".
* **FR_AI_10 (Proces Odrzucenia):** Po kliknięciu przycisku "Odrzuć" dla danej propozycji, powinna ona zostać usunięta z listy oczekujących propozycji (bez zapisywania w bazie danych).
* **FR_AI_11 (Obsługa Błędów AI):** System musi być przygotowany na obsługę różnych błędów związanych z AI (błędy komunikacji, błędy API, brak sensownych wyników) i informować o nich użytkownika w sposób zrozumiały, przerywając stan ładowania.

### 5.4. Moduł Ręcznego Tworzenia Fiszek

* **FR_MAN_1 (Dostęp do Funkcji):** W widoku szczegółów (lub liście fiszek) danej grupy, system musi udostępniać użytkownikowi wyraźną opcję (np. przycisk "+ Dodaj fiszkę ręcznie") pozwalającą zainicjować proces ręcznego dodawania *nowej fiszki do tej konkretnej, aktualnie przeglądanej grupy*.
* **FR_MAN_2 (Wygląd Formularza):** Po aktywacji opcji z FR_MAN_1, system musi wyświetlić formularz zawierający co najmniej:
    * Pole tekstowe (np. `input type="text"` lub `textarea`) dla "Pytania", z widocznym limitem **400 znaków**.
    * Pole tekstowe (np. `textarea`) dla "Odpowiedzi", z widocznym limitem **400 znaków**.
    * Przycisk "Zapisz" lub "Dodaj Fiszke".
    *(Formularz nie zawiera pola wyboru grupy, gdyż jest ona określona przez kontekst, w którym użytkownik zainicjował dodawanie)*.
* **FR_MAN_3 (Walidacja Wprowadzonych Danych):** Przed zapisem system musi przeprowadzić walidację:
    * Pole "Pytanie" nie może być puste.
    * Pole "Odpowiedź" nie może być puste.
    * Długość tekstu w polu "Pytanie" nie może przekraczać 400 znaków.
    * Długość tekstu w polu "Odpowiedź" nie może przekraczać 400 znaków.
    * W przypadku niespełnienia któregokolwiek warunku, system musi wyświetlić użytkownikowi czytelny komunikat błędu przy odpowiednim polu i uniemożliwić zapis.
* **FR_MAN_4 (Proces Zapisu):** Po kliknięciu przycisku "Zapisz" i pomyślnej walidacji (zgodnie z FR_MAN_3), system musi zapisać nową fiszkę (Pytanie, Odpowiedź) w bazie danych, powiązaną z kontem użytkownika oraz **grupą, w kontekście której użytkownik dodaje fiszkę**.
* **FR_MAN_5 (Feedback i Zachowanie po Zapisie):** Bezpośrednio po pomyślnym zapisaniu fiszki:
    * System musi wyświetlić użytkownikowi krótki, nieinwazyjny komunikat potwierdzający sukces (np. "Fiszka została dodana!").
    * **Pola formularza ('Pytanie', 'Odpowiedź') muszą zostać automatycznie wyczyszczone**, aby umożliwić użytkownikowi szybkie dodanie kolejnej fiszki do tej samej grupy bez konieczności dodatkowych akcji. Użytkownik pozostaje w tym samym widoku.
* **FR_MAN_6 (Obsługa Błędów Zapisu):** W przypadku wystąpienia problemu podczas zapisu fiszki do bazy danych (np. błąd serwera, utrata połączenia), system musi poinformować użytkownika o niepowodzeniu, wyświetlając odpowiedni komunikat błędu.

### 5.5. Moduł Przeglądania Fiszek

* **FR_VIEW_1 (Wybór Grupy do Przeglądania):** Użytkownik musi mieć możliwość zainicjowania przeglądania zawartości konkretnej grupy, np. poprzez kliknięcie na nazwę tej grupy na liście grup (wyświetlanej zgodnie z wymaganiem FR_GM_5).
* **FR_VIEW_2 (Wyświetlenie Listy Fiszek):** Po wybraniu grupy (zgodnie z FR_VIEW_1), system musi w głównym obszarze widoku wyświetlić listę wszystkich fiszek należących do tej wybranej grupy.
* **FR_VIEW_3 (Prezentacja Fiszki na Liście):** Każdy element na liście musi domyślnie wyświetlać **tylko treść Pytania**. Musi istnieć mechanizm (np. kliknięcie na obszar fiszki/pytania) pozwalający użytkownikowi **odkryć/wyświetlić również treść Odpowiedzi** dla tej konkretnej fiszki.
* **FR_VIEW_4 (Kolejność Sortowania Fiszek):** Fiszki na liście muszą być domyślnie posortowane według **daty ich utworzenia, od najnowszej do najstarszej (Descending)**.
* **FR_VIEW_5 (Akcja Usuwania Pojedynczej Fiszki):** Bezpośrednio przy każdym elemencie fiszki na liście (w widoku zawartości grupy) musi znajdować się wyraźna opcja (np. ikonka kosza) pozwalająca użytkownikowi na zainicjowanie procesu usunięcia tej konkretnej fiszki.
* **FR_VIEW_6 (Potwierdzenie Usunięcia Fiszki):** Po aktywacji opcji usuwania z FR_VIEW_5, system musi wyświetlić użytkownikowi modalne okno dialogowe lub podobny mechanizm z prośbą o ostateczne potwierdzenie tej akcji (np. "Czy na pewno chcesz trwale usunąć tę fiszkę? Pytanie: '[fragment pytania]'"). Usunięcie następuje dopiero po potwierdzeniu przez użytkownika.
* **FR_VIEW_7 (Obsługa Długich List):** System musi implementować mechanizm efektywnego obsługiwania długich list fiszek w grupie (np. > 50 elementów), aby zapobiec problemom z wydajnością i użytecznością interfejsu. **Konkretna metoda realizacji tego wymagania (np. tradycyjna paginacja z numerami stron LUB mechanizm 'nieskończonego' przewijania/dynamicznego doładowywania listy) zostanie wybrana podczas implementacji**, z uwzględnieniem optymalnego doświadczenia użytkownika i złożoności implementacyjnej dla MVP.
* **FR_VIEW_8 (Obsługa Pustej Grupy):** Jeśli wybrana przez użytkownika grupa (z FR_VIEW_1) nie zawiera żadnych fiszek, system zamiast listy fiszek musi wyświetlić stosowny, przyjazny komunikat (np. "Ta grupa jest pusta. Możesz dodać fiszki ręcznie za pomocą przycisku '+ Dodaj fiszkę ręcznie' lub wygenerować je z notatek za pomocą AI.").

### 5.6. Moduł Nauki (SRS - Spaced Repetition System)

* **FR_SRS_1 (Inicjacja Sesji Nauki):** System musi udostępniać użytkownikowi co najmniej dwa łatwo dostępne sposoby inicjacji sesji nauki:
    * a) Globalny przycisk/opcja (np. w głównym menu lub na dashboardzie) oznaczony jako "Ucz się wszystkiego", pozwalająca rozpocząć sesję dla wszystkich fiszek użytkownika.
    * b) Przycisk/opcja (np. ikonka "Ucz się") widoczna przy każdej grupie na liście grup użytkownika, pozwalająca rozpocząć sesję tylko dla fiszek z tej konkretnej grupy.
* **FR_SRS_2 (Wybór Zakresu Nauki):** W zależności od sposobu inicjacji (z FR_SRS_1), system musi prawidłowo filtrować fiszki do nauki: albo wszystkie należące do użytkownika, albo tylko te z wybranej grupy.
* **FR_SRS_3 (Algorytm SRS):** System musi implementować **podstawowy**, działający algorytm Spaced Repetition, którego celem jest planowanie daty następnej powtórki dla każdej fiszki na podstawie historii odpowiedzi użytkownika. **Implementacja może opierać się na bardzo prostym, własnym mechanizmie LUB wykorzystywać istniejące rozwiązanie/bibliotekę open-source** dostosowane do potrzeb MVP. Kluczowe jest, aby algorytm potrafił identyfikować fiszki, których zapisana data następnej powtórki przypada na dzień bieżący lub wcześniej (fiszki "do powtórki na dziś").
* **FR_SRS_4 (Interfejs Nauki - Prezentacja Pytania):** Po rozpoczęciu sesji, system prezentuje użytkownikowi interfejs nauki, wyświetlając **tylko Pytanie** z pierwszej fiszki wybranej przez algorytm SRS jako "do powtórki na dziś".
* **FR_SRS_5 (Odkrycie Odpowiedzi):** W interfejsie nauki musi istnieć wyraźny przycisk lub inna intuicyjna interakcja (np. "Pokaż Odpowiedź"), która pozwoli użytkownikowi odkryć/wyświetlić **Odpowiedź** do aktualnie prezentowanego Pytania.
* **FR_SRS_6 (Interfejs Nauki - Prezentacja Odpowiedzi i Oceny):** Po odkryciu Odpowiedzi, system wyświetla ją użytkownikowi (nadal widoczne jest Pytanie) ORAZ udostępnia zestaw przycisków służących do samooceny stopnia znajomości tej fiszki.
* **FR_SRS_7 (Opcje Oceny Znajomości):** System musi udostępniać użytkownikowi zestaw opcji (przycisków) do samooceny. **Konkretna liczba poziomów oceny (np. 2, 3 lub 4) oraz ich etykiety (np. "Źle", "Średnio", "Łatwo") zostaną ustalone podczas implementacji**, w zależności od wybranej implementacji algorytmu SRS (FR_SRS_3) i wyników testów użyteczności. Musi istnieć co najmniej opcja wskazująca na brak znajomości (wymagająca szybkiej powtórki) i opcja wskazująca na dobrą znajomość (pozwalająca na dłuższy interwał).
* **FR_SRS_8 (Aktualizacja Stanu SRS Fiszki):** Po wybraniu przez użytkownika jednej z opcji oceny (z FR_SRS_7), system musi:
    * Użyć tej oceny jako wejścia do algorytmu SRS (FR_SRS_3) do obliczenia nowego interwału powtórki i ustalenia nowej daty następnej powtórki dla tej fiszki.
    * Zaktualizować i zapisać w bazie danych nowy stan SRS tej fiszki (przynajmniej `next_review_date`, ewentualnie inne parametry używane przez algorytm).
* **FR_SRS_9 (Przebieg i Zakończenie Sesji Nauki):**
    * Sesja nauki powinna obejmować **wszystkie** fiszki z wybranego zakresu (Wszystkie/Grupa), które są zidentyfikowane przez algorytm SRS jako "do powtórki na dziś".
    * Po ocenie jednej fiszki, system automatycznie przechodzi do prezentacji Pytania z kolejnej fiszki "do powtórki".
    * Sesja kończy się automatycznie po przejrzeniu i ocenie wszystkich fiszek zaplanowanych na dany dzień w wybranym zakresie.
    * Użytkownik musi mieć możliwość **przerwania/zakończenia sesji nauki wcześniej** (np. poprzez dedykowany przycisk "Zakończ sesję na dziś").
    * Stan sesji (które karty zostały już ocenione *w trakcie* przerwanej sesji) **nie musi** być zapisywany dla MVP. Przy ponownym rozpoczęciu sesji tego samego dnia, system ponownie zaprezentuje wszystkie karty, które nadal są "do powtórki na dziś".
* **FR_SRS_10 (Obsługa Braku Fiszek do Powtórki):** Jeśli użytkownik zainicjuje sesję nauki, a algorytm SRS nie znajdzie żadnych fiszek "do powtórki na dziś" w wybranym zakresie, system musi wyświetlić użytkownikowi odpowiedni, motywujący komunikat (np. "Gratulacje! Na dziś wszystko powtórzone w tym zakresie.").
* **FR_SRS_11 (Brak Opcji Usuwania w Trakcie Nauki):** W interfejsie sesji nauki (podczas prezentowania Pytania/Odpowiedzi i oceniania) **nie może** być dostępna opcja pozwalająca na usunięcie aktualnie przeglądanej fiszki.

## 6. Wymagania Dotyczące AI (z wykorzystaniem OpenRouter.ai)

System będzie wykorzystywał usługę **OpenRouter.ai** jako bramkę (AI Gateway/Router) do ujednoliconego dostępu i interakcji z różnymi modelami językowymi (LLM) od wielu dostawców.

* **AIR_OR_1 (Konfiguracja Integracji z OpenRouter):** Aplikacja musi być poprawnie skonfigurowana do komunikacji z API OpenRouter. Wymaga to:
    * Posiadania konta na platformie OpenRouter.ai.
    * Uzyskania klucza API OpenRouter.
    * Skonfigurowania aplikacji do używania odpowiedniego punktu końcowego (endpoint) API OpenRouter oraz bezpiecznego zarządzania kluczem API OpenRouter (np. przez zmienne środowiskowe).
* **AIR_OR_2 (Wybór Początkowego Modelu AI):** Chociaż OpenRouter umożliwia łatwe przełączanie modeli, na potrzeby startu MVP należy wybrać **jeden lub dwa modele początkowe** dostępne przez OpenRouter, które będą domyślnie używane do generowania fiszek (np. model z rodziny GPT, Claude, Gemini, Mistral lub inny, oferujący dobry balans jakości i kosztu). Wybór ten może być później łatwo zmieniony w konfiguracji lub kodzie wywołującym OpenRouter.
* **AIR_OR_3 (Format Zapytania do OpenRouter):** System musi wysyłać zapytania do API OpenRouter w formacie zgodnym z ich dokumentacją (często kompatybilnym z API OpenAI). Zapytanie musi zawierać m.in. tekst wejściowy (w ramach zdefiniowanego promptu systemowego) oraz **identyfikator wybranego modelu** (np. `openai/gpt-3.5-turbo`, `google/gemini-pro`, `anthropic/claude-3-haiku`, etc.).
* **AIR_OR_4 (Prompt Engineering):** Jest to kluczowy element sukcesu generowania fiszek. Należy opracować i iteracyjnie dostosowywać **prompty systemowe** wysyłane (przez OpenRouter) do wybranego modelu, które będą instruować go, aby:
    * Zrozumiał zadanie generowania Q&A.
    * Przestrzegał limitów **400 znaków** dla Pytania i Odpowiedzi.
    * Generował treści w oczekiwanym stylu.
    * Obsłużył zadanie korekty/skrócenia fiszek przekraczających limit (zgodnie z FR_AI_7c).
    * Należy przewidzieć proces iteracyjnego testowania i ulepszania promptów.
* **AIR_OR_5 (Cel Jakościowy Generowania):** Cel >75% akceptacji fiszek generowanych przez AI pozostaje aktualny. Możliwość łatwego testowania różnych modeli przez OpenRouter powinna pomóc w osiągnięciu tego celu.
* **AIR_OR_6 (Obsługa Błędów OpenRouter i Modeli):** System musi poprawnie obsługiwać błędy zwracane przez API OpenRouter ORAZ błędy pochodzące od bazowych modeli AI, które OpenRouter może przekazywać. Obejmuje to m.in.:
    * Błędy autoryzacji (nieprawidłowy klucz OpenRouter).
    * Błędy sieciowe, timeouty.
    * Błędy wskazujące na niedostępność wybranego modelu w OpenRouter.
    * Błędy przekazywane z bazowego API (np. rate limiting dostawcy, błędy moderacji treści, błędy wewnętrzne modelu).
    * Sytuacje braku sensownych wyników.
    * System musi logować te błędy i informować użytkownika w zrozumiały sposób (zgodnie z FR_AI_11).
* **AIR_OR_7 (Kontrola Kosztów przez OpenRouter):** Kontrola kosztów opiera się na:
    * Przestrzeganiu limitu długości tekstu wejściowego (FR_AI_2).
    * Świadomym wyborze i potencjalnym przełączaniu modeli w OpenRouter (AIR_OR_2) na te o lepszym stosunku ceny do jakości dla zadania.
    * Monitorowaniu kosztów za pomocą narzędzi udostępnianych przez OpenRouter.ai.
* **AIR_OR_8 (Prywatność Danych Wejściowych):** Wymaganie dotyczące nietrwałości i bezpiecznego przesyłania tekstu wejściowego użytkownika (poprzednie AIR7) pozostaje w mocy. Tekst jest wysyłany do OpenRouter, który następnie przekazuje go do wybranego dostawcy AI. Należy zapoznać się z polityką prywatności OpenRouter oraz potencjalnie dostawców modeli używanych przez OpenRouter. Dane wejściowe **nie mogą być trwale przechowywane** przez "Fiszkomat AI" po przetworzeniu.
* **AIR_OR_9 (Moderacja Treści):** Należy być świadomym, że zarówno OpenRouter, jak i bazowe modele mogą stosować filtry moderacji treści. System musi być przygotowany na obsługę takich przypadków (zgodnie z AIR_OR_6).

## 7. Wymagania UI/UX (Poziom Ogólny)

Ponieważ MVP "Fiszkomat AI" będzie rozwijane bez wcześniejszej fazy szczegółowego projektowania interfejsu użytkownika (UI) i doświadczeń użytkownika (UX) w postaci mockupów czy prototypów, poniższe punkty stanowią ogólne wytyczne i zasady, którymi należy się kierować podczas implementacji. Ostateczny kształt UI/UX będzie weryfikowany i dopracowywany na podstawie testów i informacji zwrotnych od grupy fokusowej.

* **UXR1 (Prostota i Klarowność):** Priorytetem jest stworzenie interfejsu, który jest maksymalnie prosty, przejrzysty i intuicyjny dla użytkownika końcowego (studenta). Należy unikać zbędnych komplikacji i ukrytych funkcji. Kluczowe akcje (logowanie, dodawanie/generowanie fiszek, nauka) muszą być łatwe do znalezienia i wykonania.
* **UXR2 (Spójność):** Należy dążyć do zachowania spójności wizualnej i funkcjonalnej elementów interfejsu w całej aplikacji. Dotyczy to m.in. używanych przycisków, formularzy, komunikatów, nawigacji, kolorystyki i typografii.
* **UXR3 (Informacja Zwrotna):** System musi na bieżąco dostarczać użytkownikowi jasnych informacji zwrotnych dotyczących stanu aplikacji i wyników jego działań. Obejmuje to wskaźniki ładowania podczas operacji trwających dłużej (np. generowanie AI), komunikaty potwierdzające sukces operacji (np. zapis fiszki) oraz zrozumiałe komunikaty o błędach.
* **UXR4 (Podstawowa Dostępność - a11y):** Chociaż szczegółowe audyty dostępności nie są planowane dla MVP, podczas implementacji należy w miarę możliwości stosować podstawowe dobre praktyki związane z dostępnością cyfrową, takie jak dbanie o odpowiedni kontrast tekstów i tła, semantyczne użycie HTML oraz umożliwienie podstawowej nawigacji za pomocą klawiatury tam, gdzie jest to naturalne.
* **UXR5 (Iteracyjny Rozwój UI/UX):** Decyzje dotyczące konkretnych rozwiązań interfejsu (dokładny układ elementów, wybór kolorów, mikrointerakcje) będą podejmowane iteracyjnie podczas procesu implementacji, a następnie weryfikowane i potencjalnie modyfikowane na podstawie feedbacku z testów z grupą fokusową.

## 8. Wymagania Niefunkcjonalne

### 8.1. Wydajność (Performance)
* **NFR_Perf_1 (Czas Odpowiedzi UI):** Czas odpowiedzi interfejsu użytkownika na standardowe akcje inicjowane przez użytkownika (np. załadowanie listy grup, załadowanie listy fiszek w grupie po wybraniu, wyświetlenie kolejnej karty w module SRS) powinien w typowych warunkach (stabilne połączenie, rozsądna ilość danych) wynosić **poniżej 2 sekund**.
* **NFR_Perf_2 (Czas Przetwarzania AI):** Czas potrzebny na wygenerowanie fiszek przez AI jest zależny od zewnętrznego API (OpenRouter i wybranego modelu) oraz długości tekstu wejściowego i nie jest sztywno limitowany przez aplikację. Kluczowe jest jednak, aby interfejs użytkownika **zawsze informował** o trwającym procesie przetwarzania AI (zgodnie z FR_AI_5).
* **NFR_Perf_3 (Wydajność Bazy Danych):** Zapytania do bazy danych, szczególnie te dotyczące listowania fiszek w grupach, powinny być zaprojektowane w sposób zapewniający akceptowalną wydajność nawet przy kilku tysiącach fiszek w grupie (w kontekście wybranego mechanizmu obsługi długich list - FR_VIEW_7).
* **NFR_Perf_4 (Wydajność SRS):** Obliczenia wykonywane przez algorytm SRS (wybór kart do powtórki, obliczenie nowego interwału) dla pojedynczej fiszki muszą być na tyle szybkie, aby były niezauważalne dla użytkownika podczas sesji nauki.

### 8.2. Bezpieczeństwo (Security)
* **NFR_Sec_1 (Zarządzanie Sekretami):** Klucz API do OpenRouter oraz ewentualne inne sekrety aplikacji (np. klucz do podpisywania tokenów sesji, jeśli używane) **nie mogą** znajdować się w kodzie źródłowym ani w repozytorium. Muszą być zarządzane w sposób bezpieczny (np. przez zmienne środowiskowe, systemy zarządzania sekretami).
* **NFR_Sec_2 (Bezpieczeństwo Autoryzacji):** Należy poprawnie i bezpiecznie zaimplementować wybrany mechanizm uwierzytelniania (zgodnie z decyzją podjętą na etapie implementacji w oparciu o FR_AUTH), w tym walidację danych wejściowych, bezpieczne przechowywanie danych uwierzytelniających (jeśli dotyczy) i ochronę przed typowymi atakami.
* **NFR_Sec_3 (Ogólne Bezpieczeństwo Webowe):** Aplikacja musi stosować podstawowe zabezpieczenia: Komunikacja wyłącznie przez HTTPS, ochrona przed podstawowymi atakami typu Cross-Site Scripting (XSS) poprzez odpowiednie kodowanie danych wyjściowych, ustawienie odpowiednich nagłówków HTTP związanych z bezpieczeństwem.
* **NFR_Sec_4 (Ochrona Danych Użytkownika):** Dane użytkowników przechowywane w bazie danych (email, powiązane grupy i fiszki, stan SRS) muszą być chronione przed nieautoryzowanym dostępem.

### 8.3. Niezawodność (Reliability)
* **NFR_Rel_1 (Stabilność MVP):** Aplikacja w wersji MVP powinna działać stabilnie podczas wykonywania wszystkich zdefiniowanych funkcji przez użytkowników z grupy fokusowej. Należy zminimalizować ryzyko nieoczekiwanych awarii.
* **NFR_Rel_2 (Obsługa Błędów Zewnętrznych):** System musi być odporny na przejściowe problemy lub błędy w komunikacji z usługami zewnętrznymi (usługa uwierzytelniania, OpenRouter/API Modeli AI). W przypadku błędu, powinien próbować obsłużyć go w sposób "miękki" (graceful degradation) i zawsze informować użytkownika w sposób zrozumiały o zaistniałym problemie.
* **NFR_Rel_3 (Logowanie Błędów):** Należy zaimplementować mechanizm logowania kluczowych zdarzeń i błędów po stronie serwera (np. błędy krytyczne, nieudane wywołania API zewnętrznych, nieoczekiwane wyjątki) w celu ułatwienia diagnozowania problemów zgłaszanych przez grupę fokusową.

### 8.4. Użyteczność (Usability)
* **NFR_Usa_1 (Intuicyjność):** Interfejs użytkownika musi być zaprojektowany w sposób intuicyjny, aby nowi użytkownicy (studenci) mogli łatwo zrozumieć i korzystać z podstawowych funkcji aplikacji bez potrzeby szczegółowej instrukcji.
* **NFR_Usa_2 (Responsywność - RWD):** Aplikacja musi być w pełni responsywna i zapewniać dobre doświadczenie użytkownika (czytelność, łatwość nawigacji i interakcji) na różnych typach urządzeń i rozmiarach ekranów (komputery stacjonarne, laptopy, tablety, smartfony).

### 8.5. Utrzymywalność (Maintainability)
* **NFR_Maint_1 (Jakość Kodu):** Kod źródłowy aplikacji powinien być pisany zgodnie z zasadami czystego kodu (Clean Code), być zrozumiały, dobrze zorganizowany i zgodny z konwencjami stylistycznymi przyjętymi dla wybranej technologii.
* **NFR_Maint_2 (Architektura):** Architektura aplikacji powinna wspierać jej dalszy rozwój. Logika biznesowa powinna być oddzielona od warstwy prezentacji i dostępu do danych. Powinna istnieć możliwość łatwego dodawania nowych funkcji w przyszłości.
* **NFR_Maint_3 (Testowalność):** Kluczowe elementy logiki biznesowej (np. implementacja algorytmu SRS, logika zarządzania danymi) powinny być pokryte podstawowymi testami automatycznymi (jednostkowymi lub integracyjnymi), aby zapewnić ich poprawność i ułatwić refaktoryzację.

### 8.6. Skalowalność (Scalability)
* **NFR_Scal_1 (Skalowalność MVP):** Celem MVP nie jest wysoka skalowalność, jednak architektura i wdrożenie powinny być w stanie obsłużyć bez widocznej degradacji wydajności przewidywane obciążenie generowane przez grupę fokusową (np. 10-30 równoczesnych użytkowników wykonujących typowe akcje).

### 8.7. Integralność Danych (Data Integrity)
* **NFR_Data_1 (Relacje):** System musi zapewniać spójność i poprawność relacji między danymi w bazie danych (Użytkownik-Grupa, Grupa-Fiszka).
* **NFR_Data_2 (Usuwanie Kaskadowe):** Usunięcie grupy musi skutkować usunięciem wszystkich fiszek powiązanych z tą grupą (zgodnie z FR_GM_7), zapewniając brak "osieroconych" fiszek.

## 9. Kryteria Wydania MVP (Release Criteria)

Wersja MVP aplikacji "Fiszkomat AI" będzie uznana za gotową do udostępnienia grupie fokusowej (early adopters), jeśli **wszystkie** poniższe kryteria zostaną spełnione:

* **RC1 (Implementacja Funkcjonalna):** Wszystkie wymagania funkcjonalne zdefiniowane w Sekcji 5 tego dokumentu (Moduły: 5.1 Uwierzytelnianie, 5.2 Zarządzanie Grupami, 5.3 Tworzenie AI, 5.4 Tworzenie Ręczne, 5.5 Przeglądanie Fiszek, 5.6 Nauka SRS) zostały w pełni zaimplementowane.
* **RC2 (Przetestowane Kluczowe Przepływy):** Podstawowe ścieżki użytkownika zostały pomyślnie przetestowane (przynajmniej manualnie) i działają zgodnie z zdefiniowanymi wymaganiami. Obejmuje to co najmniej: Logowanie, Tworzenie grupy, Ręczne dodawanie fiszki, Generowanie fiszek AI (z akceptacją/odrzuceniem), Przeglądanie grup i fiszek, Usuwanie fiszki, Usuwanie grupy, Sesja nauki SRS (z oceną).
* **RC3 (Jakość Generowania AI):** W testach wewnętrznych osiągnięto wskaźnik akceptacji fiszek generowanych przez AI na poziomie > 75% dla reprezentatywnych tekstów wejściowych przy użyciu wybranego modelu startowego i promptów.
* **RC4 (Stabilność i Brak Krytycznych Błędów):** W aplikacji nie występują znane błędy krytyczne ani blokujące. Dopuszczalne są znane błędy o niskim priorytecie, jeśli są udokumentowane.
* **RC5 (Weryfikacja Bezpieczeństwa):** Przeprowadzono podstawową weryfikację implementacji zabezpieczeń: bezpieczne zarządzanie kluczem API OpenRouter, poprawna implementacja wybranego mechanizmu uwierzytelniania, stosowanie HTTPS.
* **RC6 (Poprawne Wdrożenie):** Aplikacja MVP została pomyślnie wdrożona na docelowym środowisku i jest dostępna dla członków grupy fokusowej.
* **RC7 (Minimalna Użyteczność Potwierdzona):** Przeprowadzono wewnętrzny przegląd użyteczności potwierdzający, że kluczowe przepływy są zrozumiałe i możliwe do wykonania.
* **RC8 (Przygotowanie dla Testerów):** Przygotowano krótką instrukcję dla grupy fokusowej (dostęp, logowanie, kluczowe funkcje, sposób zgłaszania uwag).
* **RC9 (Spełnienie Kluczowych NFR):** Potwierdzono, że aplikacja spełnia najważniejsze wymagania niefunkcjonalne (Sekcja 8) na akceptowalnym poziomie dla MVP.
e