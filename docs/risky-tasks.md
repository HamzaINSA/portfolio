# Tasks where you must ask Hamza first

Hamza trusts you with technical choices, but these tasks have consequences for his reputation, his privacy, his accounts or the project history. **Stop and ask before doing them.** Ask in French, one question at a time: state the situation, give 2 to 4 options, recommend one, explain the consequence of each. Wait for the answer.

| # | Task | Why it is risky | What to ask |
|---|---|---|---|
| 1 | Publishing any personal data (phone, address, photo, personal email, date of birth) | Public forever once indexed; privacy | Which exact data, in which form |
| 2 | Naming a client or mission detail; publishing anything marked `to_confirm`; changing a claim or a number in `content/` | Confidentiality, credibility, possible breach of ETIC or client terms | Confirmation that the fact is true and may be public |
| 3 | Writing new facts about Hamza (bio, motivations, achievements) | A false claim can cost him an offer | Offer a draft based on sources; he approves |
| 4 | Choosing a deployment platform, buying or configuring a domain, DNS, creating any account | Costs, accounts, lock-in | Options (decision O1) with recommendation |
| 5 | Adding a third-party service or script: analytics, form backend, fonts from a CDN, embeds, chat APIs, email services | Breaks the privacy promise and rule D5 | Why it is needed, alternatives without it |
| 6 | Adding a runtime dependency, or upgrading a major version of Astro, TypeScript or a test tool | Maintenance and security surface | Justification, size, alternatives |
| 7 | Changing the stack or any **decided** item in `decisions.md` | Re-opens validated choices | The concrete problem found |
| 8 | Any use of a language model or an external API, including semantic search with a downloaded model (decision O9) | Cost, privacy, loss of determinism | Whether to do it at all, after V1 is live |
| 9 | Force-push, rewriting history, deleting branches or tags, changing repository settings, branch protection, secrets or Actions secrets | Irreversible or affects the account | Exact change and reason |
| 10 | Removing sensitive data that was committed by mistake (history rewrite) | Public history; needs a planned procedure | Whether to proceed; warn that already-cloned copies may exist |
| 11 | Choosing a licence for the code or the content (decision O6) | Legal effect | Options and consequences |
| 12 | Writing the legal notice and privacy page (decision O7) | Legal effect; you are not a lawyer | A draft, validated by Hamza |
| 13 | Significant deviation from the validated mockups (layout, colours, typography, new sections, removing sections) | Hamza validated these screens | Show the difference and the reason |
| 14 | Deleting or renaming files in `content/` or changing a schema in a breaking way | Can break content or the chatbot | The migration plan |
| 15 | Anything that sends data out of the site (contact form backend, newsletters, webhooks) | Visitor data leaves the browser | Purpose and data involved |

## Always allowed without asking

Code, tests, refactors inside the agreed architecture, documentation fixes, accessibility and performance improvements that do not change the design, content validation scripts, CI configuration (without secrets).

## When in doubt

Ask. A short question costs less than a wrong public claim.
