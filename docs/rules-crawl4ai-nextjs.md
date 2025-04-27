# Rules for Universal Web Scraper (Next.js + Crawl4AI)

## 1. Code Style & Structure
- Use TypeScript for all code (pages, components, API routes, utils).
- Use CSS Modules for all styling.
- Organize code into `/app`, `/components`, `/lib`, `/styles`, `/docs`, `/tests`.
- Use functional React components and hooks.
- Keep components small, focused, and reusable.
- Use environment variables for all secrets and endpoints (never hardcode).

## 2. Package Management
- Use npm as the package manager.
- Keep `package-lock.json` in version control.
- Document all npm commands in README.md.
- Use npm's audit feature regularly to check for vulnerabilities.

## 3. Security
- Never expose API keys or secrets to the frontend (except public Supabase keys).
- Use API routes for all server-side logic (LLM calls, crawl4ai, etc.).
- Validate and sanitize all user input (URLs, fields, etc.).
- Use HTTPS for all deployments and API calls.
- Use Authorization headers for all Crawl4AI requests.
- Store sensitive data (API keys, .env.local) securely and never commit them.

## 4. API Usage & Integration
- Use `axios` or `fetch` for HTTP requests.
- Handle all errors from external APIs gracefully (show user-friendly messages).
- Use async/await for all API calls.
- Log errors server-side for debugging.
- Use POST for all data-modifying API routes.

## 5. Error Handling
- Always catch and handle errors in API routes and React components.
- Show clear, actionable error messages to users.
- Log errors with enough context for debugging.
- Fallback gracefully if external services are down.

## 6. Environment Management
- Use `.env.local` for local development, and set env vars in deployment dashboard.
- Never commit `.env.local` or secrets to version control.
- Document all required environment variables in README.md.

## 7. Version Control
- Use Git for all code.
- Use meaningful commit messages (conventional commits recommended).
- Keep `.gitignore` up to date.
- Use feature branches and pull requests for new features/bugfixes.

## 8. Testing
- Use Postman collection for API testing.
- Write unit tests for utility functions and API routes (Jest or Vitest).
- Write integration tests for main workflows.
- Document test coverage and procedures.

## 9. Deployment
- Use Docker for reproducible builds and deployments.
- Expose only necessary ports (default 3000 for Next.js).
- Set all secrets and endpoints as environment variables in deployment platform.
- Monitor logs and errors in production.

## 10. Documentation
- Keep README.md updated with setup, usage, and deployment instructions.
- Document all API endpoints, environment variables, and workflows.
- Use comments and JSDoc for complex logic.
- Maintain a CHANGELOG for major changes.

## 11. Accessibility & Performance
- Use semantic HTML and ARIA attributes for accessibility.
- Test with keyboard navigation and screen readers.
- Optimize images and assets.
- Use React Suspense and code splitting for performance.
- Avoid blocking the main thread with heavy computations (offload to API routes).

## 12. Maintainability
- Refactor code regularly to avoid duplication.
- Use clear naming conventions.
- Keep dependencies up to date.
- Review and test all pull requests before merging.

## 13. Styling
- Use Next.js module CSS for all styling needs.
- Follow BEM naming convention for CSS classes.
- Keep styles scoped to components.
- Use CSS variables for theming and global values.
- Maintain consistent spacing and typography scales.

## 14. Development Environment
- Use npm for all package management tasks.
- Document npm version in README.md.
- Use npm's built-in features for dependency management.
- Follow npm's recommended project structure.
- Keep package-lock.json up to date with all dependency changes.
- Use npm scripts for common development tasks.

---

**By following these rules, you ensure a secure, maintainable, and production-ready Universal Web Scraper built with Next.js and your self-hosted Crawl4AI.** 