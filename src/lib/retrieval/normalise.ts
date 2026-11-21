// Text normalisation for the local retrieval chatbot (docs/chatbot-spec.md). Pure functions only.

/** Small fixed English stop-word list, compared before stemming. A test checks no keyword is one. */
export const STOP_WORDS: ReadonlySet<string> = new Set([
  'a',
  'about',
  'an',
  'and',
  'any',
  'are',
  'as',
  'at',
  'be',
  'can',
  'could',
  'did',
  'do',
  'does',
  'for',
  'from',
  'has',
  'have',
  'he',
  'her',
  'him',
  'his',
  'how',
  'i',
  'in',
  'is',
  'it',
  'its',
  'me',
  'my',
  'of',
  'on',
  'or',
  'please',
  'she',
  'so',
  'tell',
  'that',
  'the',
  'their',
  'them',
  'there',
  'this',
  'to',
  'us',
  'was',
  'what',
  'which',
  'who',
  'whom',
  'with',
  'would',
  'you',
  'your',
  'hamza',
]);

/** Lower case, accents stripped, punctuation to spaces (keeps + and # so that c++ and c# survive). */
export function normalise(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9+#]+/g, ' ')
    .trim();
}

/** Light stemming: trailing plural "s" (not "ss"), and "ing" when the stem keeps at least 4 letters. */
export function stem(token: string): string {
  if (token.length >= 7 && token.endsWith('ing')) return token.slice(0, -3);
  if (token.length > 2 && token.endsWith('s') && !token.endsWith('ss'))
    return token.slice(0, -1);
  return token;
}

/** Normalised, stemmed tokens of a text, stop words included (phrases need them). */
export function tokens(text: string): string[] {
  const n = normalise(text);
  return n ? n.split(' ').map(stem) : [];
}

/** Tokens that can match a keyword: stop words removed (before stemming), then stemmed. */
export function contentTokens(text: string): string[] {
  const n = normalise(text);
  return n
    ? n
        .split(' ')
        .filter((t) => !STOP_WORDS.has(t))
        .map(stem)
    : [];
}
