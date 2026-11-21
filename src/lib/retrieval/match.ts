// Keyword retrieval over the knowledge base (docs/chatbot-spec.md). Deterministic, no network, no model.
import { contentTokens, stem, tokens } from './normalise';

export interface RetrievalEntry {
  id: string;
  title: string;
  source: string;
  keywords: readonly string[];
  phrases: readonly string[];
  exampleQuestions: readonly string[];
  answer: string;
  links: readonly { label: string; href: string }[];
  related: readonly string[];
  priority: number;
  suggested: boolean;
  suggestedLabel?: string | undefined;
}

export interface Scored {
  entry: RetrievalEntry;
  score: number;
}

export interface RetrievalResult {
  entry: RetrievalEntry;
  score: number;
  /** Equal best score on another entry: shown as "Did you mean…?". */
  ambiguous: RetrievalEntry | null;
  /** Second-best entry with a real score, listed in the answer's `related`: shown as a suggestion. */
  related: RetrievalEntry | null;
}

/** Below this score the console answers with the fallback. One keyword (2 points) is enough. */
export const THRESHOLD = 2;
/** Questions are cut to this length before matching (input limit of the console). */
export const MAX_QUESTION_LENGTH = 200;

/** Keyword tokens of an entry: each keyword is normalised and stemmed the same way as questions. */
export function keywordTokens(
  entry: Pick<RetrievalEntry, 'keywords'>,
): string[] {
  return [...new Set(entry.keywords.flatMap((k) => tokens(k)))];
}

function containsSequence(
  haystack: readonly string[],
  needle: readonly string[],
): boolean {
  if (needle.length === 0 || needle.length > haystack.length) return false;
  for (let i = 0; i + needle.length <= haystack.length; i++) {
    if (needle.every((t, j) => haystack[i + j] === t)) return true;
  }
  return false;
}

/** +2 per distinct keyword found, +3 per phrase found as a contiguous token sequence. */
export function score(question: string, entry: RetrievalEntry): number {
  const all = tokens(question);
  const words = new Set(contentTokens(question));
  const keywordScore =
    keywordTokens(entry).filter((k) => words.has(k)).length * 2;
  const phraseScore =
    entry.phrases.filter((p) => containsSequence(all, tokens(p))).length * 3;
  return keywordScore + phraseScore;
}

/** Best first: score, then priority, then id (alphabetical) so that ties are deterministic. */
export function rank(
  question: string,
  entries: readonly RetrievalEntry[],
): Scored[] {
  return entries
    .map((entry) => ({ entry, score: score(question, entry) }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.entry.priority - a.entry.priority ||
        a.entry.id.localeCompare(b.entry.id),
    );
}

/** The answer for a question, or null (fallback) when nothing scores at least THRESHOLD. */
export function retrieve(
  question: string,
  entries: readonly RetrievalEntry[],
): RetrievalResult | null {
  const q = question.slice(0, MAX_QUESTION_LENGTH);
  const [best, second] = rank(q, entries);
  if (!best || best.score < THRESHOLD) return null;
  const close = second && second.score >= THRESHOLD ? second : null;
  const ambiguous = close && close.score === best.score ? close.entry : null;
  return {
    entry: best.entry,
    score: best.score,
    ambiguous,
    related:
      close && !ambiguous && best.entry.related.includes(close.entry.id)
        ? close.entry
        : null,
  };
}

export { stem };
