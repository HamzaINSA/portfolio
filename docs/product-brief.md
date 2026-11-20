# Product brief

## Purpose

An internship application often asks for a website. This one has to do three jobs in a few minutes of a recruiter's attention:

1. Say clearly who Hamza is, what he is looking for, and when he is available.
2. Show evidence: experiences, projects, how things were evaluated.
3. Be memorable. A generic portfolio template is not acceptable; Hamza explicitly rejected classic designs.

## Positioning

Aspiring machine-learning engineer and future researcher. He builds products and cares about evaluating AI honestly (evaluation pipeline, blind model comparison, reproducibility). International profile (internship in Japan, French native, English, Japanese at intermediate level, KTH double degree planned).

Fact base: `content/` only. Never add a claim that is not there.

## Audience

- Recruiters and hiring managers of AI / ML / LLM teams (30-second scan).
- Engineers who want to check depth (5-minute read: projects, method, honest limits).

A recruiter must find, from the home page, within about 10 seconds: who, what is sought, availability, one strong piece of evidence, how to contact.

## Differentiators

- **Model card concept**: the whole site speaks the vocabulary of ML documentation, including a section on known limitations. Honest limits build credibility.
- **Local chatbot ("Ask the model")**: answers only from Hamza's data, shows its source file, says "I don't have that in my data" instead of guessing. Runs in the browser, no API, no tracking.
- **Visual identity**: validated "model card" mockups (paper background, ink, acid-lime accent, monospace body, thick square borders).

## Voice

- Page copy: first person, direct, plain English, short sentences, no buzzwords.
- Console (chatbot) answers: third person about Hamza ("Hamza is looking for…"), because the console is a separate entity that only reads his data.
- Show limits and failures where relevant. No superlatives, no invented numbers.

## Non-goals (V1)

Backend or database, authentication, CMS, blog, French translation, dark/light switch, analytics, generative AI or any external API, comments, newsletter.

## Success criteria

- All screens in `docs/design/mockups/` implemented, responsive, accessible (WCAG 2.1 AA).
- Chatbot passes its full evaluation set (`docs/chatbot-spec.md`).
- Strict content gate passes: no placeholder, no unverified fact, no private data published.
- Fast and light: static output, JavaScript only where needed (chat, filters, mobile menu).
- Hamza can add an experience or project by adding one content file, without touching components.
