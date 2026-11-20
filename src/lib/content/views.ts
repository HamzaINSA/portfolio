import { displayClient } from './anonymise';
import { formatRange } from '../format/dates';
import type { Experience, Project } from './types';

/** Display-safe fields of a checkpoint. Components receive this, never the raw experience. */
export interface CheckpointView {
  id: string;
  title: string;
  organization: string;
  /** Neutral client description for client missions (anonymous by default), otherwise null. */
  client: string | null;
  period: string;
  highlights: string[];
  learned: string[];
  stack: string[];
}

export function toCheckpointView(e: Experience): CheckpointView {
  return {
    id: e.id,
    title: e.title,
    organization: e.organization.displayName ?? e.organization.name,
    client: displayClient(e),
    period: formatRange(e.startDate, e.endDate),
    highlights: e.highlights,
    learned: e.learned,
    stack: e.stack,
  };
}

/** Titles of published academic plans (for example a double degree), shown as "next". */
export function plannedSteps(experiences: readonly Experience[]): string[] {
  return experiences.filter((e) => e.type === 'academic-plan').map((e) => e.title);
}

/** Display-safe fields of a project card on the Evaluation page. */
export interface ProjectCardView {
  id: string;
  href: string;
  title: string;
  summary: string;
  /** Chip shown on the card: the first filter topic among its tags (else the first tag), or null. */
  topic: string | null;
  /** All tags, used by the topic filter. */
  topics: string[];
  /** Frame of the project ("ETIC INSA Technologies"), or null for a personal project. */
  context: string | null;
  /** Neutral client description (anonymous by default), or null. */
  client: string | null;
  /** "2026", "2025–2026", or null when the start date is unknown (the year is then omitted). */
  year: string | null;
  /** The project is still going on. */
  current: boolean;
  /** Logo or visual, or null (the image area is then omitted). */
  image: { src: string; alt: string } | null;
  stack: string[];
}

/** "2026-06" + "2026-08" -> "2026"; "2025-09" + "2026-02" -> "2025–2026"; no start -> null. */
export function yearSpan(
  start: string | null | undefined,
  end: string | null | undefined,
): string | null {
  const from = start?.slice(0, 4);
  if (!from) return null;
  const to = end?.slice(0, 4);
  return to && to !== from ? `${from}–${to}` : from;
}

export function toProjectCardView(
  p: Project,
  filterTopics: readonly string[] = [],
): ProjectCardView {
  return {
    id: p.id,
    href: `/projects/${p.id}`,
    title: p.title,
    summary: p.summary,
    topic: p.tags.find((t) => filterTopics.includes(t)) ?? p.tags[0] ?? null,
    topics: p.tags,
    context: p.context ?? null,
    client: displayClient(p),
    year: yearSpan(p.startDate, p.endDate),
    current: p.current,
    image: p.image ?? null,
    stack: p.stack,
  };
}
