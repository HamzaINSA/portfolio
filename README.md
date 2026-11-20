# portfolio

Personal website of Hamza Bencheikh, 4th-year Computer Science engineering student at INSA Lyon, used for internship applications in AI and machine learning.

The site presents Hamza as a "model card" (version, intended use, training run, evaluation, limitations) and includes a local chatbot that answers questions about him from a small knowledge base. The chatbot uses no API and sends no data anywhere.

## Status

Planning phase finished: mockups validated, content drafted, specs written. Implementation is done with Claude Code. Start with [`CLAUDE.md`](CLAUDE.md) and [`docs/README.md`](docs/README.md).

## Repository layout

```
CLAUDE.md     Instructions for Claude Code (entry point)
docs/         Product brief, architecture, features, design spec, chatbot spec, roadmap
docs/design/  Validated mockups (HTML source) and how to read them
content/      All site content as data (experiences, projects, skills, knowledge base)
private/      Local-only raw sources (git-ignored, never published)
```

## Content and licence

The text, structure and personal information in `content/` are © Hamza Bencheikh, all rights reserved. The licence of the code is not chosen yet (open decision, see `docs/decisions.md`).
