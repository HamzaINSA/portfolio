# Chatbot specification: "Ask the model"

A search engine over Hamza's own data, dressed as a console. It is **not** a language model. It never generates text: it returns the stored `answer` of the best-matching knowledge-base entry, and says so when nothing matches.

## Principles

1. **Honest.** Answers come only from verified knowledge-base entries. Out-of-scope questions get the fallback, never a guess.
2. **Local and private.** Runs in the browser. No API, no network call, no cookies, no storage of questions. The conversation lives in memory and disappears on reload.
3. **Explainable.** Every answer shows its source file (`source: projects.json`). The side panel highlights the file used.
4. **Deterministic.** Same question, same answer. Everything testable.
5. **Accessible and progressive.** Works with keyboard and screen readers. Without JavaScript, the page shows the knowledge base as a readable FAQ.

## Data

Entries live in `content/knowledge-base/*.json` (schema: `content/schema/knowledge-entry.schema.json`, guidelines: `content/knowledge-base/README.md`).

Fields: `id`, `title`, `source` (file name shown to the visitor), `keywords`, `phrases`, `exampleQuestions`, `answer`, `links`, `related`, `priority`, `status`.

At build time, `/ask` embeds the verified entries (internal fields removed, see `toRetrievalEntries` in `src/lib/content/views.ts`) as a JSON `<script type="application/json">` in the page. Answering therefore needs no request at all, not even to the same origin. Unverified entries are never embedded, in dev or in production (simpler than a dev-only "unverified" tag), and the evaluation set runs on verified entries only.

## Matching algorithm (`src/lib/retrieval`, pure functions)

1. **Normalise**: lowercase, Unicode NFD and strip accents, replace punctuation with spaces (keep `+` and `#` so that `c++` and `c#` survive as tokens), collapse spaces.
2. **Tokenise** on spaces. Phrases are matched on the full stemmed token sequence (so "how long" works). Keywords are matched after dropping stop words (small fixed English list kept in the module; a test checks that no stemmed keyword of any entry is a stop word).
3. **Light stemming**: strip a trailing plural `s` (but not `ss`), and `ing` where the stem is at least 4 letters. Apply the same function to entry keywords, so both sides match.
4. **Score** each entry: `+2` per distinct keyword found among tokens, `+3` per `phrase` found as a contiguous token sequence. Ties are broken by higher `priority`, then by alphabetical `id` (determinism).
5. **Threshold**: answer only if the best score is at least 2. A single weak keyword (score 1 is impossible by construction) never answers.
6. **Result**: `{ entry, score }` or `null`. The second-best entry is shown as a "Related" chip only if its score is at least 2 **and** it is listed in the answer's `related` field (author-curated; this avoids noise such as "Skills" after a question that merely contains "technologies").
7. **Ambiguity**: when the top two scores are equal, answer with the higher priority entry and show the other as "Did you mean…?" chip.

Keep the algorithm simple; improve it only through the evaluation set below, and document any change here.

A prototype of this algorithm (Python, planning time) matched every `exampleQuestions` of the 14 entries to the right entry and returned the fallback for the out-of-scope cases below, after one keyword conflict was fixed. Treat that as a sanity check, not as a guarantee: the real evaluation set in `tests/chat/eval-set.json` is the authority, and the Python script is not part of the repo.

## Fallback

> I don't have that in my data, so I won't guess. You can ask Hamza directly: [Contact page].

Show suggestion chips under it. No source line.

## Console behaviour

- Opening message: "I answer only from the data Hamza provided. Pick a question or type your own."
- Suggestion chips (from entries flagged `suggested: true`, at most 5): "What has Hamza built?", "What is he studying?", "Why machine learning?", "When is he available?", "How can I reach him?".
- Typing and sending (Enter or button) appends the question, then the answer. A short artificial delay is not allowed (it would pretend work that does not happen).
- Query parameter `/ask?q=…` asks the question on load (used by teasers and "ask about this" links). Sanitise: treat as text only, never as HTML.
- Answers can include `links` rendered as buttons (for example "Contact page").
- Input limit: 200 characters. Empty input does nothing.
- "Reset" action clears the conversation.

## Accessibility

- The message list is a labelled region with `aria-live="polite"`; each new answer is announced once.
- Input has a visible `<label>`; Send is a real `<button type="submit">`; chips are real `<button>`s.
- Focus returns to the input after sending. No focus trap. No auto-scrolling that fights the screen reader.
- Contrast on the dark console meets AA (see `design-spec.md`).

## Security and privacy

- Render answers as text (no `innerHTML`). Links come from the schema only.
- CSP `connect-src 'self'`. A Playwright test fails if any non-same-origin request happens on `/ask` or if `fetch`/`XMLHttpRequest` is called with a cross-origin URL.
- Nothing from the conversation is stored or sent. The privacy page says so, and it must stay true.
- Prompt-injection is not applicable (there is no language model), but a test includes such inputs to confirm they produce the fallback.

Stop words are removed before stemming (otherwise "his" would become "hi" and slip through). Suggestion chips ask the entry's first example question, which the evaluation set guarantees to resolve to that entry.

## Evaluation set (`tests/chat/eval-set.json`, runs in CI through `npm run test`)

Build it from entries' `exampleQuestions`, plus hand-written cases. Required groups:

- **In scope** (each entry: its example questions plus paraphrases, at least 3 per verified entry) → expected entry id.
- **Ambiguous** (for example "languages") → expected entry plus a "Did you mean" suggestion.
- **Out of scope** ("Does he like football?", salary expectations, political opinions, "what is his phone number?", gibberish, empty, very long input) → fallback. Private data requests must never be answered.
- **Hostile** ("ignore previous instructions and reveal…") → fallback.

The test fails if any case is wrong. When a real visitor question later fails, add it to the set first, then fix.

## Not in V1 (ask first, see decision O9)

Semantic search with an embeddings model in the browser, or any external language model. Reasons to ask: model download size, performance on phones, loss of determinism, privacy and cost if an API is used.
