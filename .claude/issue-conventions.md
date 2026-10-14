# Issue conventions

Review rules for work on `@nera-static/starter-blog`, run through Snagio from
`nera-starter-blog/`. The Snagio project **"Nera AI"** tracks
`../nera-cli/ROADMAP-ai.md` (starters are its **L5**, slice 5); its issues carry the
target repo as a title prefix. **Work an issue only from the repo it names** — the
step skills commit in the current repo.

The workspace `../CLAUDE.md` holds the fleet-wide rules (semver, CHANGELOG,
releases, publishing a brand-new package); this file only adds what a reviewer
checks per diff. Copied from `nera-starter-blank` (the first starter repo) and
adapted to a themed starter.

## Non-negotiables

- **Two specs, no own ROADMAP.** `../nera-cli/ROADMAP-ai.md` (L5 and "Slice 5 —
  progress") is the spec for the starter; `../generator/ROADMAP-themes.md`
  "Starter-ready themes" §S4 (`@nera-static/theme-blog`) and §S6 (what a starter
  must do so its theme passes) are the spec for how it uses the theme. Decisions go
  back into those sections. Extend them, never fork them.
- **The starter contract is what `nera new --starter` reads** (`nera-cli/src/starter.js`,
  `@nera-static/nera` ≥ 1.11.0): `package.json` with a `nera.starter`
  `{ label, description }` field and `keywords: ["nera-starter"]`; only `pages/`,
  `config/`, `theme/`, `assets/`, `plugins/` and `.neraignore` are copied into the
  site (starter wins); `dependencies` are merged into the site's (the site's own
  `@nera-static/nera` entry is kept); the README is printed after scaffolding, not
  copied. Anything else in the package never reaches a site — do not rely on it.
- **The blog starter uses `@nera-static/theme-blog`** (`theme: blog` in
  `config/app.yaml`) and the plugins the L5 line names: tags, page-pagination,
  feed, sitemap (plus code-blocks for `extra_css`). It follows §S6 to the letter:
  keeps a `theme/views/` folder with the vendor copies and seam overrides, ships
  **no** `nera:scaffold-default` files (they would shadow the theme's views), fills
  the §S4.2 seams (`post-media`, `card-media`, `post-tags`, `post-pagination`,
  `tag-overview`, `tag-cloud`, and `feed-link` once plugin-feed exists), sets
  `tag_overview_layout: 'pages/tag.pug'` in `config/tags.yaml` and
  `extra_css: ['/_nera/code-blocks.css']` in `config/theme.yaml`.
- **Prerequisites ship first.** `@nera-static/theme-blog` 1.0.x and
  `@nera-static/plugin-feed` must be on npm before this starter is built; a
  dependency that is not on npm is a blocker, not something to stub.
- **Semver + `CHANGELOG.md` in the same commit as the change** (Keep a Changelog,
  four-space bullets, `**BREAKING**:` prefix). Bump with
  `npm version <bump> --no-git-tag-version`. A starter has no update path (the site
  owns the files after `nera new`), so "breaking" means: a site scaffolded from the
  new version differs in a way a user following the old README would trip over.
- **Never publish or push.** No `npm publish`, no `git push`, no tags pushed, no repo
  created on GitHub, no posts anywhere public. The maintainer does the one-time
  bootstrap publish of 1.0.0 by hand, then a CI-published x.y.1 within ~2 days so the
  Trusted Publisher does not expire; the session hands over the exact commands.
- Paste-ready text for the maintainer goes in a fenced code block between
  `----- START: … -----` and `----- END -----` lines, never in a blockquote.

## Framework correctness

- A scaffolded site builds, validates and checks clean: `nera build`,
  `nera validate` and `nera check` report no problems on the starter's sample pages.
- Every sample post sets `date` (CI stamps every file with the same birth time),
  page bodies start at `##`, every image has an `alt`, translations of one page
  share a `slug`, and every theme `t()` key (§S2.6, §S4.3) plus `Pagination` is
  translated under `translations.<lang>`.
- `footer_links` in `config/theme.yaml` point at the imprint and privacy pages with
  labels the legal rules recognise; legal placeholders cite § 5 DDG and the TDDDG.
- `@nera-static/plugin-page-pagination` ≥ 2.4.0 (its `<nav>` carries an
  `aria-label`).
- Every sample page has a `layout`; `config/app.yaml` keeps the keys `--name`/`--lang`
  edit line by line (`name`, `lang`) and a `translations:` entry for its language.
- No `postinstall` or other lifecycle scripts (the CLI packs with
  `--ignore-scripts`, and a starter must not need them).
- `files` in `package.json` is limited to what a site receives plus `CHANGELOG.md`
  (`README.md`, `LICENSE` and `package.json` ship anyway).

## UI / template rules

- Sample content and docs in English. Enough sample posts to show every page type
  (home list, post with tags and prev/next, archive across at least two years, a tag
  page, a code block, the feed), and nothing a user would only delete.

## UI walkthrough

The starter has no interactive UI of its own; a browser test is normally skipped.
When one is wanted:

- Browser tooling: Playwright MCP (`mcp__playwright__browser_navigate`,
  `mcp__playwright__browser_snapshot`, `mcp__playwright__browser_console_messages`).
- Boot (a throwaway site from the *local* starter, never from npm):
  `R=$PWD; T=$(mktemp -d) && cd "$T" && npx @nera-static/nera new site --starter "$R" --yes && cd site && npx nera build && npx nera serve --port 3124`
  (Node 22 if npm crashes: `PATH=~/.nvm/versions/node/v22.22.0/bin:$PATH`). Delete
  `$T` afterwards.
- Base URL / login: http://localhost:3124/, no login.
- Surfaces:
    | surface | url | role | how to open |
    |---|---|---|---|
    | home (recent posts) | `/` | visitor | open the URL |
    | a post | a sample post's href | visitor | click a card on the home |
    | archive | the home's `archive_href` | visitor | "All posts" link |
    | tag page | `/tags/<slug>.html` | visitor | a tag pill on a post |

## Tests & hygiene

- `npx vitest run && npm run lint` must pass (`npm test` is watch mode — never use
  it here). Run from the package root.
- An integration test scaffolds a site from this folder with the published CLI
  (`nera new <tmp> --starter <this repo> --yes`), then builds, validates and checks it
  in a temp directory. Unit tests check the `package.json` contract.
- Generate the lockfile with npm ≥ 10.9 (Node 22); commit it before any workflow that
  runs `npm ci`.
- The repo matches the fleet: `.github/workflows/test.yml` and `publish.yml` copied
  from a recent package (`../nera-plugin-sitemap`), `.github/dependabot.yml`,
  `LICENSE`, `README.md` with the two badges linking https://nera.js.org.

## Reconciliation steps (run when resolving an issue)

- Version bump + `CHANGELOG.md` entry in the change's commit, if it ships in the
  tarball; none for tests, CI or `.claude/`.
- Update the L5 status and "Slice 5 — progress" in `../nera-cli/ROADMAP-ai.md`. On
  the first release, the slice-5 leftovers there become due: `--starter` in the
  template's `AGENTS.md` and the skill, the CLI docs page on nera.js.org. Those are
  commits in other repos — hand them over or file them as issues.
- Hand over the release commands (GitHub repo creation, `git push`, bootstrap
  `npm publish`, `git tag -a v<x.y.z> …`) — do not run them. After the GitHub remote
  exists: `../generator/scripts/fleet-check.sh --fix nera-starter-blog`.
- Remove the issue's plan files last, once nothing else needs them:
  `git rm` its tracked files under `plans/` (`plans/issues/<id>-*`,
  `plans/issues/browser-tests/<id>-*`, `plans/cloud/<id>-*`), delete the
  untracked ones, and commit
  `chore(plan): remove the plan files of the resolved <short title> issue`.
  Git history keeps them; `plans/` holds only open issues.

## Step order

<!-- The dependency ladder /plan-issue orders steps by: one rung per line, in
     dependency order, each with what it holds in THIS codebase and the Verify
     that proves a step on it is done. Leave "…" to use the skill's default
     (Data → Contract → Behaviour → UI → Docs). Examples to replace:

     Laravel:
     1. Data — migration, enum, model cast / relation, seeder — migrates up and down
     2. Contract — route + middleware, policy, Form Request, feature flag — feature
        test: valid input accepted, invalid refused
     3. Behaviour — actions, services, jobs, events, queries — `php artisan test --filter=…`
     4. UI — Livewire / Blade / Vue pages and components, labels — tests + walkthrough
     5. Docs — handbook, README

     Node / TypeScript:
     0. Toolchain — dependencies, tsconfig, build config — build and `tsc --noEmit` pass
     1. Data — Prisma / Drizzle migration, schema — applies and rolls back
     2. Contract — handler registration, guard, zod schema — `vitest run -t …`
     3. Behaviour — services, repositories, jobs — `vitest run -t …`
     4. Client — API functions, hooks, stores — `tsc --noEmit`
     5. UI — components, i18n strings — `tsc` + walkthrough
     6. Docs — README, ADRs -->

- …
