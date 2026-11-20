// Topic filter of the Evaluation page. Pure functions, shared by the page script and the unit tests.

/** URL query parameter that holds the active topic (`/projects?topic=llm`). */
export const TOPIC_PARAM = 'topic';

/** The active topic from the URL value, or null ("All") when it is missing or not a known topic. */
export function resolveTopic(
  value: string | null | undefined,
  topics: readonly string[],
): string | null {
  return value && topics.includes(value) ? value : null;
}

/** Whether an item with these tags is shown when `topic` is active (null shows everything). */
export function matchesTopic(
  itemTopics: readonly string[],
  topic: string | null,
): boolean {
  return topic === null || itemTopics.includes(topic);
}

/** The search string for a topic, keeping other parameters; "All" removes the parameter. */
export function topicSearch(search: string, topic: string | null): string {
  const params = new URLSearchParams(search);
  if (topic === null) params.delete(TOPIC_PARAM);
  else params.set(TOPIC_PARAM, topic);
  const query = params.toString();
  return query ? `?${query}` : '';
}

/** "1 project shown" / "3 projects shown" from the two UI strings (`{n}` is replaced). */
export function formatCount(
  n: number,
  strings: { one: string; many: string },
): string {
  return n === 1 ? strings.one : strings.many.replace('{n}', String(n));
}
