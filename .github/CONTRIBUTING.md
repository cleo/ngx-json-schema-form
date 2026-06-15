# Contributing to JSON Schema Form

This guide describes, at a high level, what a typical change to the JSF repo should look
like. It captures the conventions this codebase follows so that changes stay consistent
and ship cleanly to consumers (notably the **crowsnest** client).

## Repo layout

This is an Angular workspace with three projects:

| Project | Path | Purpose |
| --- | --- | --- |
| `jsf` | `projects/jsf` | The published front-end library (`@cleo/ngx-json-schema-form`). Renders a form from a JSON Schema object. |
| `jsf-validation` | `projects/jsf-validation` | The published back-end validation library (`@cleo/ngx-json-schema-form-validation`). |
| `jsf-launcher` | `projects/jsf-launcher` | A local demo/test harness app. Not published. |

## Tech baseline

- Angular 20, TypeScript 5.8, Node 22.x, ag-grid 35.
- Standalone components only — no NgModules.
- `@Input()`/`@Output()` are migrated to signals: use `input()`, `input.required()`, and
  `output()`.
- Use `inject()` for dependency injection, not constructor parameters.
- Use `@if` / `@for` control flow in templates, not `*ngIf` / `*ngFor`.
- React to input changes with `effect()`, not `ngOnChanges`.
- Components default to `ChangeDetectionStrategy.OnPush` — if you build/mutate state
  asynchronously (e.g. inside an `effect` reacting to a signal input), remember to call
  `ChangeDetectorRef.markForCheck()` so the view re-renders.

## Anatomy of a typical change

### 1. Library code (`projects/jsf/src/lib`)
- Make the focused change. Keep edits minimal and consistent with the surrounding code.
- Maintain **ag-grid backward compatibility** (see `.github/copilot-instructions.md`).

### 2. Public API (`projects/jsf/src/public_api.ts`)
- If you add a new public type, service, or component, export it here.

### 3. Tests (`*.spec.ts`)
- Add or update unit tests next to the file you changed.
- Cover the new behavior and its edge cases (e.g. an output should emit at the right time,
  and in the boundary cases — not just the happy path).

### 4. Demo app (`projects/jsf-launcher`)
- Wire up new inputs/outputs in `app.component.html` / `app.component.ts` so the behavior
  can be exercised locally. This is optional but preferred.

### 5. Docs
- Update `projects/jsf/README.md` (consumer-facing docs) when you add or change a public
  input/output/method. Follow the existing style.
- Add a `CHANGELOG.md` entry under a new version heading. Group entries under
  `### Bug Fix`, `### Enhancement`, or `### Breaking Changes`.

### 6. Version bump
- Bump the version in **both** `projects/jsf/package.json` and
  `projects/jsf-validation/package.json` together, following semver
  (e.g. `7.0.4` → `7.0.5`). The two libraries are versioned in lockstep.

## ag-grid backward compatibility

The **crowsnest** consumer still uses ag-grid 28, so always provide fallbacks for ag-grid
APIs that moved between versions. See `.github/copilot-instructions.md` for the exact
fallback patterns and selection-config rules.

## Before you finish

Run the unit tests and lint from the repo root:

```bash
npm run test            # jsf unit tests (Karma)
npm run test-validation # jsf-validation tests
npm run lint
```

For a quick headless run of just the library tests:

```bash
npx ng test jsf --watch=false --browsers=ChromeHeadless
```

## Testing in a consuming app

To build, pack, and install the library into **crowsnest** for local verification, follow
the build/pack/install steps in `.github/copilot-instructions.md`.
