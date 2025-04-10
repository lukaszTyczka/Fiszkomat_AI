# REST API Plan

## 1. Resources

- **Users**: Managed by Supabase Auth. Key attributes include the unique user ID, email, and other profile info. Users are referenced in other resources via the `user_id` field.
- **Decks**: Represents groups of flashcards. (Database table: `decks`)
- **Flashcards**: Represents individual flashcards containing a question and an answer. (Database table: `flashcards`)
- **AI Generation Stats**: Stores statistics for AI-generated flashcards, such as the number of cards generated, accepted, and rejected. (Database table: `ai_generation_stats`)
- **Error Logs**: Captures runtime errors and exceptions for monitoring and debugging. (Database table: `error_logs`)

## 2. Endpoints

### 2.1 Decks

**GET /decks**

- **Description**: Retrieve a paginated list of the authenticated user's decks.
- **Query Parameters**:
  - `page` (optional, default=1): Page number for pagination.
  - `limit` (optional, default=10): Number of decks per page.
  - `sort_by` (optional): Field to sort by (e.g., `name`, `created_at`).
  - `order` (optional): Sort order (`asc` or `desc`).
- **Response**:
  ```json
  {
    "data": [{ "id": "uuid", "name": "Deck Name", "created_at": "timestamp", "updated_at": "timestamp" }],
    "page": 1,
    "limit": 10,
    "total": 34
  }
  ```
- **Success Codes**: 200 OK
- **Errors**: 401 Unauthorized, 500 Internal Server Error

**POST /decks**

- **Description**: Create a new deck. The deck name must be unique for the user and not exceed 100 characters.
- **Request Body**:
  ```json
  {
    "name": "Deck Name"
  }
  ```
- **Response**:
  ```json
  {
    "id": "uuid",
    "name": "Deck Name",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
  ```
- **Success Codes**: 201 Created
- **Errors**: 400 Bad Request (validation errors), 401 Unauthorized

**GET /decks/{deckId}**

- **Description**: Retrieve details of a specific deck.
- **Response**:
  ```json
  {
    "id": "uuid",
    "name": "Deck Name",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
  ```
- **Success Codes**: 200 OK
- **Errors**: 401 Unauthorized, 404 Not Found

**PUT /decks/{deckId}**

- **Description**: Update deck details (e.g., the deck name). Validation rules apply.
- **Request Body**:
  ```json
  {
    "name": "New Deck Name"
  }
  ```
- **Response**:
  ```json
  {
    "id": "uuid",
    "name": "New Deck Name",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
  ```
- **Success Codes**: 200 OK
- **Errors**: 400 Bad Request, 401 Unauthorized, 404 Not Found

**DELETE /decks/{deckId}**

- **Description**: Delete a deck. This action cascades to delete all associated flashcards.
- **Response**:
  ```json
  { "message": "Deck deleted successfully." }
  ```
- **Success Codes**: 200 OK
- **Errors**: 401 Unauthorized, 404 Not Found

### 2.2 Flashcards

**GET /decks/{deckId}/flashcards**

- **Description**: Retrieve a paginated list of flashcards for a given deck, sorted by creation date (descending).
- **Query Parameters**:
  - `page`, `limit` (as above)
- **Response**:
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "question": "Question text",
        "answer": "Answer text",
        "origin": "user",
        "ai_model_name": null,
        "created_at": "timestamp",
        "updated_at": "timestamp"
      }
    ],
    "page": 1,
    "limit": 10,
    "total": 25
  }
  ```
- **Success Codes**: 200 OK
- **Errors**: 401 Unauthorized, 404 Not Found

**POST /decks/{deckId}/flashcards**

- **Description**: Manually create a new flashcard within a deck.
- **Request Body**:
  ```json
  {
    "question": "Question text (max 400 chars)",
    "answer": "Answer text (max 400 chars)"
  }
  ```
- **Response**:
  ```json
  {
    "id": "uuid",
    "deck_id": "uuid",
    "question": "Question text",
    "answer": "Answer text",
    "origin": "user",
    "ai_model_name": null,
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
  ```
- **Success Codes**: 201 Created
- **Errors**: 400 Bad Request (validation errors), 401 Unauthorized, 404 Not Found

**PUT /flashcards/{flashcardId}**

- **Description**: Update an existing flashcard.
- **Request Body**:
  ```json
  {
    "question": "Updated question text",
    "answer": "Updated answer text"
  }
  ```
- **Response**: Returns the updated flashcard object (same structure as creation).
- **Success Codes**: 200 OK
- **Errors**: 400 Bad Request, 401 Unauthorized, 404 Not Found

**DELETE /flashcards/{flashcardId}**

- **Description**: Delete a flashcard.
- **Response**:
  ```json
  { "message": "Flashcard deleted successfully." }
  ```
- **Success Codes**: 200 OK
- **Errors**: 401 Unauthorized, 404 Not Found

**POST /decks/{deckId}/flashcards/batch**

- **Description**: Batch creation of multiple flashcards, useful when accepting AI-generated suggestions.
- **Request Body**:
  ```json
  {
    "flashcards": [
      { "question": "Question 1", "answer": "Answer 1" },
      { "question": "Question 2", "answer": "Answer 2" }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "created": [
      { "id": "uuid", "question": "Question 1", "answer": "Answer 1", "deck_id": "uuid", ... },
      { "id": "uuid", "question": "Question 2", "answer": "Answer 2", "deck_id": "uuid", ... }
    ]
  }
  ```
- **Success Codes**: 201 Created
- **Errors**: 400 Bad Request, 401 Unauthorized

### 2.3 AI Flashcard Generation

**POST /ai/flashcards/generate**

- **Description**: Generate flashcard suggestions from submitted text using AI. The input text must be between 1000 and 10000 characters. The AI service ensures that both question and answer do not exceed 400 characters, applying corrections if necessary.
- **Request Body**:
  ```json
  {
    "deck_id": "uuid",
    "source_text": "Long text (min 1000 characters, max 10000 characters)"
  }
  ```
- **Response**:
  ```json
  {
    "suggestions": [
      {
        "temp_id": "temp-uuid",
        "question": "Generated question",
        "answer": "Generated answer",
        "origin": "ai",
        "ai_model_name": "model-name"
      }
    ]
  }
  ```
- **Success Codes**: 200 OK
- **Errors**: 400 Bad Request (e.g., text length validation), 401 Unauthorized, 500 Internal Server Error (AI generation issues)

### 2.4 SRS (Spaced Repetition System)

**GET /srs/session**

- **Description**: Start or continue an SRS review session. Optionally, filter flashcards by deck using a query parameter.
- **Query Parameters**:
  - `deck_id` (optional): Filter the session to a specific deck.
- **Response**:
  ```json
  {
    "flashcard": {
      "id": "uuid",
      "question": "Flashcard question",
      "answer": "Flashcard answer", // Typically hidden until the user reveals it
      "next_review_date": "timestamp"
    }
  }
  ```
- **Success Codes**: 200 OK
- **Errors**: 401 Unauthorized, 404 Not Found (if no flashcards are due for review)

**POST /srs/flashcards/{flashcardId}/review**

- **Description**: Submit the review result for a flashcard. The submitted rating is used to update the SRS parameters (e.g., next review date, interval, and ease factor).
- **Request Body**:
  ```json
  {
    "rating": "poor|average|good"
  }
  ```
- **Response**:
  ```json
  {
    "id": "uuid",
    "question": "Flashcard question",
    "answer": "Flashcard answer",
    "next_review_date": "updated timestamp",
    "interval": "integer",
    "last_ease_factor": "numeric"
  }
  ```
- **Success Codes**: 200 OK
- **Errors**: 400 Bad Request, 401 Unauthorized, 404 Not Found

### 2.5 AI Generation Stats (Optional / Analytics)

**GET /ai/generation-stats**

- **Description**: Retrieve AI generation statistics for the authenticated user.
- **Query Parameters**: May include pagination parameters as needed.
- **Response**:
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "deck_id": "uuid",
        "session_id": "uuid",
        "ai_model_name": "model",
        "text_length": 1234,
        "cards_generated": 5,
        "cards_accepted": 3,
        "cards_rejected": 2,
        "generation_timestamp": "timestamp"
      }
    ]
  }
  ```
- **Success Codes**: 200 OK
- **Errors**: 401 Unauthorized

### 2.6 Error Logs (Admin - Optional)

**GET /admin/error-logs**

- **Description**: Retrieve logged error records for monitoring and debugging (access restricted to admin users).
- **Response**:
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "user_id": "uuid or null",
        "error_level": "ERROR",
        "error_message": "Detailed error message",
        "created_at": "timestamp"
      }
    ]
  }
  ```
- **Security**: Requires admin privileges (additional role checks).
- **Success Codes**: 200 OK
- **Errors**: 401 Unauthorized, 403 Forbidden

## 3. Authentication and Authorization

- **Authentication**: All endpoints require a valid Bearer token provided by Supabase Auth. Clients must include the token in the `Authorization` header as `Bearer <token>`.
- **Authorization**: Endpoints enforce that the `user_id` from the authenticated token matches the resource's owner. Database Row-Level Security (RLS) policies further ensure that users can only access and modify their own decks, flashcards, and stats.
- **Admin Endpoints**: Endpoints like `/admin/error-logs` require additional role-based checks.

## 4. Validation and Business Logic

- **Decks**:
  - The `name` field is required, must not be empty, and must be unique for the user (max 100 characters).
- **Flashcards**:
  - `question` and `answer` fields are required, must not be empty, and cannot exceed 400 characters each.
  - The API automatically sets the flashcard `origin` to "user" for manually created flashcards, and to "ai" for AI-generated flashcards. When `origin` is "ai", the optional `ai_model_name` field may be provided to indicate the AI model used.
- **AI Flashcard Generation**:
  - The `source_text` must be between 1000 and 10000 characters.
  - The AI generation process includes a validation and, if necessary, a secondary request to ensure the generated question and answer do not exceed 400 characters.
- **SRS Reviews**:
  - The submitted `rating` influences the calculation of the next review interval and ease factor. The flashcard's `next_review_date`, `interval`, and `last_ease_factor` are updated accordingly.
- **Pagination, Filtering, and Sorting**:
  - List endpoints validate pagination parameters and support filtering (e.g., by deck) and sorting (e.g., by creation date in descending order).
- **Error Handling**:
  - Standard HTTP status codes are used: 400 for validation errors, 401 for authentication failures, 404 for not found resources, and 500 for server errors.

This REST API plan is designed to work seamlessly with the specified tech stack (Astro, TypeScript, React, Tailwind CSS, shadcn/ui, and Supabase) and adheres to the business rules and validations outlined in the product requirements and database schema.
