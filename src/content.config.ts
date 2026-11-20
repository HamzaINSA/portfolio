import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { file, glob } from 'astro/loaders';
import {
  educationItemSchema,
  experienceSchema,
  knowledgeEntrySchema,
  profileSchema,
  projectSchema,
  skillsSchema,
} from './lib/content/schemas';

// Single-object files become a one-item collection so every content type goes through the same pipeline.
const single = (text: string) => [{ id: 'main', ...JSON.parse(text) }];

export const collections = {
  profile: defineCollection({
    loader: file('content/profile.json', { parser: single }),
    schema: profileSchema.extend({ id: z.string() }),
  }),
  skills: defineCollection({
    loader: file('content/skills.json', { parser: single }),
    schema: skillsSchema.extend({ id: z.string() }),
  }),
  education: defineCollection({
    loader: file('content/education.json'),
    schema: educationItemSchema,
  }),
  experiences: defineCollection({
    loader: glob({
      pattern: ['*.json', '!_*.json'],
      base: 'content/experiences',
    }),
    schema: experienceSchema,
  }),
  projects: defineCollection({
    loader: glob({ pattern: '*.json', base: 'content/projects' }),
    schema: projectSchema,
  }),
  knowledgeBase: defineCollection({
    loader: glob({ pattern: '*.json', base: 'content/knowledge-base' }),
    schema: knowledgeEntrySchema,
  }),
};
