# Design reference

Hamza designed and validated these screens in a Claude design canvas (a private page that only he can open). The source of the validated screens is copied in `mockups/` as `.dc.html` files.

## How to read the mockups

- Each file is plain HTML with inline styles. Open it in an editor and read values (sizes, colours, spacing). It will **not** render in a browser by itself: it expects a runtime script (`support.js`) that is not included, and it uses `{{accent}}` holes and `<sc-for>` tags from that runtime.
- `{{accent}}` is the lime accent `#C6FF3D` in V1 (the other options in the `data-props` are exploration only).
- Text in `[BRACKETS]` is placeholder. The real text comes from `content/`.
- Mockup links such as `Chat.dc.html` mean "go to that screen". Routes are in the table below.
- The first `<script type="text/x-dc">` in `Chat.dc.html` contains a simplified working version of the chatbot matcher. Use it to understand the interaction, then implement the real one from `../chatbot-spec.md`.

## Screens and routes

| Mockup file | Screen | Route |
|---|---|---|
| `Home.dc.html` | Home (desktop, 1440 px) | `/` |
| `MobileHome.dc.html` | Home (phone, 390 px) | `/` |
| `Chat.dc.html` | Ask the model (desktop, interactive) | `/ask` |
| `MobileChat.dc.html` | Ask the model (phone) | `/ask` |
| `Training.dc.html` | Training run (experiences) | `/training` |
| `Projects.dc.html` | Evaluation (project list with filters) | `/projects` |
| `ProjectDetail.dc.html` | Project detail | `/projects/<slug>` |
| `About.dc.html` | About and contact | `/about` (`#contact`) |
| `ModelCard.dc.html` | Early model-card landing page that led to the final direction | not a route; style reference only |

Other design directions explored earlier were rejected and are not included.

## Visual exports (to add)

For screenshots to use as visual truth, Hamza can export from the canvas (Share, then Export) PNG or PDF files into `exports/`, named after the screen (for example `home-desktop.png`). This folder is intentionally empty for now.

Then read `../design-spec.md` for tokens and rules.
