# content/

The single source of truth for everything the site says about Hamza. The site pages and the chatbot read these files; components never contain facts.

Language: English. Dates: `YYYY-MM` (or `YYYY` when only the year is known), `null` when unknown or ongoing.

## Structure

```
content/
  profile.json              identity, availability, links, contact, bio, model version
  education.json            INSA Lyon items (the KTH plan is in experiences/)
  skills.json               skills grouped as on the CV
  releases.json             About page "release notes": the path as version history (restates verified facts)
  experiences/              everything that makes up the "training run"
    README.md               how to add an experience, status policy, open questions checklist
    _template.json          copy this to add one
    *.json                  one file per item
  projects/                 one file per project (Evaluation page)
  knowledge-base/           chatbot entries, one file each
    README.md               how to write entries
  schema/                   JSON Schemas: contract for experiences, projects, KB entries
```

`profile`, `education` and `skills` have no JSON Schema file yet. Create their Zod schemas in `src/content.config.ts` from the shapes in the files, and add schema files here if useful.

## Rules

- Facts come from Hamza's CV, cover letter and his own messages. Nothing else.
- Every item has `status`: `"verified"` or `"to_confirm"`. Only `verified` content is published (see `../docs/content-guidelines.md`).
- Text still unknown is written `[TO CONFIRM: what is missing]`. Numbers without a source are `[SOURCE NEEDED]`, or left out.
- `openQuestions` and `internalNote` are for developers and Hamza only. They are **never rendered** and must not contain private data (no client names, prices, phone numbers, third-party names).
- Files in this folder are public once the repo is public. Do not put anything here that must stay private (use `private/`).

## Single source, no duplication

- The KTH double degree and the PhD goal are in `experiences/` (types `academic-plan` and `career-goal`). The Training page "next" card and the chatbot read them from there.
- The chatbot's `answer` texts are written for the console voice (third person) and must stay consistent with the items they reference (`related` / `sources` fields); a test checks that referenced ids exist.

## Who needs to confirm what

See `experiences/README.md` for the list of open questions. The site cannot go live until `check:content --strict` passes.
