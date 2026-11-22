import type { z } from 'astro/zod';
import type {
  educationItemSchema,
  experienceSchema,
  knowledgeEntrySchema,
  legalSchema,
  profileSchema,
  projectSchema,
  releaseSchema,
  releasesSchema,
  skillsSchema,
} from './schemas';

export type Experience = z.infer<typeof experienceSchema>;
export type Project = z.infer<typeof projectSchema>;
export type KnowledgeEntry = z.infer<typeof knowledgeEntrySchema>;
export type Profile = z.infer<typeof profileSchema>;
export type EducationItem = z.infer<typeof educationItemSchema>;
export type Skills = z.infer<typeof skillsSchema>;
export type Releases = z.infer<typeof releasesSchema>;
export type Release = z.infer<typeof releaseSchema>;
export type Legal = z.infer<typeof legalSchema>;
