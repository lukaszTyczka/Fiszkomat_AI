# Przewodnik Implementacji Usługi OpenRouter

## 1. Opis usługi

Usługa OpenRouter integruje się z interfejsem API OpenRouter w celu uzupełniania czatów opartych na LLM. Działa jako moduł pośredniczący, który:

1. Buduje poprawne żądania, zawierające komunikat systemowy, komunikat użytkownika oraz dodatkowe parametry modelu.
2. Przetwarza ustrukturyzowane odpowiedzi zgodnie z zadanym schematem (response_format).
3. Zapewnia bezpieczne, skalowalne i wydajne połączenie z API OpenRouter.

## 2. Opis konstruktora

Konstruktor usługi powinien inicjalizować:

- Punkt końcowy API oraz klucze dostępu (przechowywane w zmiennych środowiskowych).
- Domyślne wartości dla komunikatu systemowego oraz parametrów modelu.
- Nazwę modelu (np. `gpt-4-openrouter`) oraz parametry (np. `{ temperature: 0.7, max_tokens: 1500, top_p: 1 }`).
- Konfigurację formatu odpowiedzi (response_format) zgodnie z ustalonym schematem JSON.

## 3. Publiczne metody i pola

**Metody:**

1. `sendChatRequest(systemMessage: string, userMessage: string): Promise<Response>`
   - Buduje żądanie do OpenRouter API, integrując komunikat systemowy, komunikat użytkownika, model name, model parameters oraz response_format.
2. `setSystemMessage(message: string): void`
   - Aktualizuje domyślny komunikat systemowy.
3. `updateModelParameters(params: object): void`
   - Pozwala modyfikować parametry modelu wysyłane do API.
4. `getResponseFormat(): object`
   - Zwraca aktualny schemat formatu odpowiedzi.

**Pola:**

- `modelName: string` – nazwa modelu, np. `gpt-4-openrouter`.
- `modelParameters: object` – obiekt zawierający parametry modelu (np. `{ temperature: 0.7, max_tokens: 1500, top_p: 1 }`).
- `responseFormat: object` – schemat odpowiedzi w formacie JSON, przykładowo:
  1. Przykład:
     ```
     { type: 'json_schema', json_schema: { name: 'ChatResponse', strict: true, schema: { message: "string", metadata: { timestamp: "string" } } } }
     ```

## 4. Prywatne metody i pola

**Metody:**

1. `_buildPayload(systemMessage: string, userMessage: string): object`
   - Przygotowuje pełne ciało żądania, łącząc komunikat systemowy, komunikat użytkownika, model name, model parameters oraz response_format.
2. `_handleResponse(rawResponse: any): any`
   - Waliduje i formatuje odpowiedź z API zgodnie z zdefiniowanym schematem.
3. `_retryRequest(payload: object): Promise<Response>`
   - Implementuje logikę ponownego wysyłania żądań w przypadku niektórych błędów.
4. `_logError(error: Error): void`
   - Rejestruje błędy i dostarcza szczegółowe informacje dla diagnostyki.

**Pola:**

- `_httpClient` – instancja klienta HTTP do komunikacji z API.
- `_logger` – mechanizm logowania wewnętrznego.

## 5. Obsługa błędów

Kluczowe scenariusze błędów do obsługi:

1. **Błąd połączenia (Network Timeout, brak dostępu do API):**
   - Rozwiązanie: Implementacja retry logic z eskalacją błędu po określonej liczbie prób.
2. **Błąd walidacji schematu odpowiedzi:**
   - Rozwiązanie: Weryfikacja odpowiedzi za pomocą bibliotek do walidacji JSON Schema i fallback do domyślnej obsługi.
3. **Błąd uwierzytelnienia (nieprawidłowy klucz API lub token):**
   - Rozwiązanie: Weryfikacja po stronie klienta, regularne odświeżanie tokenów i logowanie krytycznych błędów.
4. **Błąd związany z limitami API (Rate Limiting):**
   - Rozwiązanie: Implementacja mechanizmu backoff przy przekroczeniu limitów.

## 6. Kwestie bezpieczeństwa

1. Przechowywanie kluczy API i wrażliwych danych w zmiennych środowiskowych.
2. Wymaganie korzystania z bezpiecznego protokołu TLS do komunikacji z API.
3. Regularne audyty logów oraz monitorowanie nieautoryzowanych prób dostępu.
4. Walidacja danych wejściowych i wyjściowych przy każdej interakcji z API.

## 7. Plan wdrożenia krok po kroku

1. **Konfiguracja środowiska:**

   - Upewnij się, że wszystkie zmienne środowiskowe (klucz API, endpoint) są poprawnie skonfigurowane.
   - Dodaj niezbędne zależności, np. biblioteki do HTTP i do walidacji JSON Schema.

2. **Implementacja modułu OpenRouter API Client:**

   - Stwórz moduł (np. w `./src/lib/openrouterClient.ts`) zawierający konstruktor, metody publiczne (`sendChatRequest`, `setSystemMessage`, `updateModelParameters`) oraz prywatne metody (`_buildPayload`, `_handleResponse`, `_retryRequest`, `_logError`).

3. **Integracja formatu odpowiedzi (response_format):**

   - Zdefiniuj schemat odpowiedzi zgodnie z wzorem:
     1. Przykład:
        ```
        { type: 'json_schema', json_schema: { name: 'ChatResponse', strict: true, schema: { message: "string", metadata: { timestamp: "string" } } } }
        ```
   - Upewnij się, że odpowiedzi z API są walidowane przeciwko temu schematowi.

4. **Konfiguracja komunikatów:**

   - **Komunikat systemowy:**
     1. Przykład: "System: You are a helpful assistant."
   - **Komunikat użytkownika:**
     1. Przykład: "User: Proszę podać szczegóły dotyczące twojej prośby."

5. **Konfiguracja modelu:**

   - Ustaw nazwę modelu na `gpt-4-openrouter`.
   - Przykładowe parametry modelu:
     1. `{ temperature: 0.7, max_tokens: 1500, top_p: 1 }`

6. **Monitorowanie i iteracja:**
   - Regularnie monitoruj logi oraz zbieraj feedback od użytkowników.
   - Wprowadzaj usprawnienia oraz aktualizacje bezpieczeństwa i wydajności w miarę rozwoju usługi.
