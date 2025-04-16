# Fiszkomat AI

## Project Description

Fiszkomat AI is a minimum viable product (MVP) web application designed to streamline the process of creating flashcards from user notes. Using artificial intelligence, Fiszkomat AI automatically generates Q&A flashcards from pasted text (e.g., lecture notes). The platform also supports manual flashcard creation, grouping flashcards into decks, and learning via a spaced repetition system (SRS) to enhance retention.

## Tech Stack

- **Frontend:** Astro 5, React 19, TypeScript 5, Tailwind CSS, shadcn/ui
- **Backend:** Supabase Edge Functions (TypeScript, Deno), Supabase Auth
- **Database:** PostgreSQL (managed by Supabase)
- **AI Integration:** OpenRouter.ai (acts as a gateway to multiple language models)
- **CI/CD & Deployment:** GitHub Actions, Docker, DigitalOcean (App Platform or Droplet)

## Getting Started Locally

### Prerequisites

- Node.js version as specified in the `.nvmrc` file: **22.14.0**
- A package manager (npm or yarn)
- Environment variables for Supabase and OpenRouter.ai API keys (set these securely)

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository_url>
   cd Fiszkomat_AI
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**  
   Create a `.env` file at the project root with the following content:

   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` — Starts the Astro development server
- `npm run build` — Builds the Astro project for production
- `npm run preview` — Previews the production build
- `npm run astro` — Runs Astro CLI commands
- `npm run lint` — Lints the project using ESLint
- `npm run lint:fix` — Automatically fixes linting issues
- `npm run format` — Formats the project files with Prettier

## Testing

The project employs a multi-layered testing strategy to ensure code quality and functionality, as detailed in the [Test Plan](./.ai/TestPlan.md):

- **Unit Tests:** Verify individual components and functions using `Vitest`, `React Testing Library` (for frontend).
- **End-to-End (E2E) Tests:** Validate complete user flows through the UI using `Playwright`.

Tests are integrated into the CI/CD pipeline (GitHub Actions) to run automatically on code changes.

## Project Scope

The scope of Fiszkomat AI (MVP) includes:

- **User Authentication:** Secure registration and login using Supabase Auth with Google integration.
- **Flashcard Management:** Creating groups (decks), manually adding flashcards, and auto-generating flashcards using AI from user-provided text.
- **Flashcard Generation:** Processing text (1k-10k characters) to generate Q&A flashcards while ensuring each question and answer does not exceed 400 characters.
- **Learning Sessions:** Implementing a basic spaced repetition system (SRS) for scheduled review of flashcards.
- **UI/UX:** A clean, intuitive, and responsive interface adhering to modern web development best practices.

## Project Status

The project is currently in MVP stage and serves primarily as a learning project. While functional, it's designed to explore and implement various technologies and development practices rather than for production use.

## License

This project is licensed under the MIT License.
