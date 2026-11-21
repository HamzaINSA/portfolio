# Decisions

Hamza delegates technical choices to the coding assistant. The decisions below are proposed defaults, taken at planning time. You may challenge one if you find a concrete problem: write the reason in the PR and ask Hamza before changing a **decided** item.

## Decided

| ID | Decision | Why |
|---|---|---|
| D1 | **Astro** (latest stable at install time, versions pinned by the lockfile), **TypeScript strict**, static output | Fast static site, little JavaScript, content collections with schema validation |
| D2 | **Plain CSS with design tokens** (CSS custom properties), no CSS framework, no UI framework | Mockups use a small, explicit token set; fewer dependencies |
| D3 | **Content as data** in `content/` (JSON, Markdown for long text), validated by schemas. Site and chatbot read the same files | One source of truth, no contradictions between page and chat |
| D4 | **Chatbot = local keyword retrieval** over knowledge-base entries, in the browser, no API, no network | Free, private, deterministic, explainable. Honest "no answer" fallback |
| D5 | **Zero third-party runtime requests**: fonts self-hosted (Space Grotesk, JetBrains Mono), no CDN, no analytics, no embeds | Visitor privacy (fonts from a CDN leak visitor IPs), speed, simplicity |
| D6 | **English only** in V1. UI strings in one file (`src/i18n/en.ts`) | Target applications are in English |
| D7 | **Publish gate**: `check:content --strict` blocks builds with `to_confirm` content or placeholder markers. Clarified by Hamza (2026-11-20): strict on `main` only (`CONTENT_STRICT=1`); PRs and local builds only warn | Never publish an unverified claim |
| D8 | **Client missions anonymised by default** | Confidentiality; see `content-guidelines.md` |
| D9 | **Contact form without backend**: opens the visitor's mail client (`mailto:`), nothing stored | No server, no data collection |
| D10 | Tests: **Vitest** (unit, chatbot evaluation set), **Playwright + axe** (e2e, accessibility). CI on **GitHub Actions** | Standard, free for public repos |
| D11 | Repo is **public**; code and content separated so that private data never enters it | Recruiters can read the code |
| D12 | **Typing effect in the chatbot** (Hamza, 2026-11-21): a short "searching knowledge_base" step (600 ms), then the answer appears word by word (1.5 s at most). Replaces the earlier rule against artificial delays. The page still says it is local retrieval with no AI service; reduced motion shows the answer at once | Makes the console feel like a model console; the disclosure keeps it honest |
| D13 | **About page = release notes** (Hamza, 2026-11-21, proposal C of three): the path is shown as version history from `content/releases.json`. The bio paragraphs and the model card cells leave the About page (the bio stays on Home and in the chatbot) | More engaging than plain text, matches the hamza-v4 concept, every line still comes from verified content |

## Open (ask Hamza; do not decide alone)

| ID | Question | Recommendation |
|---|---|---|
| O1 | Deployment target and custom domain (Vercel, Cloudflare Pages, GitHub Pages) | Decide at milestone M7. Preview deployments per PR are a plus. Needs an account and DNS: ask |
| O2 | Which email to publish. Resolved 2026-11-21: Hamza chose his INSA address (hamza.bencheikh@insa-lyon.fr); switch to a durable address before graduation | Done, revisit before graduation |
| O3 | Public CV file. Resolved 2026-11-20: no CV on the site; the site is the CV and applications already include it | Done |
| O4 | Photo on the About page (mockup shows an optional slot). Resolved 2026-11-20: Hamza supplied a photo and chose the cut-out on an ink background with a lime grid (`public/images/about/hamza.webp`, metadata stripped; original stays in `private/`) | Done |
| O5 | Naming clients of ETIC and freelance projects (see `content/projects/`). Resolved for VINCI and Inddigo: Hamza confirmed on 2026-11-20 they may be named, with their logos | Keep anonymous until ETIC and the client agree |
| O6 | Licence for the code (MIT or similar) and the statement for content | Ask; content stays all rights reserved |
| O7 | Legal notice and privacy page (needed for a public site run by a person in France) | Propose a short draft; Hamza validates. The coding assistant is not a lawyer |
| O8 | Details missing from content (see `[TO CONFIRM]` markers) | Resolve through `content/experiences/README.md` checklist |
| O9 | Optional phase 2: semantic search in the browser (embeddings model download) | Only after V1 is live; ask first |
