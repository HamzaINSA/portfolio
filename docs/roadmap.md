# Roadmap

Each milestone is a set of small PRs. Do them in order. After each milestone, tell Hamza (in French) what is now visible and what comes next. Tasks marked **ASK** are in `risky-tasks.md`.

## M0. Tooling and repository hygiene

- Scaffold Astro + TypeScript strict. Check current stable versions; pin them. Add `.nvmrc`, `engines`.
- ESLint, Prettier, Vitest, Playwright + axe. npm scripts from `CLAUDE.md`.
- `scripts/check-content.ts` skeleton and `--strict` mode.
- GitHub Actions CI, `.github/PULL_REQUEST_TEMPLATE.md` already provided.
- Update the commands list in `CLAUDE.md` if anything differs.
- Done when: CI is green on a PR and `npm run build` produces a static site.

## M1. Content layer and tokens

- Zod schemas mirroring `content/schema/*.json`; Astro content collections reading `content/`.
- Typed accessors, anonymisation, publish gate in `src/lib/content`.
- `tokens.css`, `base.css`, self-hosted fonts (Space Grotesk 500/700, JetBrains Mono 400/500/700).
- Unit tests for accessors and the gate.
- Done when: `check:content` reports the known `to_confirm` items and `--strict` fails as expected on them.

## M2. Layout and Home

- `BaseLayout`, `SiteNav`, `Footer`, skip link, `MobileMenu`, 404.
- Home page per `features.md` F3, desktop and phone, with the console teaser (static for now).
- Done when: Home matches `Home.dc.html` and `MobileHome.dc.html`, axe clean.

## M3. Training and Evaluation

- `LossCurve` (build-time SVG), Training page.
- Project list with filters, project detail.
- Done when: pages match their mockups; adding a content file adds an item.

## M4. About and contact

- About page, contact block, `mailto:` form (no CV download, decision O3).
- Done when: matches `About.dc.html`; no data leaves the browser.

## M5. Chatbot

- `src/lib/retrieval` with unit tests, `build-knowledge-base.ts`, chat console component, `/ask`, query parameter, teaser links.
- `tests/chat/eval-set.json` and the CI job; Playwright test for no external requests.
- Done when: the evaluation set passes; keyboard and screen-reader flows verified; `MobileChat.dc.html` matched.

## M6. Polish

- SEO and metadata (F9), social image, sitemap, robots, JSON-LD.
- Lighthouse in CI, performance pass, reduced-motion pass, contrast audit, cross-browser check (current Chrome, Firefox, Safari).
- Privacy and legal pages **(ASK: O7)**.

## M7. Content freeze and launch

- Resolve every `[TO CONFIRM]` with Hamza; run `check:content --strict`.
- Choose hosting and domain **(ASK: O1)**, connect repository, set up preview deployments.
- Final accessibility, link and content review; Hamza validates the live preview.
- Done when: the strict build passes and Hamza approves the preview.

## After launch (optional, ask first)

Content updates (new experiences, projects), French translation, semantic search (O9), analytics only if privacy-preserving and explicitly approved.
