# content/knowledge-base/

The documents the chatbot can answer from. One JSON file per entry. Schema: `../schema/knowledge-entry.schema.json`. Algorithm and behaviour: `../../docs/chatbot-spec.md`.

## How to write an entry

- `id` and the file name match; `source` is the file name shown to the visitor (for example `education.json`).
- `answer`: plain text, third person ("Hamza is…"), short (2 to 4 sentences), consistent with the content items listed in `sources`. Never add a fact that is not in `../`.
- `keywords`: lower case, no accents, single words that a visitor would use. Include singular forms; plurals and `-ing` are normalised at match time. Add `c++` and `c#` style tokens as they are.
- `phrases`: multi-word expressions that disambiguate ("computer science", "double degree").
- `exampleQuestions`: at least 3 real-sounding questions. They become the evaluation set, so each must really lead to this entry.
- `priority`: higher wins ties. Use `1` for entries that share generic words with others (see below).
- `status`: `verified` only when every claim in `answer` is verified. Otherwise `to_confirm` with a placeholder in the text; it will not ship.
- `suggested: true` and `suggestedLabel` for the 5 chips shown in the console.
- Never include private data (phone number, address) or client names.

## Known overlaps (handled with `priority`)

- "work / working": `experience` vs `projects` (a startup question) → `projects` has priority 1.
- "long / how long": `availability` vs `experience` → `availability` has priority 1.
- "languages": programming (`skills`) vs spoken (`languages`) → the spoken entry answers and links to `skills` through `related`; the console shows "Did you mean programming languages?".
- "research / interested": `phd-goal` vs `motivation` → `phd-goal` has priority 1.
- "propulseo / asys": `propulseo-asys` vs `involvement` → `propulseo-asys` has priority 1.
- "languages" alone: `languages` has priority 2 over `skills` (priority 1), and the console offers "Did you mean: Skills?".

When a new entry or keyword creates a conflict, add the question to `tests/chat/eval-set.json` first, then resolve it with keywords, phrases or priority.

## Entries that are not verified

None at the moment. An entry marked `to_confirm` is never embedded in the site and makes the strict gate fail on `main`.

## Entries

`education`, `experience`, `projects`, `client-missions`, `motivation`, `phd-goal`, `kth-double-degree`, `availability`, `skills`, `languages`, `involvement`, `interests`, `contact`, `propulseo-asys`.
