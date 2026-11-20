# Architecture

Decisions behind this document are in `decisions.md`.

## Stack

- Astro (static output), TypeScript in strict mode.
- Plain CSS with tokens (see `design-spec.md`). Component-scoped styles in `.astro` files, global tokens in `src/styles/`.
- Vanilla TypeScript for the few interactive parts (chat console, project filters, mobile menu). No React or other UI framework.
- Content collections (Astro) with Zod schemas, loading files from `content/` (outside `src/`, so non-developers can edit it).
- Vitest for unit tests, Playwright with axe for end-to-end and accessibility checks, ESLint and Prettier for style.
- Node: current LTS at install time, pinned in `.nvmrc` and `package.json` `engines`.

Check the current stable versions when you scaffold and pin them. Do not rely on memory for versions.

## Folder structure (target)

```
.github/
  workflows/ci.yml                 typecheck, lint, test, check:content, build, e2e
  PULL_REQUEST_TEMPLATE.md         (already present)
content/                           data, schemas, knowledge base (see content/README.md)
docs/                              specs (this folder)
private/                           git-ignored raw sources
public/
  fonts/                           self-hosted WOFF2 (Space Grotesk, JetBrains Mono)
  cv/                              public CV (provided by Hamza, see decision O3)
  og/                              social preview image
scripts/
  check-content.ts                 content validation and publish gate
  build-knowledge-base.ts          bundles verified KB entries into one JSON for the chat
src/
  content.config.ts                collections and Zod schemas
  components/
    layout/                        SiteNav, MobileMenu, Footer, Container
    ui/                            Button, Chip, FieldCell, Panel, CtaStrip
    sections/                      Hero, ModelDetails, TrainingPreview, EvaluationPreview...
    chat/                          ChatConsole, ChatMessage, SuggestionChips, KnowledgePanel
    charts/                        LossCurve (SVG generated at build time)
  layouts/BaseLayout.astro         head, meta, skip link, nav, footer
  lib/
    content/                       typed accessors, sorting, anonymisation, gate helpers
    retrieval/                     pure chatbot functions (normalize, tokenize, score, answer)
    format/                        date and range formatting
  pages/
    index.astro                    Home
    training.astro                 Training run (experiences)
    projects/index.astro           Evaluation (project list + filters)
    projects/[slug].astro          Project detail
    about.astro                    About and contact (#contact anchor)
    ask.astro                      Ask the model (chat console)
    404.astro
    privacy.astro                  after decision O7
  styles/
    tokens.css                     all design tokens
    base.css                       reset, typography, focus, reduced motion
  i18n/en.ts                       UI strings (labels, buttons, empty states)
tests/
  unit/                            retrieval, content helpers, formatting
  chat/eval-set.json               chatbot evaluation questions
  e2e/                             navigation, chat, filters, accessibility
```

## Data flow

```
content/*.json|md  --(Zod validation)-->  typed accessors in src/lib/content
        |                                         |
        |                                         +--> pages and components (build time)
        +--> scripts/build-knowledge-base.ts --> knowledge-base.json (verified entries only)
                                                   |
                                                   +--> src/lib/retrieval (browser) --> ChatConsole
```

Pages are rendered at build time. The only runtime data is the knowledge-base bundle, served from the same origin.

## Rules

**Structure**
- Components never hard-code Hamza's facts or marketing copy. Facts come from `content/`, UI labels from `src/i18n/en.ts`.
- Dependency direction: `pages` → `layouts`/`components` → `lib` → `content`. `lib/retrieval` has no import from Astro or the DOM (pure functions, easy to test).
- One component per file, PascalCase. Folders and non-component files in kebab-case. Content ids in kebab-case.
- No `any`. No non-null assertions without a comment. No default exports except Astro components and config.
- Prefer small files. If a component grows past what fits on one screen of logic, split it.

**Styling**
- Use tokens (`var(--color-ink)`, `var(--space-6)`, …). No raw hex values or magic pixel values in components; the mockups' values are mapped to tokens in `design-spec.md`.
- Mobile first with fluid type (`clamp`). Breakpoints are defined once, in `tokens.css`.
- Visible focus ring on every interactive element. Respect `prefers-reduced-motion`.

**JavaScript**
- Ship no JavaScript on a page unless it needs it. Chat, project filters and the mobile menu are progressive enhancements: the page must be usable and readable without JavaScript (see `features.md`).
- No network call from client code except loading same-origin assets. Content Security Policy should forbid everything else (`connect-src 'self'`).

**Content and gate**
- Content is validated at build time. In production (`--strict`) a `to_confirm` status, a `[TO CONFIRM]` or `[SOURCE NEEDED]` marker in any published field, or a missing required field (for example `contact.email`) fails the build.
- Anonymisation is applied in `lib/content`, not in components: a component receives already-safe display fields.

**Quality**
- Strict TypeScript, ESLint and Prettier in CI. Unit tests for every function in `lib/`. The chatbot evaluation set runs in CI.
- Playwright tests: navigation between all pages, chat flow (suggestion click, typed question, fallback), project filter, mobile menu (open, close with Escape, focus return). Axe checks on every page at desktop and phone width.
- Performance: static HTML, self-hosted fonts with `font-display: swap` and preload for the two critical faces, images with explicit dimensions. Add a Lighthouse check in CI; initial threshold 95 on all four categories (adjust only with a written reason).

**Git and CI**
- `main` is always deployable. Work on branches, merge through PRs. Use Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `test:`, `refactor:`).
- CI runs on every PR: install, typecheck, lint, unit tests, `check:content` (non-strict on PRs, strict on `main`), build, e2e.
- Never commit generated build output, `.env` files or anything from `private/`.
