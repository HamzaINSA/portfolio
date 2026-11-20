# Features

Priorities: **P0** = required for V1, **P1** = should be in V1, **P2** = later. Mockups are in `design/mockups/` (mapping in `design/README.md`). Every feature must work at desktop and phone width.

## F0. Foundation (P0)

Scaffold Astro + TypeScript strict, lint, format, tests, CI, fonts, tokens. Details in `roadmap.md` M0 and `architecture.md`.

Acceptance: `npm run dev|build|lint|typecheck|test|check:content` exist and pass; CI green on a PR; commands list in `CLAUDE.md` is accurate.

## F1. Content layer (P0)

Collections: `profile`, `education`, `experiences`, `projects`, `skills`, `knowledge-base`. Schemas in `content/schema/` are the contract; mirror them in Zod (`src/content.config.ts`).

Acceptance:
- Adding a file to `content/experiences/` makes it appear on the Training page with no code change.
- `check:content` reports every schema error with file and field.
- `--strict` fails on `status: "to_confirm"`, on `[TO CONFIRM]` / `[SOURCE NEEDED]` markers in rendered fields, and on missing required public fields (`profile.contact.email`).
- Anonymisation of client missions happens in `lib/content` (see `content-guidelines.md`).

## F2. Layout and navigation (P0)

Skip link, header nav (`home`, `training`, `evaluation`, `about`, highlighted CTA `ASK THE MODEL →`), footer, 404 page. Active page link is inverted (ink background).

Mobile menu (not in mockups): a 44×44 button with the two-bar icon opens a full-height panel with the same links. Close button, closes with Escape and on navigation, traps focus while open, returns focus to the button, scroll locked behind.

Acceptance: keyboard-only navigation works; axe has no violation; menu behaves as above.

## F3. Home (P0)

Mockups: `Home.dc.html` (desktop), `MobileHome.dc.html`.

Sections: hero (status chips from `profile.seeking`, title `hamza` + version chip from `profile.modelVersion`, intro, CTAs), chat teaser window, model-details summary, training preview (curve + checkpoints), evaluation preview (three project cards), closing CTA strip.

Behaviour:
- Teaser suggestions link to `/ask?q=<question>` and the console answers that question on load.
- Status chip text is computed from `profile.seeking` (for example "May 2027 · up to 4 months"), never typed in the template.
- Preview sections take the most relevant verified items (checkpoints in date order; projects flagged `featured`).

## F4. Training run page (P0)

Mockup: `Training.dc.html`. Route `/training`.

- Loss-curve SVG generated at build time. The number of markers equals the number of checkpoints; it is a **schematic**, labelled "schematic of my path, not real metrics". It carries `role="img"` and an `aria-label`; the checkpoint cards below carry the real information.
- Checkpoints: experiences with `checkpoint: true`, verified, ordered by `startDate`. Each card shows period, title and organisation, `highlights` ("what I did"), `learned` ("what I learned"), `stack`, and a link "ask about this →" to `/ask?q=…`.
- Final dark card: current education (`education` item with no end in the past), department, relevant coursework, and "next" (seeking line plus the KTH plan if verified).
- Other items (involvement, programs, tutoring, scholarship) are not in the mockup. Propose a compact list under the checkpoints and ask Hamza before adding it (see `risky-tasks.md`, item 13).

## F5. Evaluation page: project list (P0)

Mockup: `Projects.dc.html`. Route `/projects` (nav label "evaluation").

- Cards from `content/projects/`. Topic filters derived from `tags`; "All" first. Filtering is client-side and reflects in the URL (`?topic=`). Without JavaScript, all projects are shown and the filter buttons are hidden.
- Cards link to `/projects/<slug>`.

## F6. Project detail page (P0)

Mockup: `ProjectDetail.dc.html`. Route `/projects/<slug>`.

- Header, links (repository, demo, report), project card table (`task`, `data`, `method`, `metric`, `result`, `myRole`), narrative blocks (`worked`, `failed`, `next`), figures, previous / next project, "ask about this project →".
- Any block whose content is `null` is **omitted**, never shown empty or with a placeholder.

## F7. About and contact (P0)

Mockup: `About.dc.html`. Route `/about`, contact block at `#contact`.

- Bio (`profile.bio`), intended use, strengths, known limitations, out of scope, capabilities (from `skills`), "next training run" (from goals), optional photo.
- Contact: email button, LinkedIn, GitHub, CV download, and a contact form that **opens the visitor's mail client** with a prefilled subject and body (`mailto:`), no backend, nothing stored. Keep the note "Your message goes to my email only. Nothing is stored on this site." only while that is true.
- CV button points to `profile.cv.path`; hidden if null (and strict build fails if still null, since CV is required for V1).

## F8. Ask the model: chatbot (P0)

Mockups: `Chat.dc.html` (interactive reference: it already contains a working simplified matcher), `MobileChat.dc.html`, Home teaser. Route `/ask`. Full specification in `chatbot-spec.md`.

Acceptance summary: suggestions and free text work; answers show their source file; the knowledge-base panel highlights the file used; unknown questions get the honest fallback with the contact link; no network call; keyboard and screen-reader friendly; passes the evaluation set.

## F9. SEO, sharing and metadata (P1)

Title and description per page, canonical URLs, Open Graph and Twitter card image, `sitemap.xml`, `robots.txt`, JSON-LD `Person` (name, school, links; no phone, no address), `lang="en"`. The social preview image is generated or designed to match the identity; ask Hamza before using any photo.

## F10. Accessibility and performance (P0, applies everywhere)

WCAG 2.1 AA. Contrast: the accent (lime) is used as a **fill** on ink or paper, and as **text only on ink backgrounds**. Visible focus on every control (see `design-spec.md`). `prefers-reduced-motion` disables transitions. Axe tests at both widths in CI. Performance budget in `architecture.md`.

## F11. Legal and privacy page (P1, after decision O7)

Short privacy statement ("no cookies, no analytics, no third-party requests, chat runs locally") and legal notice. Draft it, then ask Hamza to validate. Not legal advice.

## Out of scope for V1

Backend, database, auth, CMS, blog, translations, dark/light switch, analytics, newsletter, generative AI or any external API, semantic search (possible phase 2, decision O9).
