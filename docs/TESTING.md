# Testing Guide

## API Testing with Postman

### Setup
1. Install Postman from [postman.com](https://www.postman.com/downloads/)
2. Import the collection: `docs/postman/crawl4ai-api.postman_collection.json`
3. Set up environment variables as needed

### API Test Workflow

#### 1. Crawl URL
- **POST** `https://crawl4ai.logikmeter.com/crawl`
- Body:
  ```json
  {
    "urls": ["https://example.com"]
  }
  ```
- Headers: `Authorization: Bearer logikmeter`
- Copy the `task_id` from the response

#### 2. Get Result
- **GET** `https://crawl4ai.logikmeter.com/task/{{task_id}}`
- Headers: `Authorization: Bearer logikmeter`
- Poll until you see `"status": "completed"` and a `markdown` or `html` field

#### 3. Extract Data
- **POST** `http://localhost:3000/api/extract`
- Body:
  ```json
  {
    "content": "<paste markdown or html from Get Result here>",
    "fields": [
      { "name": "title", "description": "The title of the page" }
    ],
    "model": "gpt-4"
  }
  ```

---

## Frontend Testing

1. Start the app: `npm run dev`
2. Open `http://localhost:3000`
3. Enter a URL, add extraction fields, and click Scrape
4. Verify results, error handling, and UI responsiveness

---

## Troubleshooting

- **Crawl4AI status stays `pending`:**
  - Try a simpler URL (e.g., https://example.com)
  - Check Crawl4AI server logs for errors
  - Ensure browser backend (Playwright/Chromium) is running
  - Restart the Crawl4AI server if needed

- **Extraction fails:**
  - Ensure you are sending real content (not a placeholder)
  - Check LLM API keys in `.env.local`
  - Review backend logs for errors

- **Frontend errors:**
  - Check browser console and network tab
  - Ensure all environment variables are set

---

## Security
- Never commit `.env.local` or secrets
- Use Authorization headers for all Crawl4AI requests

---

## To-Do
- Add automated tests (Jest/Vitest)
- Add integration tests for full workflow
- Add accessibility and performance tests 