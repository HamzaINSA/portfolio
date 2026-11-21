# portfolio

Personal website of Hamza Bencheikh, 4th-year Computer Science engineering student at INSA Lyon, used for internship applications in AI and machine learning.

The site presents Hamza as a "model card" (version, intended use, training run, evaluation, limitations) and includes a local chatbot that answers questions about him from a small knowledge base. The chatbot uses no API and sends no data anywhere.

## Status

Milestones M0 to M4 are done: tooling and CI, content layer, Home, Training, Evaluation and project pages, About and contact. Next is the local chatbot (M5). Start with [`docs/README.md`](docs/README.md); the order of work is in [`docs/roadmap.md`](docs/roadmap.md).

## Repository layout

```
docs/         Product brief, architecture, features, design spec, chatbot spec, roadmap
docs/design/  Validated mockups (HTML source) and how to read them
content/      All site content as data (experiences, projects, skills, knowledge base)
private/      Local-only raw sources (git-ignored, never published)
```

## Content and licence

The text, structure and personal information in `content/` are © Hamza Bencheikh, all rights reserved. The licence of the code is not chosen yet (open decision, see `docs/decisions.md`).
