import { displayClient } from './anonymise';
import { formatRange } from '../format/dates';
import { publishedOnly } from './gate';
import type { RetrievalEntry } from '../retrieval/match';
import type { Experience, KnowledgeEntry, Project, Release, Releases, Skills } from './types';

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

export type ProjectFactKey = 'task' | 'data' | 'method' | 'metric' | 'result' | 'myRole';
export type ProjectStoryKey = 'worked' | 'failed' | 'next';

/** Display-safe fields of a project detail page. Blocks without content are left out. */
export interface ProjectDetailView extends ProjectCardView {
  links: { label: string; url: string }[];
  /** Project card cells that have content, in the mockup order. */
  facts: { key: ProjectFactKey; value: string }[];
  /** Narrative blocks that have content, in the mockup order. */
  story: { key: ProjectStoryKey; text: string }[];
}

const FACT_KEYS: readonly ProjectFactKey[] = ['task', 'data', 'method', 'metric', 'result', 'myRole'];
const STORY_KEYS: readonly ProjectStoryKey[] = ['worked', 'failed', 'next'];

const filled = (value: string | null | undefined): value is string =>
  typeof value === 'string' && value.trim().length > 0;

export function toProjectDetailView(
  p: Project,
  filterTopics: readonly string[] = [],
): ProjectDetailView {
  return {
    ...toProjectCardView(p, filterTopics),
    links: p.links.map((l) => ({ label: l.label, url: l.url })),
    facts: FACT_KEYS.flatMap((key) => {
      const value = p.card?.[key];
      return filled(value) ? [{ key, value }] : [];
    }),
    story: STORY_KEYS.flatMap((key) => {
      const text = p.retrospective?.[key];
      return filled(text) ? [{ key, text }] : [];
    }),
  };
}

/** The bio split into paragraphs (blank-line separated). Empty or null gives []. */
export function bioParagraphs(bio: string | null | undefined): string[] {
  return (bio ?? '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** "v4" becomes "4.0", as a command-line tool would print it. */
export function versionNumber(modelVersion: string): string {
  const n = modelVersion.replace(/^v/i, '');
  return n.includes('.') ? n : `${n}.0`;
}

/** Release notes of the About page: newest first; nothing when the file is not verified. */
export function releaseNotes(data: Releases): Release[] {
  if (data.status !== 'verified') return [];
  return data.releases.filter((r) => r.items.length > 0).reverse();
}

/** Capability columns of the About page: skill groups, then spoken languages with their level. */
export function capabilityGroups(
  skills: Skills,
  spokenLabel: string,
): { label: string; items: string[] }[] {
  const groups = skills.groups
    .filter((g) => g.items.length > 0)
    .map((g) => ({ label: g.label, items: g.items }));
  const spoken = skills.spoken.map((s) => `${s.language} (${s.level})`);
  return spoken.length > 0 ? [...groups, { label: spokenLabel, items: spoken }] : groups;
}

/** Knowledge-base entries the chatbot may use: verified only, without internal fields. */
export function toRetrievalEntries(entries: readonly KnowledgeEntry[]): RetrievalEntry[] {
  return publishedOnly(entries).map((e) => ({
    id: e.id,
    title: e.title,
    source: e.source,
    keywords: e.keywords,
    phrases: e.phrases,
    exampleQuestions: e.exampleQuestions,
    answer: e.answer,
    links: e.links,
    related: e.related,
    priority: e.priority,
    suggested: e.suggested,
    suggestedLabel: e.suggestedLabel,
  }));
}
