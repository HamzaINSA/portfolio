# Content guidelines

All facts about Hamza live in `content/`. This file explains how to write, verify and publish them. Folder structure and schemas: `../content/README.md`.

## Principles

1. **No invention.** A sentence about Hamza must be traceable to a source he gave (CV, cover letter, his own message). If you cannot trace it, do not write it.
2. **No approximated numbers.** Do not write "about", "around" or round figures. Either the number has a verifiable source, or it is not published. Use `[SOURCE NEEDED]` as a visible marker during drafting. The CV says latency was reduced and relevance improved at Delta Quest but gives no figures: publish no figures.
3. **Status on every item.** `status: "verified"` means Hamza confirmed it and it matches the sources. `status: "to_confirm"` means a fact, a role, a date or a wording is not confirmed yet. `open questions` that do not block publishing go in `openQuestions` (not rendered).
4. **Tense matches reality.** Do not describe a planned or proposed mission as delivered. Fix the verbs when Hamza confirms the real status.
5. **Plain English.** Short sentences, concrete verbs, no buzzwords. First person on pages (it is Hamza's site); third person in chatbot answers.

## Publish gate (enforced by `check:content --strict`)

A production build fails if any published field contains `[TO CONFIRM]` or `[SOURCE NEEDED]`, if an item has `status: "to_confirm"`, or if a required public field is empty (`profile.contact.email`). Items with `to_confirm` are not rendered on the site and not included in the chatbot bundle in production.

## Confidentiality

- **Client missions are anonymised by default.** Use `client.descriptor` (for example "an environmental and territorial consulting firm"). The real client name may appear only if `client.disclosure` is `"named"`, `client.publicName` is set, and Hamza confirmed that ETIC and the client agree.
- **Never copy private documents into the repo**: commercial proposals, contracts, internal client data, names of client employees, prices, amounts, internal tool conventions. Those documents carry "all rights reserved" and no contractual value; use them only to understand what Hamza did. Raw sources stay in `private/` (git-ignored).
- **Do not attribute ETIC's other references to Hamza.** The proposals mention past ETIC projects (a data-visualisation platform, a data-centralisation application, an AI tool reading supplier certifications). They are ETIC's work, not necessarily his. Add them only if Hamza says he worked on them.
- **No third-party personal data**: no names, emails or phone numbers of ETIC members, client staff or supervisors.
- **Hamza's own data**: city-level location only. No phone number, no street address. The email to publish is decision O2.

## Missions and projects from commercial proposals

Two ETIC proposals were provided to explain what Hamza did. They are proposals, not delivery reports:

- One has a validity date and a planned schedule that run past today. It is not proof that the mission is signed, started or delivered.
- Each lists several team members. Hamza's exact role and scope are not stated for every mission.

Both are now projects in `content/projects/` (`context: "ETIC INSA Technologies"`, anonymous `client`). On 2026-11-20 Hamza confirmed that he did everything each proposal describes. Both are `verified` and in progress (`current: true`, present tense), as Hamza confirmed. On 2026-11-20 Hamza confirmed that both clients may be named (VINCI, Inddigo) and their logos shown; other clients stay anonymous until confirmed.

## Wording for experiences

For each experience: one-sentence `summary`; 2 to 4 `highlights` starting with a past-tense verb (what he did or built, with the result when it is verifiable); `learned` (what changed in how he works); `stack`; `tags` for filters. Keep each highlight to one line where possible.

## Ethics notes for AI content

When describing AI work, state what the AI did and did not influence (for example "the assistants cite sources and do not influence the calculations"). Do not claim accuracy or performance without a source. Mention data protection design (GDPR, AI Act) only as far as the sources say.

## Verification workflow

1. Draft from sources. 2. Mark anything uncertain `[TO CONFIRM]` and set `status: "to_confirm"`. 3. Ask Hamza (in French) with a short checklist. 4. On confirmation: remove markers, set `status: "verified"`, adjust tense. 5. Run `check:content --strict`.
