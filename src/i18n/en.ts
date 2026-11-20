// UI strings (decision D6). Facts about Hamza never live here: they come from content/.
export const en = {
  siteName: 'Hamza Bencheikh',
  skipLink: 'Skip to content',
  nav: {
    label: 'Main',
    items: [
      { key: 'home', label: 'home', href: '/' },
      { key: 'training', label: 'training', href: '/training' },
      { key: 'evaluation', label: 'evaluation', href: '/projects' },
      { key: 'about', label: 'about', href: '/about' },
    ],
    cta: { label: 'ASK THE MODEL →', href: '/ask' },
  },
  menu: { open: 'Open menu', close: 'Close menu', title: 'Menu' },
  footer: {
    rights: 'All rights reserved.',
    github: 'GitHub',
    linkedin: 'LinkedIn',
  },
  hero: {
    statusPrefix: 'STATUS: ',
    available: 'AVAILABLE FOR INTERNSHIP',
    introSuffix: 'fine-tuned for machine learning and AI.',
    introCta: 'Read my model card, or just ask the model.',
    ask: 'ASK THE MODEL',
    cv: 'DOWNLOAD CV',
  },
  console: {
    title: 'inference_console',
    meta: 'local · no API · no tracking',
    intro: '> I answer only from the data Hamza provided. Try one:',
    inputPlaceholder: 'type a question…',
  },
  modelDetails: {
    title: 'MODEL DETAILS',
    version: 'version',
    architecture: 'architecture',
    intendedUse: 'intended use',
    fullCard: 'FULL CARD →',
  },
  training: {
    title: 'Training run',
    all: 'all checkpoints →',
    curveLabel: 'Schematic of my path, not real metrics',
    checkpoint: 'checkpoint',
    now: 'now',
  },
  evaluation: { title: 'Evaluation', all: 'all projects →' },
  trainingPage: {
    title: 'Training run',
    crumb: '/ training',
    intro:
      'Every checkpoint is a period where I learned something that changed how I work. The curve is a schematic of my path, not real metrics.',
    now: 'NOW',
    checkpoint: 'CHECKPOINT',
    did: 'what I did',
    learned: 'what I learned',
    stack: 'stack',
    ask: 'ask about this →',
    askQuestion: (organization: string) =>
      `What did Hamza do at ${organization}?`,
    program: 'program',
    courses: 'relevant courses',
    next: 'next',
    cta: { title: 'See how this was evaluated.', button: 'EVALUATION →' },
  },
  cta: {
    title: 'Ready for your next training run.',
    contact: 'CONTACT →',
    ask: 'ASK THE MODEL',
  },
  notFound: {
    title: 'Page not found',
    text: 'This page does not exist.',
    back: 'BACK TO HOME',
  },
} as const;

/** Entries offered as suggestions in the Home console teaser: ids only, labels come from content/. */
export const teaserSuggestionIds = [
  'projects',
  'motivation',
  'availability',
] as const;
