import { publishedOnly } from './gate';
import type { EducationItem, Experience, KnowledgeEntry, Project } from './types';

type MaybeDate = string | null | undefined;

// "2026-05" and "2026" sort as text; a missing date sorts last in both directions.
const byDate = (a: MaybeDate, b: MaybeDate): number =>
  (a ?? '9999').localeCompare(b ?? '9999');
const byDateDesc = (a: MaybeDate, b: MaybeDate): number =>
  !a || !b ? Number(!a) - Number(!b) : b.localeCompare(a);

/** Checkpoints of the training run: verified, flagged `checkpoint`, in date order. */
export function checkpoints(experiences: readonly Experience[]): Experience[] {
  return publishedOnly(experiences)
    .filter((e) => e.checkpoint)
    .sort((a, b) => byDate(a.startDate, b.startDate) || a.id.localeCompare(b.id));
}

/** Verified projects, newest first (ties by id, for a stable order). */
export function publishedProjects(projects: readonly Project[]): Project[] {
  return publishedOnly(projects).sort(
    (a, b) => byDateDesc(a.startDate, b.startDate) || a.id.localeCompare(b.id),
  );
}

/** Projects flagged `featured`, verified, newest first. */
export function featuredProjects(projects: readonly Project[]): Project[] {
  return publishedProjects(projects).filter((p) => p.featured);
}

/** Topics of the given projects from their `tags`: most used first, then alphabetical. */
export function projectTopics(projects: readonly Project[]): string[] {
  const counts = new Map<string, number>();
  for (const tag of projects.flatMap((p) => p.tags)) {
    counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts]
    .sort(([a, ca], [b, cb]) => cb - ca || a.localeCompare(b))
    .map(([tag]) => tag);
}

/** The education item in progress: marked current, verified. */
export function currentEducation(items: readonly EducationItem[]): EducationItem | undefined {
  return publishedOnly(items).find((i) => i.current);
}

/** Verified knowledge entries by id, in the requested order; unknown or unverified ids are skipped. */
export function entriesById(entries: readonly KnowledgeEntry[], ids: readonly string[]): KnowledgeEntry[] {
  const published = publishedOnly(entries);
  return ids.flatMap((id) => published.filter((e) => e.id === id));
}
