# Decks API Documentation

This document describes the REST API endpoints for managing flashcard decks.

## Authentication

All endpoints require authentication using a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### List Decks

Retrieves a paginated list of decks for the authenticated user.

```
GET /api/decks
```

#### Query Parameters

- `page` (optional, default: 1): Page number for pagination
- `limit` (optional, default: 10): Number of items per page (max: 100)
- `sort_by` (optional, default: "created_at"): Field to sort by ("name" or "created_at")
- `order` (optional, default: "desc"): Sort order ("asc" or "desc")

#### Response

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Deck Name",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ],
  "page": 1,
  "limit": 10,
  "total": 34
}
```

### Create Deck

Creates a new deck for the authenticated user.

```
POST /api/decks
```

#### Request Body

```json
{
  "name": "My New Deck"
}
```

- `name`: Required, string, 1-100 characters

#### Response

```json
{
  "id": "uuid",
  "name": "My New Deck",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Get Deck

Retrieves details of a specific deck.

```
GET /api/decks/{deckId}
```

#### Parameters

- `deckId`: UUID of the deck

#### Response

```json
{
  "id": "uuid",
  "name": "Deck Name",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Update Deck

Updates an existing deck.

```
PUT /api/decks/{deckId}
```

#### Parameters

- `deckId`: UUID of the deck

#### Request Body

```json
{
  "name": "Updated Deck Name"
}
```

- `name`: Required, string, 1-100 characters

#### Response

```json
{
  "id": "uuid",
  "name": "Updated Deck Name",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Delete Deck

Deletes a deck and all its associated flashcards.

```
DELETE /api/decks/{deckId}
```

#### Parameters

- `deckId`: UUID of the deck

#### Response

Returns 204 No Content on successful deletion.

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request

Returned when the request parameters or body are invalid.

```json
{
  "error": "Invalid request body",
  "details": [
    {
      "code": "invalid_type",
      "path": ["name"],
      "message": "Required"
    }
  ]
}
```

### 401 Unauthorized

Returned when the request lacks valid authentication credentials.

```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found

Returned when the requested deck does not exist.

```json
{
  "error": "Deck not found"
}
```

### 500 Internal Server Error

Returned when an unexpected error occurs on the server.

```json
{
  "error": "Internal server error"
}
```

## Error Logging

All errors are logged to the `error_logs` table with the following information:

- Error message
- Error stack trace
- User ID (if available)
- Error level (ERROR, WARN, or INFO)
- Timestamp
