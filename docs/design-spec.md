# Design specification: "Model card"

Hamza validated the **model card** direction (colours, fonts, style) and all screens listed in `design/README.md`. The HTML source of the mockups is in `design/mockups/`. It is a **reference for values and layout**, not production code: it uses inline styles and a custom runtime (`support.js`, not included), so it will not render by itself. Read the files, extract exact values, rebuild with tokens.

## Tokens (map these to `src/styles/tokens.css`)

Colours

| Token | Value | Use |
|---|---|---|
| `--color-paper` | `#F1F0EA` | Page background |
| `--color-ink` | `#0E0E0E` | Text, borders, dark panels |
| `--color-accent` | `#C6FF3D` | Fills (buttons, chips, highlights, CTA strips) |
| `--color-surface` | `#FFFFFF` | Cards and form panels |
| `--color-surface-2` | `#E4E3DB` | Image placeholders, inactive blocks |
| `--color-muted` | `#555555` | Small labels on light backgrounds |
| `--color-muted-strong` | `#444444` | Small notes on white |
| `--color-on-ink` | `#F1F0EA` | Text on ink panels |
| `--color-on-ink-muted` | `#B8B8B0` | Secondary text on ink |
| `--color-on-ink-soft` | `#CFCFC7` | Body text on ink |
| `--color-ink-line` | `#3A3A36` | Dividers on ink |
| `--color-ink-bubble` | `#1B1B18` | Chat bubble on ink |

Accent rule: **lime is a fill, or text on ink only.** Never lime text on paper or white (insufficient contrast). Ink text on lime is fine. Other accents seen in the mockup's tweak options (`#FF5C39`, `#7AE7FF`, `#FFD23F`) are exploration only and not part of V1.

Typography (self-hosted WOFF2, see decision D5)

- **Space Grotesk**, weights 500 and 700: display and card titles. Tight tracking (`-0.03em` to `-0.05em`), very tight line height (0.88 to 1.1).
- **JetBrains Mono**, weights 400, 500, 700: body, labels, buttons, navigation. Body 15 to 20 px, line height 1.6 to 1.7; small labels 12 to 13 px.

Sizes (desktop → phone, use `clamp()`): hero title 152 → 92; page title 104 (Training, Evaluation, Project) / 96 (About) / 88 (Ask) → about 56 on phone; section title 56 to 64 → 40; card title 24 to 28 → 20; body 15 to 19 → 13 to 16.

Shape and layout

- Borders: `3px solid ink` on cards, buttons and panels; `2px` for internal dividers. **No border radius.**
- Offset shadow on the chat window: `10px 10px 0 accent` (6px on phone).
- Container: max width 1360, side padding 40 (20 on phone). Section vertical padding 56 to 96 desktop (36 to 44 phone).
- Navigation bar: 3px bottom border, links minimum 44 px high, active link inverted (ink fill, paper text), CTA "ASK THE MODEL →" in lime with 2px ink border.
- Buttons: uppercase, bold, 3px ink border, minimum height 48 to 52 px. Primary = ink fill with paper text; secondary = transparent; accent = lime fill.
- Hover: invert (ink fill, paper text) for links in nav; opacity or invert for buttons. Keep transitions short and disabled under reduced motion.
- Focus ring (not in mockup, required): `3px solid ink` outline with `3px` offset and a `paper`/`accent` halo so it remains visible on lime and on ink panels (use accent or paper outline on ink backgrounds).
- Placeholders for missing images: dashed ink border on `surface-2` (only in mockups; in production omit empty blocks).

## Components to build

`SiteNav`, `MobileMenu`, `Footer`, `Container`, `Button` (primary, secondary, accent), `StatusChip`, `FieldCell` (label + value, used in model-details tables), `Panel`, `CtaStrip`, `ConsoleWindow` (chat teaser and chat), `ChatMessage`, `SuggestionChips`, `KnowledgePanel`, `CheckpointRow`, `LossCurve`, `ProjectCard`, `FilterBar`, `CaseStudyBlock`, `ContactForm`.

## Screens (see `design/README.md` for the file map)

1. **Home**: nav; hero left (status chips, big `hamza` + lime `v4` chip, intro, two CTAs) and console teaser right; model-details table (version, architecture, intended use) with "FULL CARD →"; ink section "Training run" with curve and four checkpoint columns; "Evaluation" with three cards; lime closing strip.
2. **Ask the model**: title with lime cursor `_`; two columns: console window (header `inference_console` + "retrieval over knowledge_base · local"; message area 400 px high, scrolling; chips; input bar with lime SEND button) and side panel (knowledge-base file list with the used file highlighted in lime, and a "HOW IT WORKS" box).
3. **Training**: title, short intro, ink section with the curve, then one bordered row per checkpoint (left cell lime for the first and grey for the others with period and title; right cells "what I did", "what I learned", "stack" + "ask about this →"), final ink row for current education, lime closing strip.
4. **Evaluation**: title, filter buttons (active = lime), grid of project cards (tag chip, year, small client logo next to the title (Hamza, 2026-11-21), title, summary, stack, "open case study →"), closing strip.
5. **Project detail**: back link, tag chip, huge title, intro, three link buttons, hero visual, "PROJECT CARD" table (task, data, method / metric, result, my role), three blocks (what worked in lime, what failed in white, next iteration in ink), two figures, previous / next navigation.
6. **About and contact**: title, bio and optional photo with lime offset shadow, four cards (intended use, strengths, known limitations, out of scope), ink "Capabilities" section (languages, ML and data, engineering), lime "Next training run", contact block with big heading, email, links and the form.
7. **Mobile home** and 8. **Mobile chat**: single column, hamburger, console teaser, stacked cards; chat is full height with chips in a horizontal scroll row and a fixed input bar. **No fake status bar or keyboard.**

## Not mocked (derive from the system, ask if unsure)

Mobile menu panel, 404 page, privacy page, mobile versions of Training, Evaluation, Project detail and About (apply the same patterns as Mobile home: single column, same tokens, same component behaviour), focus and hover states, empty and error states.

## Responsive and content rules

- Mobile first. The mockup widths are 1440 (desktop) and 390 (phone); everything in between and beyond must also work, with no horizontal scroll.
- Grids use `repeat(auto-fit, minmax(min(<n>px, 100%), 1fr))`.
- The home hero text must not break badly: use `text-wrap: balance` on titles and `pretty` on paragraphs.
- Do not show the exploration-only tweak panel or accent switcher.
- Replace every `[PLACEHOLDER]` in the mockups with content from `content/`. If a block has no content, omit the block.
- The version chip (`v4`) comes from `profile.modelVersion`.

## Visual references

Hamza can export PNG or PDF from his design canvas into `design/exports/` (see `design/README.md`). If images are present, use them as visual truth when the HTML is ambiguous.
