# Fiszkomat AI - MVP: Wybrany Stos Technologiczny i Operacje

Na podstawie wymagań z PRD oraz podjętych decyzji, poniżej znajduje się podsumowanie wybranego stosu technologicznego oraz podejścia do CI/CD i hostingu dla Minimum Viable Product (MVP) aplikacji "Fiszkomat AI".

## Architektura Ogólna
* **Podejście:** Backend-as-a-Service (BaaS) z własnym hostingiem frontendu.
* **Główna Platforma Backendowa:** **Supabase**

## Komponenty Technologiczne

* **Frontend:**
    * **Framework:** **Astro**
    * **Biblioteka UI (komponenty interaktywne):** **React**
    * **Język:** **TypeScript**
    * **Styling:** **Tailwind CSS**
    * **Biblioteka Komponentów UI:** **shadcn/ui**
* **Backend (Logika Aplikacji):**
    * **Logika Server-Side / Bezpieczne Operacje:** **Supabase Edge Functions** (TypeScript, Deno)
        * *Główne zadania:* Bezpieczne wywołania API OpenRouter, logika SRS, inne operacje wymagające środowiska serwerowego.
* **Baza Danych:**
    * **System:** **PostgreSQL** (zarządzana przez Supabase)
    * **Interfejs:** Biblioteki klienckie Supabase (`supabase-js`).
* **Uwierzytelnianie:**
    * **Rozwiązanie:** **Supabase Auth**
* **Integracja z AI:**
    * **Bramka/Router AI:** **OpenRouter.ai**
    * **Wywołania:** Realizowane bezpiecznie z **Supabase Edge Functions**.
* **Algorytm SRS:**
    * **Implementacja:** Prosty mechanizm własny lub biblioteka open-source (decyzja podczas developmentu), logika w Edge Functions lub frontendzie.

## Operacje i Wdrożenie

* **Repozytorium Kodu:** **GitHub**
* **CI/CD (Continuous Integration / Continuous Deployment):** **GitHub Actions**
    * **Przepływ pracy (Workflow):**
        1.  Linting i sprawdzanie typów (TypeScript).
        2.  Uruchomienie testów automatycznych (jeśli zdefiniowane).
        3.  Budowanie aplikacji frontendowej Astro (`astro build`).
        4.  Budowanie obrazu Docker dla frontendu na podstawie `Dockerfile`.
        5.  Wypchnięcie obrazu Docker do rejestru kontenerów (np. DigitalOcean Container Registry, Docker Hub).
        6.  Wdrożenie/aktualizacja obrazu Docker na **DigitalOcean** (mechanizm zależny od wybranego produktu DO: np. `doctl` dla App Platform, SSH+Docker CLI dla Droplet).
        7.  Wdrożenie **Supabase Edge Functions** za pomocą Supabase CLI (`supabase functions deploy`).
* **Hosting:**
    * **Backend (DB, Auth, Edge Functions):** **Supabase** (zarządzany).
    * **Frontend (Aplikacja Astro w kontenerze Docker):** **DigitalOcean** (konkretny produkt DO - np. App Platform, Droplet - do wyboru podczas konfiguracji).

## Główne Biblioteki / Narzędzia do Rozważenia
* `supabase-js`
* `astro`, `react`, `tailwindcss`, `typescript`
* `Docker`, `Dockerfile`
* `GitHub Actions`
* `Supabase CLI`
* Potencjalnie `doctl` (DigitalOcean CLI) lub skrypty SSH do deploymentu
* Biblioteki do wywołań HTTP z Edge Functions (natywny `Workspace` w Deno)
* Wybrana biblioteka/implementacja SRS