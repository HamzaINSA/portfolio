# content/experiences/

Everything that makes up Hamza's "training run": internships, client missions, association roles, programs, scholarships, tutoring, the planned KTH double degree and the long-term goal. One JSON file per item. Schema: `../schema/experience.schema.json`.

## How to add an experience (no code change needed)

1. Copy `_template.json` to `<kebab-case-id>.json` (the file name equals the `id`).
2. Fill the fields from sources Hamza gave. Do not invent. Use `[TO CONFIRM: …]` where unsure and set `"status": "to_confirm"`.
3. Set `checkpoint: true` only for items that should appear on the Training curve.
4. Run `npm run check:content`. The Training page picks up the new file automatically.
5. When Hamza confirms the open questions, remove markers, set `"status": "verified"`, fix the verb tense, and run `check:content --strict`.

## Types

`internship`, `junior-enterprise`, `client-mission` (use `parentId` and `client`), `tutoring`, `program`, `association`, `scholarship`, `academic-plan`, `career-goal`.

## Index of current items

| File | Type | Status | Notes |
|---|---|---|---|
| `delta-quest-internship.json` | internship | verified | From CV; no metrics published |
| `etic-insa-technologies.json` | junior-enterprise | verified | From CV; current |
| `etic-mission-planning-automation.json` | client-mission | **to_confirm** | Source is a proposal; client anonymised |
| `etic-mission-material-flow-prototype.json` | client-mission | **to_confirm** | Source is a proposal; client anonymised |
| `academic-tutor.json` | tutoring | verified | From CV |
| `aedi-general-secretary.json` | association | verified | From CV |
| `georges-besse-foundation.json` | scholarship | verified | From CV |
| `entrepreneurship-track.json` | program | verified | From CV |
| `propulseo-asys.json` | program | **to_confirm** | Hamza gave the names only |
| `kth-double-degree.json` | academic-plan | **to_confirm** | Hamza: planned for next year |
| `phd-goal.json` | career-goal | verified | Stated by Hamza |

## Open questions for Hamza (ask in French, one by one)

1. **Missions: real status.** The two proposals are not proof of signature or delivery (one has a validity date that has passed or is about to; the planned schedule of the other runs into 2027). For each: signed? started? delivered? What exactly was Hamza's part? He is listed with other team members on one of them.
2. **Missions: naming.** Keep the clients anonymous (default), or name them? Naming needs agreement of ETIC and the client. Hamza named one client's parent group in his message and spelled another client's name differently from the proposal; do not name anyone until he confirms spelling and permission.
3. **J'ai PiGé:** the CV lists it as a personal project (June to August 2026) while an ETIC proposal calls it an ETIC mission. Which is right? It changes how it is described (see `../projects/jai-pige.json`).
4. **Propulseo and Asys:** what is Propulseo (program, incubator, association?), since when, what did Asys do ("propulsé par Asys")? How should it be worded?
5. **KTH double degree:** programme name, exact dates, admission confirmed or still pending, and what happens to the 5th year at INSA Lyon.
6. **Delta Quest:** may figures be published for the latency reduction and relevance improvement? Only with a verifiable source; otherwise keep the qualitative wording.
7. **Dates:** exact start and end months for tutoring (CV gives 2023 to 2026), the Entrepreneurship Track and the Georges Besse Foundation.

## Rules specific to this folder

- Never attribute ETIC's other references (shown in its proposals) to Hamza.
- `openQuestions` and `internalNote` must not contain client names, amounts, prices, or names of third parties.
- Do not copy sentences from ETIC proposals: describe the work in your own words, anonymised.
