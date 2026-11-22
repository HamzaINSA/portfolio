# CLAUDE.md: portfolio of Hamza Bencheikh

Read this file first, then `docs/README.md`. Keep this file short; details live in `docs/`.

## What this project is

The personal website of Hamza Bencheikh, a 4th-year Computer Science engineering student at INSA Lyon. It is linked from internship applications (target: AI / LLM engineering internship, up to 4 months from May 2027, open to relocation). Long term he wants to specialise in machine learning (double degree at KTH is planned) and aim for a PhD.

Goal: stand out to tech recruiters. The site is built around a "model card" concept (Hamza presented as a model: version, intended use, training run, evaluation, limitations) plus a **local chatbot** that answers questions about Hamza from a knowledge base, with no API and no tracking.

**Status:** milestones M0 to M5 are done; M6 (polish: SEO, performance, legal page) is in progress. See `docs/roadmap.md` for what comes next. You (Claude Code) write all of the code.

## How to work with Hamza

- Talk to Hamza **in French**. Be precise and explain simply. He is a student and delegates technical choices and quality to you: you are responsible for both.
- Code, comments, commit messages, PR text, issues and docs are written **in English**.
- Before any task listed in `docs/risky-tasks.md`, stop and ask Hamza. Ask clearly: one question, 2 to 4 options, your recommendation, and the consequence of each option.
- Work in small steps. At the end of each step, say in French what changed and what is next.

## Where things are

| Need | File |
|---|---|
| Audience, positioning, non-goals | `docs/product-brief.md` |
| Stack, folder structure, coding rules | `docs/architecture.md` |
| Decisions already taken and still open | `docs/decisions.md` |
| Feature list with acceptance criteria | `docs/features.md` |
| Chatbot design (local retrieval) | `docs/chatbot-spec.md` |
| Visual design tokens and page specs | `docs/design-spec.md` |
| Validated mockups (HTML source) | `docs/design/mockups/` |
| How content is written and verified | `docs/content-guidelines.md` |
| What to build, in which order | `docs/roadmap.md` |
| Tasks where you must ask first | `docs/risky-tasks.md` |
| Hosting and deployment (Cloudflare Pages) | `docs/deployment.md` |
| First prompt to start with | `docs/kickoff-prompt.md` |
| The content itself (single source of truth) | `content/` (start with `content/README.md`) |

## Hard rules (never break these)

1. **Never invent facts about Hamza.** Every claim comes from `content/`. If a fact is missing, leave a `[TO CONFIRM]` marker and ask. Never approximate numbers; cite a verifiable source or write `[SOURCE NEEDED]`.
2. **Publish gate.** Content with `status: "to_confirm"`, or text containing `[TO CONFIRM]` or `[SOURCE NEEDED]`, must never reach a production build. `check:content --strict` fails the build.
3. **Privacy by default.** No phone number, home address or private data in the repo or on the site. No third-party requests at runtime: fonts are self-hosted, no analytics, no CDN, no embeds. The chatbot makes **no network call**.
4. **Client confidentiality.** Client missions are anonymised unless `client.disclosure` is `"named"` and Hamza confirmed it. Never copy private documents (commercial proposals, contracts) into the repo. Raw sources stay in `private/`, which is git-ignored.
5. **Accessibility.** WCAG 2.1 AA: keyboard navigation, visible focus, contrast, reduced motion, semantic HTML, real `<button>` and `<a>`.
6. **No secrets** in the repo, ever.
7. **Dependencies:** add one only with a short justification in the PR. No major framework change without asking.
8. **Git:** branch per task (`feat/…`, `fix/…`, `docs/…`, `chore/…`), Conventional Commits in English, small PRs, never force-push `main`, never rewrite published history.

## Commands

Keep this list accurate when scripts change:

```
npm run dev            # local dev server
npm run build          # production build (runs check:content first; blocking when CONTENT_STRICT=1, set on main)
npm run preview        # serve the production build
npm run lint           # ESLint + Prettier check
npm run typecheck      # TypeScript, strict
npm run test           # unit tests (Vitest), including chatbot evaluation set
npm run test:e2e       # Playwright + axe accessibility checks (PW_ALL_BROWSERS=1 adds Firefox and Safari)
npm run check:content  # publish gate on content/ (warnings; add -- --strict or CONTENT_STRICT=1 to fail)
npm run og:image       # regenerate public/og.png (social image) from content/profile.json
npm run lighthouse     # Lighthouse CI on dist/ (run npm run build first; CHROME_PATH if Chrome is not found)
```

## Definition of done (every PR)

- Typecheck, lint, unit tests and content validation pass.
- The page matches the mockup in `docs/design/mockups/` at desktop and at phone width, and uses design tokens, not raw values.
- No hard-coded copy in components; text comes from `content/` or `src/i18n/en.ts`.
- Keyboard and screen-reader behaviour checked for anything interactive.
- PR description states what changed, how it was tested, and any open question for Hamza.
