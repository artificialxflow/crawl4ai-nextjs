# TODO: Universal Web Scraper with Next.js & Self-Hosted crawl4ai

> **Before you start, read and follow all rules in `rules-crawl4ai-nextjs.md`.**

## 1. Project Overview
- Rebuild the Universal Web Scraper using Next.js (TypeScript, React) for the frontend and backend API routes.
- Integrate with your self-hosted crawl4ai server, LLM APIs (OpenAI, Gemini, Groq), and Supabase for storage.

---

## 2. Local Development & Setup

### 2.1. Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- Supabase project and credentials
- API keys for LLMs (OpenAI, Gemini, Groq/Deepseek)
- Access to your self-hosted crawl4ai server (e.g., https://crawl4ai.logikmeter.com)

### 2.2. Create and Set Up the Project
```sh
npx create-next-app@latest universal-web-scraper-nextjs --typescript
cd universal-web-scraper-nextjs
pnpm install # or npm install
```

### 2.3. Install Dependencies
```sh
pnpm add @supabase/supabase-js axios dotenv
# For UI: (choose one)
pnpm add @mui/material @emotion/react @emotion/styled # or
pnpm add antd # or
pnpm add bootstrap react-bootstrap
# For linting and formatting
pnpm add -D eslint prettier eslint-config-next
# For testing
pnpm add -D jest @testing-library/react @testing-library/jest-dom
```

### 2.4. Configure Environment Variables
Create a `.env.local` file:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key
CRAWL4AI_API_URL=https://crawl4ai.logikmeter.com/api/crawl
```
- Only expose public keys (Supabase URL/anon) to the frontend. Keep LLM and crawl4ai keys server-side.
- Document all required environment variables in README.md.

---

## 3. Project Structure (Recommended)
```
/pages
  index.tsx            # Main UI page
  /api
    crawl4ai.ts        # Calls your crawl4ai server
    extract.ts         # Calls LLM APIs
    pagination.ts      # Handles pagination logic
    supabase.ts        # (optional) Custom Supabase endpoints
/components
  UrlInput.tsx
  FieldSelector.tsx
  ResultsTable.tsx
  ...
/lib
  supabaseClient.ts    # Supabase JS client setup
  llmClients.ts        # LLM API wrappers
  utils.ts             # Utility functions
/styles
  ...
```

---

## 4. Implementation Steps

### 4.1. UI Development
- Build React components for:
  - URL input and management
  - Field selection (for extraction)
  - API key input (if needed)
  - Results display (table, JSON, etc.)
  - Pagination controls
- Use semantic HTML and ARIA attributes for accessibility.
- Test with keyboard navigation and screen readers.

### 4.2. Backend/API Routes
- `/api/crawl4ai.ts`: POST endpoint that takes a URL, calls your crawl4ai server, and returns markdown.
- `/api/extract.ts`: POST endpoint that takes markdown, fields, and model, calls the LLM API, and returns structured data.
- `/api/pagination.ts`: POST endpoint for pagination logic (calls LLM if needed).
- Use environment variables for all secrets in API routes (never expose to client).
- Validate and sanitize all user input in API routes.
- Handle all errors gracefully and return clear error messages.

### 4.3. Supabase Integration
- Use `@supabase/supabase-js` to store and retrieve scraped data, formatted data, and pagination data.
- Store unique names, URLs, raw markdown, formatted data, and pagination info as in the Python version.

### 4.4. Workflow
1. User enters URLs and fields in the UI.
2. Frontend calls `/api/crawl4ai` for each URL.
3. Store raw markdown in Supabase.
4. Frontend calls `/api/extract` for each markdown + fields + model.
5. Store structured data in Supabase.
6. (Optional) Handle pagination via `/api/pagination`.
7. Display results in the UI.

---

## 5. Essential Tests
- [ ] **Test crawl4ai integration**: Scrape a URL and verify markdown is returned and stored.
- [ ] **Test LLM extraction**: Extract fields from markdown using each LLM provider.
- [ ] **Test pagination**: Enable pagination and verify multiple pages are scraped and stored.
- [ ] **Test error handling**: Try invalid URLs, missing API keys, and network failures.
- [ ] **Test Supabase integration**: Check that all data is correctly stored and retrievable.
- [ ] **Test environment variable loading**: Ensure all secrets are server-side only.
- [ ] **Test UI workflow**: Add, clear, and process URLs through the React interface.
- [ ] **Test accessibility**: Keyboard navigation, screen reader support.
- [ ] **Test performance**: Large batch of URLs, slow network, etc.

---

## 6. Version Control & Best Practices
- [ ] **Initialize a Git repository** (if not already):
  ```sh
  git init
  echo 'node_modules/' >> .gitignore
  echo '.env.local' >> .gitignore
  git add .
  git commit -m "Initial commit: Universal Web Scraper Next.js version"
  ```
- [ ] **Never commit sensitive data** (API keys, .env.local, Supabase keys).
- [ ] **Document all major changes in README.md and a CHANGELOG if needed.**
- [ ] **Use feature branches and pull requests for all changes.**

---

## 7. Dockerization & Deployment
- [ ] **Create a `Dockerfile`**:
  - Use a Node.js base image
  - Copy project files
  - Install dependencies
  - Expose port 3000
  - Use environment variables for all secrets
- [ ] **Create a `.dockerignore`**:
  - Exclude node_modules, .env.local, .git, etc.
- [ ] **Build and test locally:**
  ```sh
  docker build -t universal-web-scraper-nextjs .
  docker run --env-file .env.local -p 3000:3000 universal-web-scraper-nextjs
  ```
- [ ] **Test all features in the container.**

---

## 8. Deploy to Coolify
- [ ] **Push your code to a Git repository (GitHub, GitLab, etc.)**
- [ ] **Connect your repo to Coolify.**
- [ ] **Set environment variables in Coolify's dashboard (never commit secrets).**
- [ ] **Deploy the app.**
- [ ] **Test the deployed app from a browser.**

---

## 9. Security, Performance & Maintenance
- [ ] **Use HTTPS for all endpoints.**
- [ ] **Protect your crawl4ai server with authentication/rate limiting.**
- [ ] **Regularly update dependencies and monitor for vulnerabilities.**
- [ ] **Monitor logs and errors on your deployed app.**
- [ ] **Optimize images and assets.**
- [ ] **Use React Suspense and code splitting for performance.**
- [ ] **Avoid blocking the main thread with heavy computations (offload to API routes).**
- [ ] **Refactor code regularly to avoid duplication.**
- [ ] **Use clear naming conventions.**
- [ ] **Review and test all pull requests before merging.**

---

## 10. Documentation
- [ ] **Update README.md with new integration and deployment instructions.**
- [ ] **Document any custom endpoints or changes to the workflow.**
- [ ] **Maintain a CHANGELOG for major changes.**

---

**By following this checklist and the rules in `rules-crawl4ai-nextjs.md`, you'll have a robust, maintainable, accessible, and secure Universal Web Scraper using Next.js and your self-hosted crawl4ai, ready for local development and production deployment!** 