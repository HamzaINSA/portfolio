import { displayClient } from './anonymise';
import { formatRange } from '../format/dates';
import type { Experience } from './types';

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
