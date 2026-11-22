import { getCollection, getEntry } from 'astro:content';
import type { EducationItem, Experience, KnowledgeEntry, Legal, Partners, Profile, Project, Releases, Skills } from './types';

// Thin loaders over the Astro collections. Selection and gate logic live in pure modules (select.ts, gate.ts).

export async function getProfile(): Promise<Profile> {
  const entry = await getEntry('profile', 'main');
  if (!entry) throw new Error('content/profile.json is missing');
  return entry.data;
}

export async function getSkills(): Promise<Skills> {
  const entry = await getEntry('skills', 'main');
  if (!entry) throw new Error('content/skills.json is missing');
  return entry.data;
}

export async function getReleases(): Promise<Releases> {
  const entry = await getEntry('releases', 'main');
  if (!entry) throw new Error('content/releases.json is missing');
  return entry.data;
}

export async function getLegal(): Promise<Legal> {
  const entry = await getEntry('legal', 'main');
  if (!entry) throw new Error('content/legal.json is missing');
  return entry.data;
}

export async function getPartners(): Promise<Partners> {
  const entry = await getEntry('partners', 'main');
  if (!entry) throw new Error('content/partners.json is missing');
  return entry.data;
}

export async function getEducation(): Promise<EducationItem[]> {
  return (await getCollection('education')).map((e) => e.data);
}

export async function getExperiences(): Promise<Experience[]> {
  return (await getCollection('experiences')).map((e) => e.data);
}

export async function getProjects(): Promise<Project[]> {
  return (await getCollection('projects')).map((e) => e.data);
}

export async function getKnowledgeBase(): Promise<KnowledgeEntry[]> {
  return (await getCollection('knowledgeBase')).map((e) => e.data);
}
