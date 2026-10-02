# SANKET Bharat

Browser-only crisis review prototype. **DEMO ONLY — use synthetic details.**

AI assists; authorized humans decide is the intended production principle. Current review buttons are simulated local actions, not authenticated authority decisions.

## Current functionality

- Local form examples and review/history state using React Context and localStorage.
- IndexedDB queue with optional local image Blobs; while the app is open, examples can be copied into the browser demo. No upload or authority receipt.
- Static India map with illustrative seed coordinates; local form coordinates remain unknown.
- Template suggestions and simulated report/recommendation review. No deployment or communication.
- Fixed illustrative charts, with unsupported operational measurements shown as Not available.
- Labelled CSV evaluation using English keyword rules; computed dataset metrics do not establish authenticity, urgency, real-world accuracy or dispatch safety.
- Partial English/Hindi interface.

## Data boundaries

Records carry dataMode (demo/evaluation/pilot), isSimulation and provenance (origin, sourceId, parents). Nested source notes, recommendations, allocations, decisions and events retain metadata.

Seeds and local form examples are demo records. Uploaded rows and promotions remain evaluation records. Pilot is disabled; pilot/foreign-mode browser records and cross-mode evidence are refused. Social examples are fictional demo notes, never corroboration. No communications capability exists.

Old browser records are treated as legacy sandbox data, never trusted as pilot data. Browser state and metadata remain editable by the local user; this is not a security boundary or server authorization.

## Routes

/, /report, /admin, /ai-analysis, /dashboard, /live-map, /evaluation, /privacy-policy.

## Development

Use **Node 24 LTS (>=24.19.0, <25)** and **npm 11**. `.nvmrc` selects Node 24; `packageManager` pins npm 11.9.0 and `.npmrc` enforces the engine requirements. `package-lock.json` is the authoritative lockfile. Do not regenerate a pnpm lockfile.

    npm ci
    npm run typecheck
    npm run lint
    npm run test:foundation
    npm run build
    npm run test:smoke
    npx playwright install --with-deps chromium --only-shell
    npm run test:browser
    npm run verify

`typecheck` generates Next route types before checking TypeScript, so it also works in a clean checkout. Production builds use Next's normal TypeScript validation; type errors fail the build. Lint uses the matching Next 16 flat presets and fails on warnings. Node's built-in test runner preserves the foundation regressions; focused Playwright tests exercise the production build in Chromium with synthetic details and external requests blocked.

`verify` runs typecheck, lint, foundation tests, build, HTTP smoke and browser tests in sequence. Install the test browser first. GitHub Actions runs these gates on pushes and pull requests; it does not deploy. HTTP smoke uses port 3101 and verifies server-rendered route notices; it cannot replace browser interaction tests. Browser tests use port 3100 and refuse to reuse an existing server. `SANKET_TEST_CHROMIUM_PATH` can select a locally installed Chromium when the standard download is unavailable.

ESLint 9 is retained because the current Next plugin dependency graph does not support ESLint 10 throughout. ESLint 9 emits an upstream end-of-life warning; revisit this tooling dependency when Next's plugins support the current ESLint major. Narrow hydration/capability exceptions are explained inline; no application-wide React hook rule is disabled. CommonJS imports are permitted only in the existing Node test files.

## Lifecycle design and limits

See [the transition design](docs/lifecycle-design.md). Report verification, incident lifecycle, recommendation approval and assignment authorization are separate. Small safety repairs remove approval=dispatch and rejection=containment. Arbitrary status/assignment helpers refuse to run. The full lifecycle, authenticated actors, canonical cases, server transactions and transport are not implemented.

No government partnership, live feed, social API, AI inference service, authoritative resource inventory, emergency dispatch, notifications, validated accuracy or rescue outcome is claimed.

## Storage and privacy

localStorage and IndexedDB survive tab closure until cleared/evicted; no automatic retention/deletion or application encryption is implemented. Online image selection retains a filename only; offline Blobs remain local. Name/contact are optional and should be synthetic. Production builds include Vercel Analytics and font resources may load externally. Do not enter real emergency or sensitive personal data.

This prototype must not be used as an emergency reporting or dispatch service.
