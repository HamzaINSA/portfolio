# content/experiences/

Everything that makes up Hamza's "training run": internships, client missions, association roles, programs, scholarships, tutoring, the planned KTH double degree and the long-term goal. One JSON file per item. Schema: `../schema/experience.schema.json`.

## How to add an experience (no code change needed)

1. Copy `_template.json` to `<kebab-case-id>.json` (the file name equals the `id`).
2. Fill the fields from sources Hamza gave. Do not invent. Use `[TO CONFIRM: …]` where unsure and set `"status": "to_confirm"`.
3. Set `checkpoint: true` only for items that should appear on the Training curve.
4. Run `npm run check:content`. The Training page picks up the new file automatically.
5. When Hamza confirms the open questions, remove markers, set `"status": "verified"`, fix the verb tense, and run `check:content --strict`.

## Types

`internship`, `junior-enterprise`, `client-mission` (legacy; projects done with ETIC or as a freelancer go to `../projects/` with `context` and `client`), `tutoring`, `program`, `association`, `scholarship`, `academic-plan`, `career-goal`.

## Index of current items

| File | Type | Status | Notes |
|---|---|---|---|
| `delta-quest-internship.json` | internship | verified | From CV; no metrics published |
| `etic-insa-technologies.json` | junior-enterprise | verified | From CV; current |
| `academic-tutor.json` | tutoring | verified | From CV |
| `aedi-general-secretary.json` | association | verified | From CV |
| `georges-besse-foundation.json` | scholarship | verified | From CV |
| `entrepreneurship-track.json` | program | verified | From CV |
| `propulseo-asys.json` | program | **to_confirm** | Hamza gave the names only |
| `kth-double-degree.json` | academic-plan | **to_confirm** | Hamza: planned for next year |
| `phd-goal.json` | career-goal | verified | Stated by Hamza |

## Open questions for Hamza (ask in French, one by one)

1. **ETIC projects** now live in `../projects/` (Hamza, 2026-11-20: work done with ETIC or as a freelancer is a project; experiences are roles such as internships or tutoring). Their remaining questions are in each project file: status of the material flow prototype (its planned schedule runs into 2027), dates, and naming of clients (anonymous until ETIC and the client agree).
2. **Propulseo and Asys:** what is Propulseo (program, incubator, association?), since when, what did Asys do ("propulsé par Asys")? How should it be worded?
3. **KTH double degree:** programme name, exact dates, admission confirmed or still pending, and what happens to the 5th year at INSA Lyon.
4. **Delta Quest:** may figures be published for the latency reduction and relevance improvement? Only with a verifiable source; otherwise keep the qualitative wording.
5. **Dates:** exact start and end months for tutoring (CV gives 2023 to 2026), the Entrepreneurship Track and the Georges Besse Foundation.

## Rules specific to this folder

- Never attribute ETIC's other references (shown in its proposals) to Hamza.
- `openQuestions` and `internalNote` must not contain client names, amounts, prices, or names of third parties.
- Do not copy sentences from ETIC proposals: describe the work in your own words, anonymised.
