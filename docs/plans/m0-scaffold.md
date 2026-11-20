# Plan M0: tooling and repository hygiene

Branch: `chore/scaffold`. One commit per step, one PR at the end.

- [x] 1. Astro (static) + TypeScript strict, Node pinned (`.nvmrc`, `engines`)
- [x] 2. ESLint + Prettier (with Astro support)
- [x] 3. Vitest with a first unit test
- [x] 4. Playwright + axe with a smoke test on the placeholder page
- [x] 5. `scripts/check-content.ts` skeleton with `--strict`
- [x] 6. GitHub Actions CI (typecheck, lint, unit, check:content, build, e2e)
- [x] 7. Update the commands list in `CLAUDE.md` if it differs
- [ ] 8. Open the PR

Done when: CI is green on the PR and `npm run build` produces a static site.

## Points to settle later (found while planning)

- `CLAUDE.md` says `npm run build` runs `check:content --strict`, but `content/` still has `to_confirm` items and an empty `contact.email`, so a strict build fails until M7. In M0 the build does not run the gate; wiring it (strict on `main` only) is part of M1.
- TypeScript 6.x, not 7: `@astrojs/check` does not support 7 yet (peer dependency).
