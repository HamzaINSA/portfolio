import { z } from 'astro/zod';

// Zod mirror of content/schema/*.json. Fields without a JSON Schema file (profile, education, skills)
// are derived from the shape of the files. All objects are strict, like "additionalProperties": false.

const kebabId = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'id must be kebab-case');
const date = z
  .string()
  .regex(/^\d{4}(-\d{2})?$/, 'date must be YYYY or YYYY-MM')
  .nullable();
const status = z.enum(['verified', 'to_confirm']);
const stringList = z.array(z.string()).default([]);
const link = z.object({ label: z.string(), url: z.url() }).strict();

export const experienceSchema = z
  .object({
    id: kebabId,
    type: z.enum([
      'internship',
      'junior-enterprise',
      'client-mission',
      'tutoring',
      'program',
      'association',
      'scholarship',
      'academic-plan',
      'career-goal',
    ]),
    parentId: z.string().optional(),
    title: z.string().min(1),
    organization: z.object({ name: z.string(), displayName: z.string().optional() }).strict(),
    location: z.string().nullable().optional(),
    startDate: date.optional(),
    endDate: date.optional(),
    current: z.boolean().default(false),
    checkpoint: z.boolean().default(false),
    summary: z.string().min(1),
    highlights: stringList,
    learned: stringList,
    stack: stringList,
    tags: stringList,
    links: z.array(link).default([]),
    client: z
      .object({
        disclosure: z.enum(['anonymous', 'named']),
        descriptor: z.string(),
        publicName: z.string().nullable().optional(),
      })
      .strict()
      .optional(),
    status,
    openQuestions: stringList,
    internalNote: z.string().optional(),
  })
  .strict();

const nullableText = z.string().nullable().optional();

export const projectSchema = z
  .object({
    id: kebabId,
    title: z.string().min(1),
    role: nullableText,
    startDate: date.optional(),
    endDate: date.optional(),
    current: z.boolean().default(false),
    featured: z.boolean().default(false),
    summary: z.string().min(1),
    highlights: stringList,
    stack: stringList,
    tags: stringList,
    card: z
      .object({
        task: nullableText,
        data: nullableText,
        method: nullableText,
        metric: nullableText,
        result: nullableText,
        myRole: nullableText,
      })
      .strict()
      .optional(),
    retrospective: z
      .object({ worked: nullableText, failed: nullableText, next: nullableText })
      .strict()
      .optional(),
    links: z.array(link).default([]),
    status,
    openQuestions: stringList,
    internalNote: z.string().optional(),
  })
  .strict();

const kbToken = z.string().regex(/^[a-z0-9+#. ]+$/, 'lower-case, no accents');

export const knowledgeEntrySchema = z
  .object({
    id: kebabId,
    title: z.string(),
    source: z.string().regex(/^[a-z0-9-]+\.json$/, 'source must be a .json file name'),
    keywords: z.array(kbToken).min(3),
    phrases: z.array(kbToken).default([]),
    exampleQuestions: z.array(z.string()).min(3),
    answer: z.string().min(1),
    links: z.array(z.object({ label: z.string(), href: z.string() }).strict()).default([]),
    sources: stringList,
    related: stringList,
    priority: z.number().int().default(0),
    suggested: z.boolean().default(false),
    suggestedLabel: z.string().optional(),
    status,
    openQuestions: stringList,
  })
  .strict();

export const profileSchema = z
  .object({
    name: z.string(),
    headline: z.string(),
    school: z.string(),
    yearLabel: z.string(),
    modelVersion: z.string(),
    location: z.string(),
    seeking: z
      .object({
        role: z.string(),
        duration: z.string(),
        start: z.string().regex(/^\d{4}-\d{2}$/),
        relocation: z.boolean(),
      })
      .strict(),
    links: z.object({ github: z.url(), linkedin: z.url() }).strict(),
    contact: z.object({ email: z.email().nullable() }).strict(),
    cv: z.object({ path: z.string().nullable() }).strict(),
    photo: z.string().nullable(),
    bio: z.string().nullable(),
    status,
    openQuestions: stringList,
  })
  .strict();

export const educationItemSchema = z
  .object({
    id: kebabId,
    institution: z.string(),
    program: z.string(),
    startYear: z.number().int(),
    endYear: z.number().int().nullable(),
    location: z.string(),
    notes: stringList,
    coursework: stringList,
    current: z.boolean(),
    status,
    openQuestions: stringList,
  })
  .strict();

export const skillsSchema = z
  .object({
    groups: z.array(z.object({ id: kebabId, label: z.string(), items: z.array(z.string()) }).strict()),
    spoken: z.array(z.object({ language: z.string(), level: z.string() }).strict()),
    status,
    openQuestions: stringList,
  })
  .strict();
