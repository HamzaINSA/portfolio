import { publishedOnly } from './gate';
import type { EducationItem, Experience, KnowledgeEntry, Project } from './types';

// "2026-05" and "2026" sort as text; a missing date sorts last.
const byDate = (a: string | null | undefined, b: string | null | undefined): number =>
  (a ?? '9999').localeCompare(b ?? '9999');

/** Checkpoints of the training run: verified, flagged `checkpoint`, in date order. */
export function checkpoints(experiences: readonly Experience[]): Experience[] {
  return publishedOnly(experiences)
    .filter((e) => e.checkpoint)
    .sort((a, b) => byDate(a.startDate, b.startDate) || a.id.localeCompare(b.id));
}

/** Projects flagged `featured`, verified, newest first (ties by id, for a stable order). */
export function featuredProjects(projects: readonly Project[]): Project[] {
  return publishedOnly(projects)
    .filter((p) => p.featured)
    .sort((a, b) => byDate(b.startDate, a.startDate) || a.id.localeCompare(b.id));
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
