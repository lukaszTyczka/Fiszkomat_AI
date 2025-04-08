# MVP: Fiszkomat AI - Definicja Produktu

## 1. Wprowadzenie

Niniejszy dokument opisuje zakres funkcjonalny oraz cele dla Minimum Viable Product (MVP) aplikacji "Fiszkomat AI". Głównym celem projektu jest nauka i praktyczne zastosowanie nowych technologii poprzez stworzenie użytecznej aplikacji. Projekt będzie służył jako poligon doświadczalny do eksperymentowania z różnymi rozwiązaniami technicznymi, jednocześnie tworząc wartościowy produkt, który usprawnia proces nauki poprzez automatyczne generowanie fiszek z notatek za pomocą AI oraz zapewnienie zorganizowanego systemu powtórek.

## 2. Grupa Docelowa i Główna Wartość

* **Główna Grupa Docelowa (Early Adopters):** Studenci oraz inne osoby uczące się, które regularnie tworzą notatki (np. z wykładów, książek, artykułów) i chcą efektywnie wykorzystać je do nauki.
* **Główna Wartość / Rozwiązywany Problem:**
    * **Oszczędność czasu:** Automatyzacja procesu tworzenia fiszek z istniejących materiałów tekstowych.
    * **Wygoda:** Łatwe przekształcanie pasywnych notatek w aktywne narzędzie do nauki.
    * **Efektywność nauki:** Zapewnienie zorganizowanego sposobu na powtórki (SRS) dla stworzonych materiałów, pogrupowanych tematycznie.

## 3. Zakres Funkcjonalny MVP

MVP "Fiszkomat AI" będzie obejmować następujące kluczowe funkcjonalności:

### 3.1. Uwierzytelnianie Użytkownika
* Rejestracja nowego konta użytkownika.
* Logowanie do istniejącego konta.

### 3.2. Zarządzanie Grupami Fiszek (Deckami)
* Tworzenie nowych grup (np. "Decków", "Folderów") do kategoryzacji fiszek.
* Wyświetlanie listy stworzonych grup.
    * *(Minimum: Tylko tworzenie i listowanie. Zmiana nazwy/usuwanie może być poza zakresem MVP)*.

### 3.3. Tworzenie Fiszek
* **a) Generowanie z Tekstu przez AI:**
    * Pole do wprowadzenia (wklejenia) tekstu źródłowego.
    * Proces generowania przez AI propozycji fiszek w formacie Pytanie-Odpowiedź (Q&A).
    * Interfejs do przeglądania wygenerowanych propozycji.
    * Możliwość akceptacji lub odrzucenia każdej propozycji.
    * Przy akceptacji: Konieczność (lub opcja) przypisania fiszki do jednej z istniejących grup użytkownika.
* **b) Ręczne Dodawanie:**
    * Prosty formularz z polami na Pytanie i Odpowiedź.
    * Możliwość (lub konieczność) wyboru grupy, do której fiszka ma zostać dodana.

### 3.4. Przechowywanie Danych
* Wszystkie zaakceptowane fiszki (z AI i ręczne) są zapisywane w bazie danych.
* Każda fiszka jest powiązana z kontem użytkownika oraz z wybraną grupą fiszek.

### 3.5. Przeglądanie Fiszek
* Możliwość wyświetlenia listy wszystkich grup stworzonych przez użytkownika.
* Możliwość wyświetlenia listy fiszek (pytanie/odpowiedź) należących do konkretnej, wybranej grupy.

### 3.6. System Powtórek (Nauka)
* Podstawowy moduł nauki oparty na algorytmie Spaced Repetition (SRS).
* Użytkownik może rozpocząć sesję nauki:
    * Dla wszystkich swoich fiszek.
    * LUB tylko dla fiszek z wybranej grupy.
* System prezentuje fiszki do powtórki zgodnie z logiką SRS.

## 4. Kluczowe Założenia i Uwagi

* **Użyteczność ponad wszystko:** Interfejs użytkownika musi być prosty i intuicyjny, umożliwiając łatwe wykonanie kluczowych zadań.
* **Jakość AI:** Cel (>75% akceptacji) pozostaje ważny, ale równie istotna jest obsługa błędów i sytuacji, gdy AI nie generuje dobrych wyników.
* **Podstawowa Wydajność i Stabilność:** Aplikacja musi działać w miarę stabilnie pod obciążeniem generowanym przez wczesnych użytkowników.
* **Architektura:** Powinna nadal umożliwiać przyszły rozwój i dodawanie nowych funkcji (ekstensybilność).

## 5. Funkcjonalności Poza Zakresem MVP

Następujące funkcje nie będą częścią pierwszej wersji MVP:
* Zaawansowane zarządzanie grupami (zmiana nazwy, usuwanie, udostępnianie, zagnieżdżanie).
* Obsługa innych typów fiszek (np. definicje, uzupełnianie luk, obrazkowe).
* Edycja istniejących fiszek.
* Import / Export fiszek lub grup.
* Zaawansowane statystyki nauki.
* Wyszukiwanie fiszek.
* Tryb offline.
* Funkcje społecznościowe / udostępnianie fiszek innym.
* Ustawienia personalizacji (np. wyglądu, działania SRS).

## 6. Kryteria Sukcesu MVP

Sukces MVP zostanie oceniony na podstawie:
* **Ukończenie Kluczowych Scenariuszy:** Użytkownicy są w stanie pomyślnie zarejestrować się, stworzyć/wygenerować fiszki, przypisać je do grup i efektywnie uczyć się ich za pomocą modułu SRS dla wybranej grupy.
* **Jakość Generowania AI:** Utrzymanie celu >75% akceptacji dla fiszek generowanych przez AI.
* **Feedback od Użytkowników:** Zebranie pozytywnych opinii jakościowych od wczesnych testerów dotyczących użyteczności, oszczędności czasu i ogólnej wartości aplikacji.
* **Stabilność:** Brak krytycznych błędów uniemożliwiających korzystanie z podstawowych funkcji.
* **Retencja (opcjonalnie):** Podstawowa miara powracających użytkowników po pierwszym użyciu.

## 7. Dalszy Rozwój (Post-MVP)

Na podstawie zebranego feedbacku z MVP, planowany jest dalszy rozwój produktu, który może obejmować m.in.:
* Implementację funkcji z listy "Poza Zakresem MVP".
* Ulepszanie algorytmu AI i procesu generowania fiszek.
* Optymalizację wydajności i skalowalności.
* Rozwój interfejsu użytkownika.