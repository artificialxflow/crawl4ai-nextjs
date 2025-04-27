# Universal Web Scraper (Next.js + Crawl4AI)

## Overview
A modern, secure, and maintainable web scraping UI and API using Next.js, TypeScript, and Crawl4AI, with LLM extraction and full workflow documentation.

---

## Project Structure
```
project/
├── app/
├── components/
├── public/
├── styles/
├── docs/
│   ├── postman/
│   ├── README.md
│   ├── TESTING.md
├── tests/
├── Rules.md
├── tasks.md
├── README.md
└── package-lock.json
```

---

## Environment Variables (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key
CRAWL4AI_API_URL=https://crawl4ai.logikmeter.com/crawl
CRAWL4AI_API_AUTH=logikmeter
```

---

## API Endpoints

### Crawl4AI (external)
- `POST https://crawl4ai.logikmeter.com/crawl` — Start crawl, returns `task_id`
- `GET  https://crawl4ai.logikmeter.com/task/{task_id}` — Poll for crawl result (returns `markdown` or `html` when complete)

### Local Backend
- `POST /api/crawl4ai` — Starts crawl, polls for result, returns content
- `POST /api/extract` — LLM extraction (OpenAI, Gemini, Groq)

---

## Workflow
1. **Start crawl**: `/api/crawl4ai` (or direct to Crawl4AI server)
2. **Poll for result**: `/task/{task_id}`
3. **Extract data**: `/api/extract` with crawled content and field definitions

---

## Testing
- Use the provided Postman collection in `docs/postman/crawl4ai-api.postman_collection.json`
- See `docs/TESTING.md` for step-by-step instructions

---

## Security & Best Practices
- All secrets in `.env.local` (never committed)
- Authorization header for Crawl4AI
- Input validation and error handling throughout
- Rate limiting on backend
- Responsive, accessible UI with CSS Modules

---

## Deployment
- Ready for Docker or server deployment
- All URLs and tokens configurable via environment

---

## To-Do
- Automated tests (Jest/Vitest)
- Supabase integration for storage
- Field Templates & History UI
- Production deployment and monitoring 